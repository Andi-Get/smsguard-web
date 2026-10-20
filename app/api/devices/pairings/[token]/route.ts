import { hashPairingToken, isPairingExpired } from "@/lib/pairing";
import { db } from "@/prisma/db";

type Context = { params: Promise<{ token: string }> };

/**
 * Public status check for the mobile app and the pairing dialog. The token is
 * the credential, so this deliberately returns no account details.
 */
export async function GET(_request: Request, context: Context) {
  const { token } = await context.params;

  if (!token || token.length < 20) {
    return Response.json({ error: "Pairing code not found." }, { status: 404 });
  }

  const pairing = await db.orm.public.DevicePairing.where({
    tokenHash: hashPairingToken(token),
  }).first();

  if (!pairing) {
    return Response.json({ error: "Pairing code not found." }, { status: 404 });
  }

  let status = pairing.status;

  if (status === "pending" && isPairingExpired(pairing.expiresAt)) {
    status = "expired";
    await db.orm.public.DevicePairing.where({ id: pairing.id }).update({
      status,
      updatedAt: new Date().toISOString(),
    });
  }

  return Response.json(
    {
      status,
      expiresAt: pairing.expiresAt,
      claimedAt: pairing.claimedAt,
      deviceId: pairing.deviceId,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
