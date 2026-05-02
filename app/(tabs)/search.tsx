import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useStore } from '@/lib/store';
import { THEME_META } from '@/constants/prompts';
import { Fonts } from '@/lib/_core/theme';
import { Memory } from '@/shared/app-types';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, TextInput } from 'react-native';

function HighlightText({ text, query, style }: { text: string; query: string; style?: object }) {
  const colors = useColors();
  if (!query || !text) return <Text style={style}>{text}</Text>;

  const lower = text.toLowerCase();
  const lowerQ = query.toLowerCase();
  const idx = lower.indexOf(lowerQ);
  if (idx === -1) return <Text style={style}>{text}</Text>;

  return (
    <Text style={style}>
      {text.substring(0, idx)}
      <Text style={{ backgroundColor: colors.primary, color: '#FFFFFF', fontWeight: '700' }}>
        {text.substring(idx, idx + query.length)}
      </Text>
      {text.substring(idx + query.length)}
    </Text>
  );
}

function SearchResultItem({ memory, query, onPress }: { memory: Memory; query: string; onPress: () => void }) {
  const colors = useColors();
  const meta = THEME_META[memory.theme];
  const date = new Date(memory.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Find matching snippet and source
  const { snippet, source } = useMemo(() => {
    if (!query) return { snippet: memory.transcript ?? memory.notes ?? '', source: null };
    
    const q = query.toLowerCase();
    const titleMatch = memory.title.toLowerCase().includes(q);
    const transcriptMatch = (memory.transcript ?? '').toLowerCase().includes(q);
    const notesMatch = (memory.notes ?? '').toLowerCase().includes(q);
    
    // Prioritize transcript matches
    if (transcriptMatch) {
      const text = memory.transcript ?? '';
      const idx = text.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 40);
      const end = Math.min(text.length, idx + q.length + 80);
      const snip = (start > 0 ? '…' : '') + text.substring(start, end) + (end < text.length ? '…' : '');
      return { snippet: snip, source: 'transcript' };
    }
    
    if (notesMatch) {
      const text = memory.notes ?? '';
      const idx = text.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 40);
      const end = Math.min(text.length, idx + q.length + 80);
      const snip = (start > 0 ? '…' : '') + text.substring(start, end) + (end < text.length ? '…' : '');
      return { snippet: snip, source: 'notes' };
    }
    
    return { snippet: memory.transcript ?? memory.notes ?? '', source: null };
  }, [memory, query]);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.resultItem,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.75 },
      ]}
      onPress={onPress}
    >
      <View style={styles.resultHeader}>
        <View style={[styles.themePill, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Text style={[styles.themePillText, { color: colors.primary }]}>
            {meta?.emoji} {meta?.label}
          </Text>
        </View>
        <Text style={[styles.resultDate, { color: colors.muted }]}>{date}</Text>
      </View>
      <HighlightText
        text={memory.title}
        query={query}
        style={[styles.resultTitle, { color: colors.foreground }]}
      />
      {snippet ? (
        <View>
          {source && (
            <Text style={[styles.sourceLabel, { color: colors.primary }]}>
              📝 From {source === 'transcript' ? 'transcript' : 'notes'}
            </Text>
          )}
          <HighlightText
            text={snippet}
            query={query}
            style={[styles.resultSnippet, { color: colors.muted }]}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

export default function SearchScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state } = useStore();
  const [query, setQuery] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const recordingMembers = useMemo(() => {
    const members = new Map<string, string>();
    state.memories.forEach(m => {
      if (m.recordedBy && !members.has(m.recordedBy)) {
        members.set(m.recordedBy, m.recordedByMemberId || m.recordedBy);
      }
    });
    return Array.from(members.entries()).map(([name, id]) => ({ id, name }));
  }, [state.memories]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    let filtered = state.memories.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.transcript ?? '').toLowerCase().includes(q) ||
      (m.notes ?? '').toLowerCase().includes(q) ||
      (m.promptText ?? '').toLowerCase().includes(q)
    );
    if (selectedMemberId) {
      const memberName = recordingMembers.find(rm => rm.id === selectedMemberId)?.name;
      filtered = filtered.filter(m => m.recordedBy === memberName);
    }
    return filtered;
  }, [query, state.memories, selectedMemberId, recordingMembers]);

  const recentMemories = useMemo(() => state.memories.slice(0, 3), [state.memories]);

  return (
    <ScreenContainer containerClassName="bg-background">
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Search Stories</Text>
        </View>

        {/* Member Filter */}
        {recordingMembers.length > 1 && (
          <View style={styles.filterSection}>
            <Pressable
              style={({ pressed }) => [
                styles.filterChip,
                selectedMemberId === null && { backgroundColor: colors.primary },
                selectedMemberId !== null && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1.5 },
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => setSelectedMemberId(null)}
            >
              <Text style={[styles.filterChipText, selectedMemberId === null && { color: '#FFFFFF' }, selectedMemberId !== null && { color: colors.foreground }]}>
                All
              </Text>
            </Pressable>
            {recordingMembers.map(member => (
              <Pressable
                key={member.id}
                style={({ pressed }) => [
                  styles.filterChip,
                  selectedMemberId === member.id && { backgroundColor: colors.primary },
                  selectedMemberId !== member.id && { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1.5 },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => setSelectedMemberId(member.id)}
              >
                <Text style={[styles.filterChipText, selectedMemberId === member.id && { color: '#FFFFFF' }, selectedMemberId !== member.id && { color: colors.foreground }]}>
                  {member.name}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search by topic, keyword, or name…"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
              <Text style={[styles.clearBtn, { color: colors.muted }]}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Results or Suggestions */}
        {query.trim() ? (
          <FlatList
            data={results}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.noResults}>
                <Text style={styles.noResultsEmoji}>🔍</Text>
                <Text style={[styles.noResultsTitle, { color: colors.foreground }]}>No stories found</Text>
                <Text style={[styles.noResultsText, { color: colors.muted }]}>
                  Try different keywords or browse the memory threads.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <SearchResultItem
                memory={item}
                query={query}
                onPress={() => router.push({ pathname: '/memory/[id]', params: { id: item.id } } as never)}
              />
            )}
          />
        ) : (
          <FlatList
            data={recentMemories}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.suggestionsHeader}>
                <Text style={[styles.suggestionsTitle, { color: colors.muted }]}>
                  {recentMemories.length > 0 ? 'Recent Stories' : 'Start typing to search…'}
                </Text>
              </View>
            }
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <SearchResultItem
                memory={item}
                query=""
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
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts?.display,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 10,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
  },
  clearBtn: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  resultItem: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginBottom: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themePill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  themePillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultDate: {
    fontSize: 12,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
  resultSnippet: {
    fontSize: 14,
    lineHeight: 21,
  },
  sourceLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  noResults: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  noResultsEmoji: {
    fontSize: 48,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  suggestionsHeader: {
    marginBottom: 12,
  },
  suggestionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterSection: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
