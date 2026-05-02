import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function WelcomeScreen() {
  const colors = useColors();
  const router = useRouter();

  const handleGetStarted = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/role' as never);
  };

  const handleJoinFamily = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/onboarding/join' as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
            <Text style={styles.iconEmoji}>📖</Text>
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>LegacyBox</Text>
          <Text style={[styles.tagline, { color: colors.foreground }]}>
            Preserve the stories{'\n'}behind the photos.
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            A family memory vault for recording the wisdom, recipes, and life stories of those you love — before they're lost.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleGetStarted}
          >
            <Text style={[styles.primaryButtonText, { color: '#FFFFFF' }]}>
              Start a Family Vault
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { borderColor: colors.primary },
              pressed && { opacity: 0.7 },
            ]}
            onPress={handleJoinFamily}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Join a Family Vault
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={[styles.footer, { color: colors.muted }]}>
          Stories stay private. Only your family can see them.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconEmoji: {
    fontSize: 48,
  },
  appName: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 26,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  actions: {
    gap: 14,
    marginBottom: 16,
  },
  primaryButton: {
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 19,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 19,
    fontWeight: '600',
  },
  footer: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
