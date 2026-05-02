/** @type {const} */
const themeColors = {
  // Primary action color — warm burnished copper, readable on dark wood
  primary: { light: '#C4845A', dark: '#D4956A' },
  // Accent — lighter terracotta for highlights
  accent: { light: '#D4A574', dark: '#E0B888' },
  // Backgrounds — transparent so wood shows through; used for ScrollView contentContainerStyle
  // These are intentionally near-transparent warm tints, not solid fills
  background: { light: 'rgba(30, 16, 6, 0.0)', dark: 'rgba(10, 5, 2, 0.0)' },
  // Surface — frosted warm parchment over the wood grain
  surface: { light: 'rgba(245, 225, 195, 0.15)', dark: 'rgba(245, 225, 195, 0.10)' },
  // Text — warm ivory, high contrast over the dark overlay
  foreground: { light: '#F5E8D5', dark: '#F5E8D5' },
  muted: { light: '#C4A882', dark: '#B09060' },
  // UI chrome
  border: { light: 'rgba(210, 175, 130, 0.35)', dark: 'rgba(210, 175, 130, 0.20)' },
  // States
  success: { light: '#5A9E68', dark: '#6AAE78' },
  warning: { light: '#C4903A', dark: '#D4A84A' },
  error: { light: '#C05040', dark: '#D06050' },
  // Tint alias
  tint: { light: '#C4845A', dark: '#D4956A' },
};

module.exports = { themeColors };
