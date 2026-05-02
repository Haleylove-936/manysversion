import { getIdToken } from "./auth";

const API_BASE = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getIdToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `API error ${res.status}`);
  }

  const ct = res.headers.get("content-type");
  if (ct?.includes("application/json")) return res.json() as Promise<T>;
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
}

// Sync Firebase user to Firestore after sign-in
export async function syncUser(): Promise<{ user: any } | null> {
  try {
    return await apiCall<{ user: any }>("/api/auth/sync", { method: "POST" });
  } catch (e) {
    console.error("[API] syncUser failed:", e);
    return null;
  }
}

export async function getMe(): Promise<any | null> {
  try {
    const res = await apiCall<{ user: any }>("/api/auth/me");
    return res.user ?? null;
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  // Firebase sign-out is handled client-side in auth.ts
  // Nothing to call on the server for logout
}
