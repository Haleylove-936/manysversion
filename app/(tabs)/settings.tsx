import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useStore } from '@/lib/store';
import { Fonts } from '@/lib/_core/theme';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View, Pressable, ScrollView, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { pickProfilePicture, getInitials, getAvatarColor } from '@/lib/profile-picture-service';
import * as Haptics from 'expo-haptics';
import { UserRole } from '@/shared/app-types';

const ROLE_LABELS: Record<UserRole, string> = {
  elder: '👴 Elder',
  organizer: '👨‍👩‍👧 Organizer',
  relative: '👶 Relative',
};

function SettingRow({
  emoji,
  label,
  value,
  onPress,
  destructive,
}: {
  emoji: string;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && onPress && { opacity: 0.7 },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.settingEmoji}>{emoji}</Text>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, { color: destructive ? colors.error : colors.foreground }]}>
          {label}
        </Text>
        {value && <Text style={[styles.settingValue, { color: colors.muted }]}>{value}</Text>}
      </View>
      {onPress && <Text style={[styles.settingChevron, { color: colors.muted }]}>›</Text>}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, updateMember, dispatch } = useStore();
  const [editingProfilePicture, setEditingProfilePicture] = useState(false);

  const { userName, userRole, familyVault, members, memories } = state;
  const isOrganizer = userRole === 'organizer';
  const currentMember = members[0];

  const handleUpdateProfilePicture = async () => {
    if (!currentMember) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const uri = await pickProfilePicture();
    if (uri) {
      updateMember({ ...currentMember, profilePictureUri: uri });
      setEditingProfilePicture(false);
    }
  };

  const handleInvite = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/invite' as never);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Everything?',
      'This will delete all your memories and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'RESET' });
            router.replace('/onboarding/welcome' as never);
          },
        },
      ]
    );
  };

  // ELDER/RELATIVE: Minimal settings view
  if (!isOrganizer) {
    return (
      <ScreenContainer containerClassName="bg-background">
        <ScrollView
          style={{ flex: 1, backgroundColor: 'transparent' }}
          contentContainerStyle={[styles.container, { backgroundColor: 'transparent' }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>My Profile</Text>
          </View>

          {/* Profile Card */}
          <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {userName ? userName[0].toUpperCase() : '?'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userName || 'Unknown'}</Text>
              <Text style={styles.profileRole}>{userRole ? ROLE_LABELS[userRole] : ''}</Text>
            </View>
          </View>

          {/* Vault Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>Family Vault</Text>
            <SettingRow
              emoji="📖"
              label={familyVault?.name ?? 'No vault'}
              value={`${memories.length} stories`}
            />
          </View>

          {/* Info Text */}
          <View style={[styles.infoBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.infoText, { color: colors.foreground }]}>
              You're part of {familyVault?.name || 'a family vault'}. You can record stories and view memories shared by family members.
            </Text>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // ORGANIZER: Full admin settings
  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        contentContainerStyle={[styles.container, { backgroundColor: 'transparent' }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: colors.primary }]}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {userName ? userName[0].toUpperCase() : '?'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userName || 'Unknown'}</Text>
            <Text style={styles.profileRole}>{userRole ? ROLE_LABELS[userRole] : ''}</Text>
          </View>
        </View>

        {/* Vault Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Family Vault</Text>
          <SettingRow
            emoji="📖"
            label={familyVault?.name ?? 'No vault'}
            value={`${memories.length} stories · ${members.length} members`}
          />
          <SettingRow
            emoji="🔑"
            label="Invite Code"
            value={familyVault?.inviteCode ?? '—'}
          />
          <SettingRow
            emoji="📬"
            label="Invite Family Members"
            onPress={handleInvite}
          />
        </View>

        {/* Members */}
        {members.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.muted }]}>Members</Text>
            {members.map(member => (
              <SettingRow
                key={member.id}
                emoji={member.role === 'elder' ? '👴' : member.role === 'organizer' ? '👨‍👩‍👧' : '👶'}
                label={member.name}
                value={ROLE_LABELS[member.role]}
              />
            ))}
          </View>
        )}

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Vault Stats</Text>
          <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{memories.length}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Stories</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{members.length}</Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Members</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {memories.filter(m => m.recordingType === 'audio').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.muted }]}>Audio</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.muted }]}>Danger Zone</Text>
          <SettingRow
            emoji="⚠️"
            label="Reset Everything"
            onPress={handleReset}
            destructive
          />
        </View>

        {/* App Info */}
        <Text style={[styles.appInfo, { color: colors.muted }]}>
          LegacyBox · Preserve the stories behind the photos.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 20,
  },
  header: {},
  title: {
    fontSize: 32,
    fontFamily: Fonts?.display,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    gap: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    gap: 4,
  },
  profileName: {
    fontSize: 22,
    fontFamily: Fonts?.display,
    color: '#FFFFFF',
  },
  profileRole: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  settingEmoji: {
    fontSize: 22,
  },
  settingContent: {
    flex: 1,
    gap: 2,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  settingValue: {
    fontSize: 14,
  },
  settingChevron: {
    fontSize: 20,
  },
  statsCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 13,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  appInfo: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  infoBox: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
