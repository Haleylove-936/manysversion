import * as admin from "firebase-admin";
import { ENV } from "./env";

let _app: admin.app.App | null = null;

export function getFirebaseAdmin(): admin.app.App {
  if (_app) return _app;

  if (!ENV.firebaseProjectId || !ENV.firebaseClientEmail || !ENV.firebasePrivateKey) {
    throw new Error("Firebase Admin config missing: set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY");
  }

  _app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: ENV.firebaseProjectId,
      clientEmail: ENV.firebaseClientEmail,
      privateKey: ENV.firebasePrivateKey,
    }),
    storageBucket: ENV.firebaseStorageBucket,
  });

  return _app;
}

export async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  const app = getFirebaseAdmin();
  return admin.auth(app).verifyIdToken(idToken);
}

export async function getFirebaseUser(uid: string): Promise<admin.auth.UserRecord> {
  const app = getFirebaseAdmin();
  return admin.auth(app).getUser(uid);
}
