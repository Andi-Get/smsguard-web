import { auth } from "@/lib/auth";
import {
  createPairingToken,
  PAIRING_TTL_MS,
  resolveAppOrigin,
} from "@/lib/pairing";
import { db } from "@/prisma/db";

/**
 * Starts a device pairing. The response contains the only copy of the raw
 * token; the database stores its SHA-256 hash.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  const now = new Date();
  const nowIso = now.toISOString();
  const expiresAt = new Date(now.getTime() + PAIRING_TTL_MS);
  const expiresAtIso = expiresAt.toISOString();
  const { token, tokenHash } = createPairingToken();
  const url = `${resolveAppOrigin(request)}/link/${token}`;

  try {
    await db.transaction(async (tx) => {
      // Only the newest code for a user should stay usable.
      await tx.orm.public.DevicePairing.where({
        userId: session.user.id,
        status: "pending",
      }).update({ status: "expired", updatedAt: nowIso });

      await tx.orm.public.DevicePairing.create({
        tokenHash,
        status: "pending",
        expiresAt: expiresAtIso,
        userId: session.user.id,
        createdAt: nowIso,
        updatedAt: nowIso,
      });
    });
  } catch {
    return Response.json(
      { error: "Could not create a pairing code." },
      { status: 500 },
    );
  }

  return Response.json(
    {
      token,
      url,
      expiresAt: expiresAt.toISOString(),
      expiresIn: Math.floor(PAIRING_TTL_MS / 1000),
    },
    {
      status: 201,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
