import { getFirebaseAuth, getFirebaseApp } from "@/lib/_core/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signInWithPopup,
} from "firebase/auth";
import { Platform } from "react-native";

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");

export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

// ── Email/Password ─────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUpWithEmail(email: string, password: string) {
  const auth = getFirebaseAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

// ── Google Sign-In ─────────────────────────────────────────────────────────
// On native: use @react-native-google-signin/google-signin, pass credential here
// On web: use signInWithPopup

export async function signInWithGoogle(idToken?: string) {
  const auth = getFirebaseAuth();
  if (Platform.OS === "web") {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }
  // Native: idToken comes from @react-native-google-signin/google-signin
  if (!idToken) throw new Error("Google idToken required on native");
  const credential = GoogleAuthProvider.credential(idToken);
  return signInWithCredential(auth, credential);
}

// ── Apple Sign-In ──────────────────────────────────────────────────────────
// On native: use expo-apple-authentication, pass credential here

export async function signInWithApple(idToken: string, nonce: string) {
  const auth = getFirebaseAuth();
  const provider = new OAuthProvider("apple.com");
  const credential = provider.credential({ idToken, rawNonce: nonce });
  return signInWithCredential(auth, credential);
}
