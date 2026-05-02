import { useCallback, useEffect, useState } from "react";
import { getFirebaseAuth, onAuthStateChanged, logout as firebaseLogout, setUserInfo, clearAuth, type User } from "@/lib/_core/auth";
import { syncUser } from "@/lib/_core/api";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Sync to Firestore and get server-side user (includes role, subscriptionTier etc.)
        const result = await syncUser();
        const serverUser: User = result?.user ?? {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? null,
          name: firebaseUser.displayName ?? null,
          role: "user",
        };
        await setUserInfo(serverUser);
        setUser(serverUser);
      } else {
        await clearAuth();
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    await firebaseLogout();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  };
}
