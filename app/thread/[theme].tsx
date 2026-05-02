import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useStore } from '@/lib/store';
import { THEME_META } from '@/constants/prompts';
import { MemoryTheme, Memory } from '@/shared/app-types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

function MemoryListItem({ memory, onPress }: { memory: Memory; onPress: () => void }) {
  const colors = useColors();
  const date = new Date(memory.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <Pressable
      style={({ pressed }) => [
        styles.memoryItem,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.75 },
      ]}
      onPress={onPress}
    >
      <View style={styles.memoryItemLeft}>
        <Text style={[styles.memoryItemTitle, { color: colors.foreground }]} numberOfLines={2}>
          {memory.title}
        </Text>
        {memory.promptText && (
          <Text style={[styles.memoryItemPrompt, { color: colors.muted }]} numberOfLines={1}>
            {memory.promptText}
          </Text>
        )}
        <View style={styles.memoryItemMeta}>
          <Text style={[styles.memoryItemDate, { color: colors.muted }]}>{date}</Text>
          <Text style={[styles.memoryItemType, { color: colors.muted }]}>
            {memory.recordingType === 'audio' ? '🎙️ Audio' : memory.recordingType === 'video' ? '🎥 Video' : '📝 Text'}
            {memory.durationSeconds ? ` · ${Math.round(memory.durationSeconds / 60)}m` : ''}
          </Text>
        </View>
      </View>
      <Text style={[styles.chevron, { color: colors.muted }]}>›</Text>
    </Pressable>
  );
}

export default function ThreadDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { theme } = useLocalSearchParams<{ theme: MemoryTheme }>();
  const { state } = useStore();

  const meta = THEME_META[theme ?? 'childhood'];
  const memories = useMemo(
    () => state.memories.filter(m => m.theme === theme),
    [state.memories, theme]
  );

  const handleRecord = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/record', params: { theme } } as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Pressable
            style={({ pressed }) => [pressed && { opacity: 0.6 }]}
            onPress={() => router.back()}
          >
            <Text style={[styles.backText, { color: colors.primary }]}>← Back</Text>
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>{meta?.emoji}</Text>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>{meta?.label}</Text>
            <Text style={[styles.headerCount, { color: colors.muted }]}>
              {memories.length} {memories.length === 1 ? 'story' : 'stories'}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.85 },
            ]}
            onPress={handleRecord}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </Pressable>
        </View>

        {/* List */}
        {memories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{meta?.emoji}</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No stories yet</Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Be the first to add a {meta?.label.toLowerCase()} story to the family vault.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.emptyButton,
                { backgroundColor: colors.primary },
                pressed && { opacity: 0.85 },
              ]}
              onPress={handleRecord}
            >
              <Text style={styles.emptyButtonText}>Record a Story</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={memories}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <MemoryListItem
                memory={item}
                onPress={() => router.push({ pathname: '/memory/[id]', params: { id: item.id } } as never)}
              />
            )}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backText: {
    fontSize: 17,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  headerEmoji: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerCount: {
    fontSize: 13,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  list: {
    padding: 16,
    gap: 12,
  },
  memoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  memoryItemLeft: {
    flex: 1,
    gap: 4,
  },
  memoryItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
  memoryItemPrompt: {
    fontSize: 14,
    lineHeight: 20,
  },
  memoryItemMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  memoryItemDate: {
    fontSize: 13,
  },
  memoryItemType: {
    fontSize: 13,
  },
  chevron: {
    fontSize: 22,
    fontWeight: '300',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 14,
  },
  emptyEmoji: {
    fontSize: 56,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
