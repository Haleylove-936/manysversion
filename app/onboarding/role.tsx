import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { UserRole } from '@/shared/app-types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const ROLES: { role: UserRole; emoji: string; title: string; description: string }[] = [
  {
    role: 'elder',
    emoji: '👴',
    title: "I'm the Elder",
    description: 'I want to share my stories and memories with my family.',
  },
  {
    role: 'organizer',
    emoji: '👨‍👩‍👧',
    title: "I'm the Organizer",
    description: 'I want to set up the family vault and invite relatives.',
  },
  {
    role: 'relative',
    emoji: '👶',
    title: "I'm a Relative",
    description: 'I want to listen to and explore family stories.',
  },
];

export default function RoleSelectScreen() {
  const colors = useColors();
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);

  const handleSelect = (role: UserRole) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(role);
  };

  const handleContinue = () => {
    if (!selected) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: '/onboarding/setup', params: { role: selected } } as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}>
            <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Who are you?</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            This helps us show you the right experience.
          </Text>
        </View>

        {/* Role Cards */}
        <View style={styles.cards}>
          {ROLES.map(({ role, emoji, title, description }) => {
            const isSelected = selected === role;
            return (
              <Pressable
                key={role}
                style={({ pressed }) => [
                  styles.card,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
                onPress={() => handleSelect(role)}
              >
                <Text style={styles.cardEmoji}>{emoji}</Text>
                <View style={styles.cardText}>
                  <Text style={[styles.cardTitle, { color: isSelected ? '#FFFFFF' : colors.foreground }]}>
                    {title}
                  </Text>
                  <Text style={[styles.cardDesc, { color: isSelected ? 'rgba(255,255,255,0.8)' : colors.muted }]}>
                    {description}
                  </Text>
                </View>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Continue */}
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            { backgroundColor: selected ? colors.primary : colors.border },
            pressed && selected && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
          onPress={handleContinue}
          disabled={!selected}
        >
          <Text style={[styles.continueText, { color: selected ? '#FFFFFF' : colors.muted }]}>
            Continue
          </Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  header: {
    gap: 8,
  },
  backBtn: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 17,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
  },
  cards: {
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
  },
  cardEmoji: {
    fontSize: 36,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 15,
    lineHeight: 22,
  },
  checkmark: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  continueButton: {
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  continueText: {
    fontSize: 19,
    fontWeight: '700',
  },
});
