// Firestore collection type definitions
// No SQL schema needed — Firestore is schemaless.
// These types mirror server/db.ts and are shared for type safety.

export type User = {
  uid: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
  loginMethod: string | null;
  createdAt: string;
  lastSignedIn: string;
  subscriptionTier: "free" | "paid";
};

export type Memory = {
  id: string;
  uid: string;
  vaultId: string;
  title: string;
  theme: string;
  promptId?: string;
  promptText?: string;
  audioUrl?: string;
  photoUrl?: string;
  transcript?: string;
  notes?: string;
  durationSeconds: number;
  recordedBy: string;
  createdAt: string;
};

export type Vault = {
  id: string;
  name: string;
  inviteCode: string;
  ownerUid: string;
  memberUids: string[];
  createdAt: string;
};
