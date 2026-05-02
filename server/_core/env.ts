export const ENV = {
  isProduction: process.env.NODE_ENV === "production",

  // Firebase Admin
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? "",
  firebasePrivateKey: (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n"),

  // Firebase Storage (images/photos)
  firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? "",

  // Cloudflare R2 (audio files — no egress fees)
  r2AccountId: process.env.R2_ACCOUNT_ID ?? "",
  r2AccessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
  r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
  r2BucketName: process.env.R2_BUCKET_NAME ?? "",
  r2PublicUrl: process.env.R2_PUBLIC_URL ?? "", // your r2.dev or custom domain

  // Groq (Whisper transcription)
  groqApiKey: process.env.GROQ_API_KEY ?? "",

  // OpenAI / LLM (Gemini via OpenAI-compatible endpoint if needed)
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",

  // RevenueCat webhook secret
  revenueCatWebhookSecret: process.env.REVENUECAT_WEBHOOK_SECRET ?? "",

  // Session
  cookieSecret: process.env.JWT_SECRET ?? "",

  // Owner
  ownerUid: process.env.OWNER_UID ?? "",
};
