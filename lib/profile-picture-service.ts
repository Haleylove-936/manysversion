/**
 * Profile Picture Service
 *
 * Handles profile picture selection for family members.
 * Uses a stub implementation that can be replaced with expo-image-picker later.
 */

/**
 * Stub profile picture picker function.
 * In production, this would use expo-image-picker or similar.
 *
 * For now, returns a placeholder URI that can be stored on the member.
 */
export async function pickProfilePicture(): Promise<string | null> {
  // Simulate network/permission delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Stub response: return a placeholder URI
  // In a real implementation, this would call ImagePicker.launchImageLibraryAsync()
  // and return the actual selected image URI
  const placeholderUri = `file:///profiles/member-${Date.now()}.jpg`;
  return placeholderUri;
}

/**
 * Generate avatar initials from a name.
 * Used as fallback when no profile picture is available.
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('');
}

/**
 * Generate a color based on a member ID or name for avatar background.
 * Ensures consistent colors for the same member.
 */
export function getAvatarColor(memberId: string): string {
  const colors = [
    '#FF6B6B', // red
    '#4ECDC4', // teal
    '#45B7D1', // blue
    '#FFA07A', // salmon
    '#98D8C8', // mint
    '#F7DC6F', // yellow
    '#BB8FCE', // purple
    '#85C1E2', // sky blue
  ];

  let hash = 0;
  for (let i = 0; i < memberId.length; i++) {
    hash = memberId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Check if a profile picture URI is valid.
 */
export function hasProfilePicture(pictureUri: string | null | undefined): boolean {
  return !!pictureUri && pictureUri.trim().length > 0;
}
