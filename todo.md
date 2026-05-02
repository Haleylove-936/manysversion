# LegacyBox TODO

## Setup & Configuration
- [x] Update theme colors (warm walnut palette — amber #C8860A, walnut brown)
- [x] Update app.config.ts with LegacyBox branding
- [x] Generate and set app icon/logo (glowing book with heart pages)
- [x] Add all required icon mappings to icon-symbol.tsx
- [x] Fix TypeScript errors (storageProxy, theme tokens)
- [x] Remove console.log from theme-provider

## Data Layer
- [x] Define shared TypeScript types (Memory, Prompt, FamilyVault, Member, AppState)
- [x] Create AsyncStorage-based data store with context
- [x] Seed 35+ guided prompts across 6 themes
- [x] Implement local audio file storage (expo-audio)

## Database Schema (server)
- [ ] Add memories table (deferred — local-first v1)
- [ ] Add family_vaults table (deferred — local-first v1)
- [ ] Add family_members table (deferred — local-first v1)

## Onboarding Screens
- [x] WelcomeScreen (hero + Start/Join CTAs)
- [x] RoleSelectScreen (Elder / Organizer / Relative)
- [x] FamilySetupScreen (name + vault name)
- [x] JoinVaultScreen (name + invite code)

## Elder Mode Screens
- [x] ElderHomeScreen (greeting, today's prompt card, stats, recent stories)
- [x] RecordingScreen (audio recording with animated waveform + timer)
- [x] PlaybackReviewScreen (save/discard after recording)

## Family Mode Screens
- [x] MemoryThreadsScreen (6 themed thread cards + all stories list)
- [x] ThreadDetailScreen (filtered memories by theme + add button)
- [x] MemoryDetailScreen (audio player + progress bar + transcript + share/delete)
- [x] SearchScreen (full-text search with highlighted results)

## Shared Screens
- [x] SettingsScreen (profile card, vault info, member list, stats, reset)
- [x] InviteScreen (invite code display + share sheet)

## Navigation
- [x] Tab bar: Home | Stories | Search | Settings
- [x] Stack navigation for detail screens (Memory, Thread, Record, Invite)
- [x] Onboarding flow (one-time, before tabs)
- [x] Modal presentation for Record screen

## Polish
- [x] Haptic feedback on key actions
- [x] Recording waveform animation (animated bars)
- [x] Save confirmation banner (justSaved param)
- [x] Empty state illustrations with emoji
- [x] Elder-first large buttons (22px+ font, 18px+ padding)

## Testing
- [x] 16 unit tests passing (prompts, models, invite code)

## Future Enhancements (Not in v1)
- [ ] Server-side transcription using LLM
- [ ] Video recording support
- [ ] Push notifications for daily prompts
- [ ] Cloud sync across family devices
- [ ] Photo attachment to memories


## Phase 1: AI Transcription Pipeline ✓
- [x] Extend Memory type with optional `transcript: string | null`
- [x] Create server transcription stub function (dummy Whisper simulation)
- [x] Update Search tab to search in both title and transcript
- [x] Add "From transcript" label in search results
- [x] Write tests for transcript search and memories without transcripts

## Phase 2: Daily Prompt Notifications ✓
- [x] Add reminder time to app state (e.g., 9:00 AM)
- [x] Create scheduler module to check if today's prompt delivered
- [x] Implement in-app banner/modal on Home screen
- [x] Add deep-link to recording flow with prefilled prompt
- [x] Stub module for future Expo Notifications integration
- [x] Write tests for scheduler, skipped questions, no-duplicate delivery

## Phase 3: Photo Attachments ✓
- [x] Extend Memory type with optional `photoUri: string | null`
- [x] Add "Add a photo" button on recording confirmation screen
- [x] Integrate image picker (stub or existing pattern)
- [x] Show photo thumbnails in Memories list and detail
- [x] Write tests for photo persistence and memories without photos


## Phase 4: Profile Pictures & Extended Features ✓
- [x] Extend FamilyMember type with profilePictureUri field
- [x] Add profile picture selection to onboarding (setup screen)
- [ ] Add profile picture editor to settings screen
- [x] Extend Memory type with recordingType selector (audio/video) and title/notes fields
- [x] Add title/notes editor to recording screen after recording
- [ ] Add recording type selector (audio/video) to recording screen
- [ ] Update memory detail to show recorded by member with profile picture
- [x] Write tests for profile pictures and extended recording fields

## Phase 5: Member Filtering & Comments
- [ ] Add member filter UI to Memories tab (dropdown/chips)
- [ ] Add member filter UI to Search tab
- [ ] Extend Memory type with comments array (id, memberId, text, timestamp, reactions)
- [ ] Add comments section to memory detail screen
- [ ] Add comment input field with member attribution
- [ ] Add emoji reactions to comments (👍 ❤️ 😂 😢)
- [ ] Display member profile pictures with comments
- [ ] Write tests for filtering and comments
