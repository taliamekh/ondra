/**
 * Onda's themes. Each theme reskins the entire app — chosen during onboarding
 * and changeable any time in Profile. Add a new theme by adding an entry to
 * THEMES and listing its key in THEME_ORDER.
 */

export type ThemeKey =
  | 'pink_cute'
  | 'earthy'
  | 'light_blue'
  | 'emo'
  | 'dark_red'
  | 'rubber_duck'
  | 'cat'
  | 'matcha'
  | 'lavender'
  | 'mono';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  bg: string; // app background
  bgAlt: string; // elevated surfaces / cards
  bgInset: string; // inputs, wells, pressed states
  primary: string; // brand / primary CTA
  onPrimary: string; // text + icons sitting on `primary`
  secondary: string; // secondary accent
  accent: string; // highlights / pops
  text: string; // primary text
  textMuted: string; // secondary text
  border: string; // hairlines
  like: string; // hearts / likes
  success: string;
  danger: string;
}

export interface ThemeRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
}

export interface ThemeTokens {
  key: ThemeKey;
  name: string;
  emoji: string;
  mode: ThemeMode;
  colors: ThemeColors;
  /** Background gradient (top → bottom) used on hero surfaces. */
  gradient: [string, string];
  radius: ThemeRadius;
}

const round: ThemeRadius = { sm: 12, md: 18, lg: 24, xl: 32, pill: 999 };
const soft: ThemeRadius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };
const sharp: ThemeRadius = { sm: 6, md: 10, lg: 14, xl: 18, pill: 999 };

export const THEMES: Record<ThemeKey, ThemeTokens> = {
  pink_cute: {
    key: 'pink_cute',
    name: 'Pink Cute',
    emoji: '🎀',
    mode: 'light',
    radius: round,
    gradient: ['#FFD9E8', '#FFF4F8'],
    colors: {
      bg: '#FFF4F8',
      bgAlt: '#FFFFFF',
      bgInset: '#FCE7F0',
      primary: '#FF6FA5',
      onPrimary: '#FFFFFF',
      secondary: '#FFB6CE',
      accent: '#C9A2FF',
      text: '#4A2230',
      textMuted: '#9A6B7C',
      border: '#F6D9E5',
      like: '#FF4D8D',
      success: '#56C596',
      danger: '#F0544F',
    },
  },
  earthy: {
    key: 'earthy',
    name: 'Earthy',
    emoji: '🌿',
    mode: 'light',
    radius: soft,
    gradient: ['#E7D6BC', '#F6F1E7'],
    colors: {
      bg: '#F6F1E7',
      bgAlt: '#FFFDF8',
      bgInset: '#ECE3D2',
      primary: '#B5703F',
      onPrimary: '#FFF8F0',
      secondary: '#8A9A5B',
      accent: '#C58A3D',
      text: '#3B342A',
      textMuted: '#7C7059',
      border: '#E2D6C0',
      like: '#C2410C',
      success: '#6E8B4E',
      danger: '#B5503F',
    },
  },
  light_blue: {
    key: 'light_blue',
    name: 'Light Blue',
    emoji: '🩵',
    mode: 'light',
    radius: soft,
    gradient: ['#CDEBFB', '#F0F8FF'],
    colors: {
      bg: '#F0F8FF',
      bgAlt: '#FFFFFF',
      bgInset: '#E0F0FB',
      primary: '#3E9BDD',
      onPrimary: '#FFFFFF',
      secondary: '#9FD4F2',
      accent: '#6FC3E8',
      text: '#173A4E',
      textMuted: '#5E7E90',
      border: '#D2E8F5',
      like: '#FF6B8A',
      success: '#44B6A6',
      danger: '#EE6352',
    },
  },
  emo: {
    key: 'emo',
    name: 'Emo',
    emoji: '🖤',
    mode: 'dark',
    radius: sharp,
    gradient: ['#1A1226', '#0E0E13'],
    colors: {
      bg: '#0E0E13',
      bgAlt: '#17151F',
      bgInset: '#201C2C',
      primary: '#8B5CF6',
      onPrimary: '#FFFFFF',
      secondary: '#E11D48',
      accent: '#22D3EE',
      text: '#ECEAF3',
      textMuted: '#9A93AD',
      border: '#2A2535',
      like: '#FB3B6F',
      success: '#34D399',
      danger: '#F43F5E',
    },
  },
  dark_red: {
    key: 'dark_red',
    name: 'Dark Red',
    emoji: '🍷',
    mode: 'dark',
    radius: sharp,
    gradient: ['#3A1014', '#190B0D'],
    colors: {
      bg: '#190B0D',
      bgAlt: '#241012',
      bgInset: '#2E1417',
      primary: '#C81E33',
      onPrimary: '#FFF0F1',
      secondary: '#7A1620',
      accent: '#E0A458',
      text: '#F3E2E4',
      textMuted: '#B58A8E',
      border: '#3A1B1F',
      like: '#FF4D6D',
      success: '#4FAF8C',
      danger: '#FF6B5B',
    },
  },
  rubber_duck: {
    key: 'rubber_duck',
    name: 'Rubber Duck',
    emoji: '🦆',
    mode: 'light',
    radius: round,
    gradient: ['#FFEFA8', '#BFE9FF'],
    colors: {
      bg: '#FFFCEC',
      bgAlt: '#FFFFFF',
      bgInset: '#FFF3C4',
      primary: '#F5C518',
      onPrimary: '#3A3206',
      secondary: '#58C7F3',
      accent: '#FF8A3D',
      text: '#3A3410',
      textMuted: '#8A7F3F',
      border: '#F2E4A6',
      like: '#FF6B8A',
      success: '#5CC98E',
      danger: '#F0673E',
    },
  },
  cat: {
    key: 'cat',
    name: 'Cat',
    emoji: '🐈',
    mode: 'light',
    radius: round,
    gradient: ['#E7DAC8', '#F6F1EA'],
    colors: {
      bg: '#F6F1EA',
      bgAlt: '#FFFDF9',
      bgInset: '#EAE0D3',
      primary: '#C98A5E',
      onPrimary: '#FFF7EF',
      secondary: '#6B6560',
      accent: '#E0A75E',
      text: '#2E2A26',
      textMuted: '#877E74',
      border: '#E4D8C7',
      like: '#E0708A',
      success: '#6FA08A',
      danger: '#C76B52',
    },
  },
  matcha: {
    key: 'matcha',
    name: 'Matcha',
    emoji: '🍵',
    mode: 'light',
    radius: soft,
    gradient: ['#D9E8C2', '#F1F6EA'],
    colors: {
      bg: '#F1F6EA',
      bgAlt: '#FBFDF6',
      bgInset: '#E2EDD2',
      primary: '#7BA05B',
      onPrimary: '#FBFDF6',
      secondary: '#B7CE97',
      accent: '#A3C76D',
      text: '#2C3A22',
      textMuted: '#6E7E5E',
      border: '#D9E6C6',
      like: '#E07A8B',
      success: '#5E9C6E',
      danger: '#C0703F',
    },
  },
  lavender: {
    key: 'lavender',
    name: 'Lavender',
    emoji: '💜',
    mode: 'light',
    radius: round,
    gradient: ['#E4D6FA', '#F6F2FC'],
    colors: {
      bg: '#F6F2FC',
      bgAlt: '#FFFFFF',
      bgInset: '#ECE3FA',
      primary: '#9B7EDE',
      onPrimary: '#FFFFFF',
      secondary: '#C9B6F2',
      accent: '#7FB3E8',
      text: '#382C50',
      textMuted: '#7C6F95',
      border: '#E4D8F5',
      like: '#E06BA8',
      success: '#5CB69E',
      danger: '#EC6A6A',
    },
  },
  mono: {
    key: 'mono',
    name: 'Mono',
    emoji: '⚫',
    mode: 'light',
    radius: sharp,
    gradient: ['#F4F4F5', '#FFFFFF'],
    colors: {
      bg: '#FFFFFF',
      bgAlt: '#FAFAFA',
      bgInset: '#F0F0F1',
      primary: '#111114',
      onPrimary: '#FFFFFF',
      secondary: '#6B7280',
      accent: '#111114',
      text: '#111114',
      textMuted: '#71717A',
      border: '#E6E6E8',
      like: '#111114',
      success: '#16A34A',
      danger: '#DC2626',
    },
  },
};

/** Display order for the theme picker. */
export const THEME_ORDER: ThemeKey[] = [
  'pink_cute',
  'lavender',
  'light_blue',
  'matcha',
  'earthy',
  'cat',
  'rubber_duck',
  'mono',
  'dark_red',
  'emo',
];

export const DEFAULT_THEME: ThemeKey = 'pink_cute';

export const getTheme = (key?: string | null): ThemeTokens =>
  (key && (THEMES as Record<string, ThemeTokens>)[key]) || THEMES[DEFAULT_THEME];
