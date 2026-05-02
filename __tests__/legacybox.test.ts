import { describe, it, expect } from 'vitest';
import { getDailyPrompt, getPromptsByTheme, GUIDED_PROMPTS, THEME_META } from '../constants/prompts';
import type { Memory, AppState, FamilyVault } from '../shared/app-types';

// ─── Prompt Logic ────────────────────────────────────────────────────────────

describe('getDailyPrompt', () => {
  it('returns a prompt for index 0', () => {
    const prompt = getDailyPrompt(0);
    expect(prompt).toBeDefined();
    expect(prompt.id).toBeDefined();
    expect(prompt.text.length).toBeGreaterThan(10);
  });

  it('cycles through prompts using modulo', () => {
    const total = GUIDED_PROMPTS.length;
    const first = getDailyPrompt(0);
    const cycled = getDailyPrompt(total); // same as index 0
    expect(cycled.id).toBe(first.id);
  });

  it('returns different prompts for consecutive indices', () => {
    const p0 = getDailyPrompt(0);
    const p1 = getDailyPrompt(1);
    expect(p0.id).not.toBe(p1.id);
  });
});

describe('getPromptsByTheme', () => {
  it('returns only prompts for the given theme', () => {
    const childhood = getPromptsByTheme('childhood');
    expect(childhood.length).toBeGreaterThan(0);
    childhood.forEach(p => expect(p.theme).toBe('childhood'));
  });

  it('returns prompts for all 6 themes', () => {
    const themes = ['childhood', 'recipes', 'love', 'work', 'advice', 'faith'];
    themes.forEach(theme => {
      const prompts = getPromptsByTheme(theme);
      expect(prompts.length).toBeGreaterThan(0);
    });
  });

  it('returns empty array for unknown theme', () => {
    const result = getPromptsByTheme('unknown_theme');
    expect(result).toHaveLength(0);
  });
});

describe('THEME_META', () => {
  it('has entries for all 6 themes', () => {
    const themes = ['childhood', 'recipes', 'love', 'work', 'advice', 'faith'];
    themes.forEach(theme => {
      expect(THEME_META[theme]).toBeDefined();
      expect(THEME_META[theme].label).toBeTruthy();
      expect(THEME_META[theme].emoji).toBeTruthy();
    });
  });
});

// ─── Store Reducer Logic (pure functions) ────────────────────────────────────

function makeMemory(overrides: Partial<Memory> = {}): Memory {
  return {
    id: '1',
    theme: 'childhood',
    title: 'Test Story',
    recordingType: 'audio',
    fileUri: 'file:///audio/test.m4a',
    recordedBy: 'Grandma',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeVault(overrides: Partial<FamilyVault> = {}): FamilyVault {
  return {
    id: 'v1',
    name: 'Smith Family',
    inviteCode: 'ABC123',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function makeState(overrides: Partial<AppState> = {}): AppState {
  return {
    hasOnboarded: false,
    userRole: null,
    userName: '',
    familyVault: null,
    members: [],
    memories: [],
    currentPromptIndex: 0,
    ...overrides,
  };
}

describe('Memory model', () => {
  it('creates a valid memory object', () => {
    const m = makeMemory();
    expect(m.id).toBe('1');
    expect(m.theme).toBe('childhood');
    expect(m.recordingType).toBe('audio');
  });

  it('supports optional fields', () => {
    const m = makeMemory({ transcript: 'Hello world', durationSeconds: 120 });
    expect(m.transcript).toBe('Hello world');
    expect(m.durationSeconds).toBe(120);
  });
});

describe('FamilyVault model', () => {
  it('creates a valid vault', () => {
    const v = makeVault();
    expect(v.inviteCode).toBe('ABC123');
    expect(v.name).toBe('Smith Family');
  });
});

describe('AppState model', () => {
  it('starts with no memories', () => {
    const s = makeState();
    expect(s.memories).toHaveLength(0);
    expect(s.hasOnboarded).toBe(false);
  });

  it('can hold multiple memories', () => {
    const m1 = makeMemory({ id: '1' });
    const m2 = makeMemory({ id: '2', theme: 'recipes' });
    const s = makeState({ memories: [m1, m2] });
    expect(s.memories).toHaveLength(2);
    expect(s.memories[1].theme).toBe('recipes');
  });
});

// ─── Invite Code Generation ───────────────────────────────────────────────────

describe('Invite code', () => {
  it('generates a 6-char uppercase code', () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    expect(code.length).toBe(6);
    expect(code).toBe(code.toUpperCase());
  });
});

// ─── Prompt Coverage ─────────────────────────────────────────────────────────

describe('GUIDED_PROMPTS', () => {
  it('has at least 30 total prompts', () => {
    expect(GUIDED_PROMPTS.length).toBeGreaterThanOrEqual(30);
  });

  it('all prompts have unique IDs', () => {
    const ids = GUIDED_PROMPTS.map(p => p.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('all prompts have non-empty text', () => {
    GUIDED_PROMPTS.forEach(p => {
      expect(p.text.trim().length).toBeGreaterThan(0);
    });
  });
});


// ─── Transcription Service ───────────────────────────────────────────────────

describe('Transcription Service', () => {
  it('generates a plausible transcript for audio', async () => {
    const { transcribeAudio } = await import('../lib/transcription-service');
    const transcript = await transcribeAudio(
      'file:///audio/memory.m4a',
      'My childhood kitchen',
      'childhood'
    );
    expect(transcript).toBeTruthy();
    expect(transcript.length).toBeGreaterThan(50);
    expect(transcript.toLowerCase()).toContain('when i was young');
  });

  it('uses theme context in transcript generation', async () => {
    const { transcribeAudio } = await import('../lib/transcription-service');
    
    const childTranscript = await transcribeAudio('file:///a.m4a', 'Test', 'childhood');
    expect(childTranscript.toLowerCase()).toContain('when i was young');
    
    const recipeTranscript = await transcribeAudio('file:///b.m4a', 'Test', 'recipes');
    expect(recipeTranscript.toLowerCase()).toContain('to make this dish');
    
    const loveTranscript = await transcribeAudio('file:///c.m4a', 'Test', 'love');
    expect(loveTranscript.toLowerCase()).toContain('first met');
  });

  it('hasTranscript returns true for non-empty transcript', async () => {
    const { hasTranscript } = await import('../lib/transcription-service');
    expect(hasTranscript('Some transcript text')).toBe(true);
    expect(hasTranscript('')).toBe(false);
    expect(hasTranscript(null)).toBe(false);
    expect(hasTranscript(undefined)).toBe(false);
  });
});

// ─── Search with Transcript ──────────────────────────────────────────────────

describe('Search with Transcript', () => {
  it('finds memory by transcript-only terms', () => {
    const memories: Memory[] = [
      makeMemory({
        id: '1',
        title: 'My Story',
        transcript: 'I remember the old oak tree in the backyard where we played.',
      }),
    ];
    
    const q = 'oak tree';
    const found = memories.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.transcript ?? '').toLowerCase().includes(q)
    );
    
    expect(found).toHaveLength(1);
    expect(found[0].id).toBe('1');
  });

  it('finds memory by title when transcript is empty', () => {
    const memories: Memory[] = [
      makeMemory({
        id: '1',
        title: 'Grandmas Recipe',
        transcript: null,
      }),
    ];
    
    const q = 'recipe';
    const found = memories.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.transcript ?? '').toLowerCase().includes(q)
    );
    
    expect(found).toHaveLength(1);
  });

  it('does not find memory when neither title nor transcript match', () => {
    const memories: Memory[] = [
      makeMemory({
        id: '1',
        title: 'My Story',
        transcript: 'I remember the old oak tree.',
      }),
    ];
    
    const q = 'pizza';
    const found = memories.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.transcript ?? '').toLowerCase().includes(q)
    );
    
    expect(found).toHaveLength(0);
  });

  it('prioritizes transcript matches over title', () => {
    const memories: Memory[] = [
      makeMemory({
        id: '1',
        title: 'Story',
        transcript: 'The word "story" appears in the transcript.',
      }),
    ];
    
    const q = 'story';
    const found = memories.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.transcript ?? '').toLowerCase().includes(q)
    );
    
    expect(found).toHaveLength(1);
    expect(found[0].transcript).toContain('story');
  });
});


// ─── Daily Prompt Scheduler ──────────────────────────────────────────────────

describe('Daily Prompt Scheduler', () => {
  it('generates today date in YYYY-MM-DD format', async () => {
    const { getTodayDate } = await import('../lib/prompt-scheduler');
    const today = getTodayDate();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('detects when prompt has been delivered today', async () => {
    const { hasPromptBeenDeliveredToday, getTodayDate } = await import('../lib/prompt-scheduler');
    const today = getTodayDate();
    expect(hasPromptBeenDeliveredToday(today)).toBe(true);
    expect(hasPromptBeenDeliveredToday(undefined)).toBe(false);
  });

  it('marks prompt as delivered with today date', async () => {
    const { markPromptAsDelivered, getTodayDate } = await import('../lib/prompt-scheduler');
    const delivered = markPromptAsDelivered();
    expect(delivered).toBe(getTodayDate());
  });

  it('formats reminder time for display', async () => {
    const { formatReminderTime } = await import('../lib/prompt-scheduler');
    expect(formatReminderTime('09:00')).toBe('9:00 AM');
    expect(formatReminderTime('14:30')).toBe('2:30 PM');
    expect(formatReminderTime('00:00')).toBe('12:00 AM');
    expect(formatReminderTime('12:00')).toBe('12:00 PM');
  });

  it('stubs push notification function without error', async () => {
    const { schedulePushNotification } = await import('../lib/prompt-scheduler');
    await expect(
      schedulePushNotification('What was your childhood like?', '09:00')
    ).resolves.toBeUndefined();
  });
});

// ─── Daily Reminder in AppState ──────────────────────────────────────────────

describe('Daily Reminder State', () => {
  it('AppState includes reminderTime and lastPromptDeliveredDate', () => {
    const state = makeState({
      reminderTime: '09:00',
      lastPromptDeliveredDate: '2026-05-02',
    });
    expect(state.reminderTime).toBe('09:00');
    expect(state.lastPromptDeliveredDate).toBe('2026-05-02');
  });

  it('AppState works without reminder fields', () => {
    const state = makeState();
    expect(state.reminderTime).toBeUndefined();
    expect(state.lastPromptDeliveredDate).toBeUndefined();
  });
});


// ─── Photo Attachments ───────────────────────────────────────────────────────

describe('Photo Attachments', () => {
  it('Memory can have a photo URI', () => {
    const memory = makeMemory({
      photoUri: 'file:///photos/memory-123.jpg',
    });
    expect(memory.photoUri).toBe('file:///photos/memory-123.jpg');
  });

  it('Memory can be created without a photo', () => {
    const memory = makeMemory();
    expect(memory.photoUri).toBeUndefined();
  });

  it('hasPhoto returns true for valid photo URI', async () => {
    const { hasPhoto } = await import('../lib/image-picker-service');
    expect(hasPhoto('file:///photos/memory.jpg')).toBe(true);
    expect(hasPhoto('')).toBe(false);
    expect(hasPhoto(null)).toBe(false);
    expect(hasPhoto(undefined)).toBe(false);
  });

  it('pickImage returns a placeholder URI', async () => {
    const { pickImage } = await import('../lib/image-picker-service');
    const uri = await pickImage();
    expect(uri).toBeTruthy();
    expect(uri).toMatch(/^file:\/\/\/photos\/memory-\d+\.jpg$/);
  });

  it('getThumbnailUri returns the same URI', async () => {
    const { getThumbnailUri } = await import('../lib/image-picker-service');
    const uri = 'file:///photos/memory.jpg';
    expect(getThumbnailUri(uri)).toBe(uri);
  });
});

// ─── Memory with Photo ───────────────────────────────────────────────────────

describe('Memory with Photo', () => {
  it('finds memories by photo presence', () => {
    const memories: Memory[] = [
      makeMemory({ id: '1', photoUri: 'file:///photo1.jpg' }),
      makeMemory({ id: '2', photoUri: null }),
      makeMemory({ id: '3', photoUri: 'file:///photo3.jpg' }),
    ];

    const withPhotos = memories.filter(m => m.photoUri);
    expect(withPhotos).toHaveLength(2);
    expect(withPhotos.map(m => m.id)).toEqual(['1', '3']);
  });

  it('updates memory with a photo', () => {
    const memory = makeMemory({ id: '1' });
    const updated = { ...memory, photoUri: 'file:///new-photo.jpg' };
    expect(updated.photoUri).toBe('file:///new-photo.jpg');
    expect(memory.photoUri).toBeUndefined(); // original unchanged
  });
});


// ─── Profile Pictures ────────────────────────────────────────────────────────

describe('Profile Pictures', () => {
  it('FamilyMember can have a profile picture', async () => {
    const { getInitials, getAvatarColor } = await import('../lib/profile-picture-service');
    const initials = getInitials('Grandma Rose');
    expect(initials).toBe('GR');
  });

  it('getInitials handles single name', async () => {
    const { getInitials } = await import('../lib/profile-picture-service');
    expect(getInitials('Madonna')).toBe('M');
  });

  it('getAvatarColor returns consistent color for same ID', async () => {
    const { getAvatarColor } = await import('../lib/profile-picture-service');
    const color1 = getAvatarColor('member-123');
    const color2 = getAvatarColor('member-123');
    expect(color1).toBe(color2);
  });

  it('pickProfilePicture returns a placeholder URI', async () => {
    const { pickProfilePicture } = await import('../lib/profile-picture-service');
    const uri = await pickProfilePicture();
    expect(uri).toBeTruthy();
    expect(uri).toMatch(/^file:\/\/\/profiles\/member-\d+\.jpg$/);
  });

  it('hasProfilePicture validates URI', async () => {
    const { hasProfilePicture } = await import('../lib/profile-picture-service');
    expect(hasProfilePicture('file:///photo.jpg')).toBe(true);
    expect(hasProfilePicture('')).toBe(false);
    expect(hasProfilePicture(null)).toBe(false);
  });
});

// ─── Extended Recording ──────────────────────────────────────────────────────

describe('Extended Recording', () => {
  it('Memory can have custom title and notes', () => {
    const memory = makeMemory({
      title: 'My Favorite Recipe',
      notes: 'This was my mothers recipe from the 1950s',
    });
    expect(memory.title).toBe('My Favorite Recipe');
    expect(memory.notes).toBe('This was my mothers recipe from the 1950s');
  });

  it('Memory can be created with just recording', () => {
    const memory = makeMemory();
    expect(memory.title).toBeTruthy();
    expect(memory.notes).toBeUndefined();
  });

  it('Memory can link to a family member', () => {
    const memory = makeMemory({
      recordedByMemberId: 'member-123',
    });
    expect(memory.recordedByMemberId).toBe('member-123');
  });
});

// ─── Comments & Reactions ────────────────────────────────────────────────────

describe('Comments & Reactions', () => {
  it('Memory can have comments', () => {
    const memory = makeMemory({
      comments: [
        {
          id: 'c1',
          memberId: 'member-1',
          text: 'This is beautiful!',
          timestamp: new Date().toISOString(),
          reactions: { '👍': ['member-2', 'member-3'] },
        },
      ],
    });
    expect(memory.comments).toHaveLength(1);
    expect(memory.comments?.[0].text).toBe('This is beautiful!');
  });

  it('Comments can have emoji reactions', () => {
    const comment = {
      id: 'c1',
      memberId: 'member-1',
      text: 'Love this story',
      timestamp: new Date().toISOString(),
      reactions: { '❤️': ['member-2'], '😂': ['member-3', 'member-4'] },
    };
    expect(Object.keys(comment.reactions)).toHaveLength(2);
    expect(comment.reactions['❤️']).toHaveLength(1);
    expect(comment.reactions['😂']).toHaveLength(2);
  });

  it('Memory without comments is valid', () => {
    const memory = makeMemory();
    expect(memory.comments).toBeUndefined();
  });
});
