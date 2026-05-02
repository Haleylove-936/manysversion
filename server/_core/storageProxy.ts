import type { Express } from "express";

// Storage proxy no longer needed.
// Firebase Storage and Cloudflare R2 serve files directly via their own URLs.
// This file is kept as a no-op so existing imports don't break during migration.
export function registerStorageProxy(_app: Express) {}
