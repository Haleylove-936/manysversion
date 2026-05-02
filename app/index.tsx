import { useStore } from '@/lib/store';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useColors } from '@/hooks/use-colors';

export default function IndexScreen() {
  const { state } = useStore();
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    // Small delay to let AsyncStorage hydrate
    const timer = setTimeout(() => {
      if (!state.hasOnboarded) {
        router.replace('/onboarding/welcome' as never);
      } else {
        router.replace('/(tabs)' as never);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [state.hasOnboarded, router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator color={colors.primary} size="large" />
    </View>
  );
}
