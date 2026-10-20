import { parseDeviceSubmission } from "@/lib/device-input";
import { hashPairingToken, isPairingExpired } from "@/lib/pairing";
import { db } from "@/prisma/db";

type Context = { params: Promise<{ token: string }> };

function isUniqueViolation(error: unknown) {
  return (
    error instanceof Error &&
    /duplicate key|unique constraint|unique violation/i.test(error.message)
  );
}

/**
 * Called by the SMSGuard mobile app after it scans the QR code. The one-time
 * token authorizes the write; no web session is required.
 */
export async function POST(request: Request, context: Context) {
  const { token } = await context.params;

  if (!token || token.length < 20) {
    return Response.json({ error: "Pairing code not found." }, { status: 404 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  const input = parseDeviceSubmission(body);

  if (!input.ok) {
    return Response.json({ error: input.error }, { status: 400 });
  }

  const tokenHash = hashPairingToken(token);

  try {
    const result = await db.transaction(async (tx) => {
      const pairing = await tx.orm.public.DevicePairing.where({
        tokenHash,
      })
        .forUpdate()
        .first();

      if (!pairing) {
        return { kind: "not_found" } as const;
      }

      if (pairing.status === "claimed") {
        return {
          kind: "already_claimed",
          deviceId: pairing.deviceId,
        } as const;
      }

      if (
        pairing.status !== "pending" ||
        isPairingExpired(pairing.expiresAt)
      ) {
        if (pairing.status === "pending") {
          await tx.orm.public.DevicePairing.where({ id: pairing.id }).update({
            status: "expired",
            updatedAt: new Date().toISOString(),
          });
        }

        return { kind: "expired" } as const;
      }

      const now = new Date();
      const nowIso = now.toISOString();
      const device = await tx.orm.public.Device.select(
        "id",
        "name",
        "brand",
        "model",
      ).create({
        userId: pairing.userId,
        name: input.value.name ?? `${input.value.brand} ${input.value.model}`,
        brand: input.value.brand,
        model: input.value.model,
        manufacturer: input.value.manufacturer,
        deviceType: input.value.deviceType,
        serialNumber: input.value.serialNumber,
        imei: input.value.imei,
        imei2: input.value.imei2,
        meid: input.value.meid,
        imsi: input.value.imsi,
        iccid: input.value.iccid,
        phoneNumber: input.value.phoneNumber,
        platform: input.value.platform,
        osVersion: input.value.osVersion,
        appVersion: input.value.appVersion,
        status: input.value.status,
        lastSeenAt: nowIso,
        createdAt: nowIso,
        updatedAt: nowIso,
      });

      await tx.orm.public.DevicePairing.where({ id: pairing.id }).update({
        status: "claimed",
        claimedAt: nowIso,
        deviceId: device.id,
        updatedAt: nowIso,
      });

      return { kind: "ok", device } as const;
    });

    if (result.kind === "not_found") {
      return Response.json(
        { error: "Pairing code not found." },
        { status: 404 },
      );
    }

    if (result.kind === "expired") {
      return Response.json(
        { error: "This pairing code has expired. Generate a new one." },
        { status: 410 },
      );
    }

    if (result.kind === "already_claimed") {
      return Response.json(
        {
          error: "This pairing code has already been used.",
          deviceId: result.deviceId,
        },
        { status: 409 },
      );
    }

    return Response.json({ device: result.device }, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return Response.json(
        {
          error:
            "A device with that IMEI, MEID or serial number already exists.",
        },
        { status: 409 },
      );
    }

    return Response.json(
      { error: "Could not register this device." },
      { status: 500 },
    );
  }
}
