import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  )
);

export function getFirebaseProjectId(): string | null {
  const projectId =
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    process.env.VITE_FIREBASE_PROJECT_ID?.trim();
  if (!projectId || projectId.startsWith('YOUR_') || projectId.includes('SUA_')) {
    return null;
  }
  return projectId;
}

export function extractBearerToken(
  authorization: string | string[] | undefined
): string | null {
  const header = Array.isArray(authorization) ? authorization[0] : authorization;
  if (!header) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(header.trim());
  return match?.[1] ?? null;
}

export type VerifiedFirebaseUser = {
  uid: string;
  payload: JWTPayload;
};

/** Valida ID token do Firebase Auth (inclui usuários anônimos). */
export async function verifyFirebaseIdToken(
  token: string,
  projectId: string
): Promise<VerifiedFirebaseUser> {
  const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  if (typeof payload.sub !== 'string' || !payload.sub) {
    throw new Error('Token sem subject');
  }

  return { uid: payload.sub, payload };
}
