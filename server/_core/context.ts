import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifyIdToken } from "./firebaseAdmin";
import { getUserByUid } from "../db";

export type AuthUser = {
  uid: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AuthUser | null;
};

export async function createContext(opts: CreateExpressContextOptions): Promise<TrpcContext> {
  let user: AuthUser | null = null;

  try {
    const authHeader = opts.req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const idToken = authHeader.slice(7).trim();
      const decoded = await verifyIdToken(idToken);
      const dbUser = await getUserByUid(decoded.uid);
      user = dbUser ?? {
        uid: decoded.uid,
        email: decoded.email ?? null,
        name: decoded.name ?? null,
        role: "user",
      };
    }
  } catch {
    user = null;
  }

  return { req: opts.req, res: opts.res, user };
}
