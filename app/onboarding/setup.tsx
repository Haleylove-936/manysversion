import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useStore } from '@/lib/store';
import { UserRole } from '@/shared/app-types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { pickProfilePicture, getInitials, getAvatarColor } from '@/lib/profile-picture-service';

export default function FamilySetupScreen() {
  const colors = useColors();
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: UserRole }>();
  const { completeOnboarding } = useStore();

  const [name, setName] = useState('');
  const [vaultName, setVaultName] = useState('');
  const [profilePictureUri, setProfilePictureUri] = useState<string | null>(null);

  const isElder = role === 'elder';
  const canContinue = name.trim().length > 0 && vaultName.trim().length > 0;

  const handleAddProfilePicture = async () => {
    const uri = await pickProfilePicture();
    if (uri) {
      setProfilePictureUri(uri);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleStart = () => {
    if (!canContinue) return;
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    completeOnboarding(role ?? 'relative', name.trim(), vaultName.trim());
    router.replace('/(tabs)' as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
              <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
            </Pressable>
            <Text style={[styles.title, { color: colors.foreground }]}>
              {isElder ? 'Tell us about yourself' : 'Set up your family vault'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              {isElder
                ? 'Your family will see your name when they listen to your stories.'
                : 'Give your family vault a name so relatives can find it.'}
            </Text>
          </View>

          {/* Profile Picture */}
          <View style={styles.profileSection}>
            <Pressable
              style={({ pressed }) => [
                styles.profilePictureButton,
                { backgroundColor: profilePictureUri ? colors.surface : getAvatarColor('new-member') },
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleAddProfilePicture}
            >
              {profilePictureUri ? (
                <Text style={styles.profilePictureEmoji}>📷</Text>
              ) : (
                <Text style={styles.profileInitials}>{getInitials(name || 'You')}</Text>
              )}
            </Pressable>
            <Text style={[styles.profileLabel, { color: colors.muted }]}>
              {profilePictureUri ? 'Photo added' : 'Add a profile picture (optional)'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Your Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder={isElder ? 'e.g., Grandma Rose' : 'e.g., Sarah'}
                placeholderTextColor={colors.muted}
                value={name}
                onChangeText={setName}
                returnKeyType="next"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>Family Vault Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.foreground }]}
                placeholder="e.g., The Johnson Family"
                placeholderTextColor={colors.muted}
                value={vaultName}
                onChangeText={setVaultName}
                returnKeyType="done"
                autoCapitalize="words"
                onSubmitEditing={handleStart}
              />
              <Text style={[styles.hint, { color: colors.muted }]}>
                You can invite family members after setup.
              </Text>
            </View>
          </View>

          {/* What to expect */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>What happens next?</Text>
            {isElder ? (
              <>
                <Text style={[styles.infoItem, { color: colors.muted }]}>📖 You'll get one question at a time</Text>
                <Text style={[styles.infoItem, { color: colors.muted }]}>🎙️ Just tap a button to record your answer</Text>
                <Text style={[styles.infoItem, { color: colors.muted }]}>👨‍👩‍👧 Your family will treasure your stories</Text>
              </>
            ) : (
              <>
                <Text style={[styles.infoItem, { color: colors.muted }]}>📬 Invite family members to join</Text>
                <Text style={[styles.infoItem, { color: colors.muted }]}>🎙️ Record your own memories too</Text>
                <Text style={[styles.infoItem, { color: colors.muted }]}>🔍 Search and browse the family archive</Text>
              </>
            )}
          </View>

          {/* Start Button */}
          <Pressable
            style={({ pressed }) => [
              styles.startButton,
              { backgroundColor: canContinue ? colors.primary : colors.border },
              pressed && canContinue && { opacity: 0.85, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleStart}
            disabled={!canContinue}
          >
            <Text style={[styles.startText, { color: canContinue ? '#FFFFFF' : colors.muted }]}>
              Open the Vault ✨
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 28,
  },
  header: {
    gap: 10,
  },
  backText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 25,
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
  },
  input: {
    fontSize: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  hint: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 10,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  startButton: {
    paddingVertical: 22,
    borderRadius: 16,
    alignItems: 'center',
  },
  startText: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileSection: {
    alignItems: 'center',
    gap: 12,
  },
  profilePictureButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitials: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profilePictureEmoji: {
    fontSize: 48,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
