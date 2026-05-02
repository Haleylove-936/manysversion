// Firebase handles auth entirely on the client (sign-in, token refresh).
// The server only needs one endpoint: verify the Firebase ID token and
// upsert the user into Firestore so we have a server-side user record.

import type { Express, Request, Response } from "express";
import { verifyIdToken } from "./firebaseAdmin";
import { upsertUser, getUserByUid } from "../db";

export function registerAuthRoutes(app: Express) {
  // Called by the client after Firebase sign-in to sync user to Firestore
  // and confirm the token is valid server-side.
  app.post("/api/auth/sync", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing Bearer token" });
      return;
    }

    try {
      const idToken = authHeader.slice(7).trim();
      const decoded = await verifyIdToken(idToken);

      await upsertUser(decoded.uid, {
        email: decoded.email ?? null,
        name: decoded.name ?? null,
        loginMethod: decoded.firebase?.sign_in_provider ?? null,
      });

      const user = await getUserByUid(decoded.uid);
      res.json({ user });
    } catch (e) {
      console.error("[Auth] sync failed:", e);
      res.status(401).json({ error: "Invalid token" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ user: null });
      return;
    }

    try {
      const decoded = await verifyIdToken(authHeader.slice(7).trim());
      const user = await getUserByUid(decoded.uid);
      res.json({ user });
    } catch {
      res.status(401).json({ user: null });
    }
  });
}
