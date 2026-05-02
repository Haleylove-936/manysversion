import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useColors } from '@/hooks/use-colors';

// Redirect to the first onboarding step
export default function OnboardingIndex() {
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    router.replace('/onboarding/welcome' as never);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}
