import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "",
};

export function getFirebaseApp() {
  return getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export type User = {
  uid: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
};

const ID_TOKEN_KEY = "firebase_id_token";
const USER_INFO_KEY = "firebase_user_info";

async function secureGet(key: string): Promise<string | null> {
  if (Platform.OS === "web") return window.localStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function secureSet(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") { window.localStorage.setItem(key, value); return; }
  await SecureStore.setItemAsync(key, value);
}

async function secureDel(key: string): Promise<void> {
  if (Platform.OS === "web") { window.localStorage.removeItem(key); return; }
  await SecureStore.deleteItemAsync(key);
}

export async function getIdToken(): Promise<string | null> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) {
    // Always get a fresh token (Firebase refreshes automatically if expired)
    return auth.currentUser.getIdToken();
  }
  return secureGet(ID_TOKEN_KEY);
}

export async function cacheIdToken(token: string): Promise<void> {
  await secureSet(ID_TOKEN_KEY, token);
}

export async function getUserInfo(): Promise<User | null> {
  const raw = await secureGet(USER_INFO_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export async function setUserInfo(user: User): Promise<void> {
  await secureSet(USER_INFO_KEY, JSON.stringify(user));
}

export async function clearAuth(): Promise<void> {
  await secureDel(ID_TOKEN_KEY);
  await secureDel(USER_INFO_KEY);
}

export async function logout(): Promise<void> {
  await signOut(getFirebaseAuth());
  await clearAuth();
}

export { onAuthStateChanged, type FirebaseUser };
