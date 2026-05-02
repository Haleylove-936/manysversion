import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { AppState, Comment, FamilyMember, FamilyVault, Memory, UserRole } from '@/shared/app-types';

const STORAGE_KEY = '@legacybox_state';

const initialState: AppState = {
  hasOnboarded: false,
  userRole: null,
  userName: '',
  familyVault: null,
  members: [],
  memories: [],
  currentPromptIndex: 0,
};

type Action =
  | { type: 'COMPLETE_ONBOARDING'; payload: { role: UserRole; name: string; vault: FamilyVault } }
  | { type: 'ADD_MEMORY'; payload: Memory }
  | { type: 'DELETE_MEMORY'; payload: { id: string } }
  | { type: 'UPDATE_MEMORY'; payload: Memory }
  | { type: 'ADD_MEMBER'; payload: FamilyMember }
  | { type: 'ADVANCE_PROMPT' }
  | { type: 'SET_REMINDER_TIME'; payload: string }
  | { type: 'MARK_PROMPT_DELIVERED'; payload: string }
  | { type: 'ADD_COMMENT'; payload: { memoryId: string; comment: Comment } }
  | { type: 'TOGGLE_REACTION'; payload: { memoryId: string; commentId: string; emoji: string; memberId: string } }
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        hasOnboarded: true,
        userRole: action.payload.role,
        userName: action.payload.name,
        familyVault: action.payload.vault,
        members: [
          {
            id: '1',
            name: action.payload.name,
            role: action.payload.role,
            joinedAt: new Date().toISOString(),
          },
        ],
      };
    case 'ADD_MEMORY':
      return { ...state, memories: [action.payload, ...state.memories] };
    case 'DELETE_MEMORY':
      return { ...state, memories: state.memories.filter(m => m.id !== action.payload.id) };
    case 'UPDATE_MEMORY':
      return {
        ...state,
        memories: state.memories.map(m => (m.id === action.payload.id ? action.payload : m)),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        memories: state.memories.map(m =>
          m.id === action.payload.memoryId
            ? { ...m, comments: [...(m.comments ?? []), action.payload.comment] }
            : m
        ),
      };
    case 'TOGGLE_REACTION': {
      const { memoryId, commentId, emoji, memberId } = action.payload;
      return {
        ...state,
        memories: state.memories.map(m => {
          if (m.id !== memoryId) return m;
          return {
            ...m,
            comments: (m.comments ?? []).map(c => {
              if (c.id !== commentId) return c;
              const current = c.reactions[emoji] ?? [];
              const updated = current.includes(memberId)
                ? current.filter(id => id !== memberId)
                : [...current, memberId];
              return { ...c, reactions: { ...c.reactions, [emoji]: updated } };
            }),
          };
        }),
      };
    }
    case 'ADD_MEMBER':
      return { ...state, members: [...state.members, action.payload] };
    case 'ADVANCE_PROMPT':
      return { ...state, currentPromptIndex: state.currentPromptIndex + 1 };
    case 'SET_REMINDER_TIME':
      return { ...state, reminderTime: action.payload };
    case 'MARK_PROMPT_DELIVERED':
      return { ...state, lastPromptDeliveredDate: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface StoreContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  addMemory: (memory: Memory) => void;
  deleteMemory: (id: string) => void;
  updateMemory: (memory: Memory) => void;
  completeOnboarding: (role: UserRole, name: string, vaultName: string) => void;
  advancePrompt: () => void;
  setReminderTime: (time: string) => void;
  markPromptDelivered: (date: string) => void;
  addComment: (memoryId: string, comment: Comment) => void;
  toggleReaction: (memoryId: string, commentId: string, emoji: string, memberId: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          const saved = JSON.parse(raw) as AppState;
          dispatch({ type: 'HYDRATE', payload: saved });
        } catch {
          // ignore parse errors
        }
      }
    });
  }, []);

  // Persist on every state change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addMemory = useCallback((memory: Memory) => {
    dispatch({ type: 'ADD_MEMORY', payload: memory });
  }, []);

  const deleteMemory = useCallback((id: string) => {
    dispatch({ type: 'DELETE_MEMORY', payload: { id } });
  }, []);

  const updateMemory = useCallback((memory: Memory) => {
    dispatch({ type: 'UPDATE_MEMORY', payload: memory });
  }, []);

  const completeOnboarding = useCallback((role: UserRole, name: string, vaultName: string) => {
    const vault: FamilyVault = {
      id: Date.now().toString(),
      name: vaultName,
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: { role, name, vault } });
  }, []);

  const advancePrompt = useCallback(() => {
    dispatch({ type: 'ADVANCE_PROMPT' });
  }, []);

  const setReminderTime = useCallback((time: string) => {
    dispatch({ type: 'SET_REMINDER_TIME', payload: time });
  }, []);

  const markPromptDelivered = useCallback((date: string) => {
    dispatch({ type: 'MARK_PROMPT_DELIVERED', payload: date });
  }, []);

  const addComment = useCallback((memoryId: string, comment: Comment) => {
    dispatch({ type: 'ADD_COMMENT', payload: { memoryId, comment } });
  }, []);

  const toggleReaction = useCallback((memoryId: string, commentId: string, emoji: string, memberId: string) => {
    dispatch({ type: 'TOGGLE_REACTION', payload: { memoryId, commentId, emoji, memberId } });
  }, []);

  return (
    <StoreContext.Provider
      value={{ state, dispatch, addMemory, deleteMemory, updateMemory, completeOnboarding, advancePrompt, setReminderTime, markPromptDelivered, addComment, toggleReaction }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export type { StoreContextValue };
