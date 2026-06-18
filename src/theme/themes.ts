/**
 * Onda's themes. Each theme reskins the entire app — chosen during onboarding
 * and changeable any time in Profile. Backgrounds are intentionally saturated so
 * switching theme transforms the whole screen, not just an accent.
 * Add a new theme by adding an entry to THEMES and listing its key in THEME_ORDER.
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
  bg: string; // app background (saturated, theme-defining)
  bgAlt: string; // elevated surfaces / cards
  bgInset: string; // inputs, wells, chips, pressed states
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
  shadow: string; // card shadow color (rgba)
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
  mode: ThemeMode;
  colors: ThemeColors;
  /** Background gradient (top → bottom) used on hero surfaces. */
  gradient: [string, string];
  radius: ThemeRadius;
}

const round: ThemeRadius = { sm: 12, md: 18, lg: 24, xl: 32, pill: 999 };
const soft: ThemeRadius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };
const sharp: ThemeRadius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };

export const THEMES: Record<ThemeKey, ThemeTokens> = {
  pink_cute: {
    key: 'pink_cute',
    name: 'Pink Cute',
    mode: 'light',
    radius: round,
    gradient: ['#FF9CC2', '#F9C8DD'],
    colors: {
      bg: '#F9C8DD',
      bgAlt: '#FFF2F8',
      bgInset: '#F3D6E4',
      primary: '#E84B86',
      onPrimary: '#FFFFFF',
      secondary: '#F49BBE',
      accent: '#9B5DE5',
      text: '#4A1F31',
      textMuted: '#9A5E76',
      border: '#EAC0D2',
      like: '#E8347A',
      success: '#3FB984',
      danger: '#E5484D',
      shadow: 'rgba(190,60,110,0.18)',
    },
  },
  lavender: {
    key: 'lavender',
    name: 'Lavender',
    mode: 'light',
    radius: round,
    gradient: ['#B79AED', '#DCC9F5'],
    colors: {
      bg: '#DCC9F5',
      bgAlt: '#F6F0FE',
      bgInset: '#E4D6F8',
      primary: '#7B4FD6',
      onPrimary: '#FFFFFF',
      secondary: '#B79EEC',
      accent: '#5AA0E8',
      text: '#2C1B4D',
      textMuted: '#6E5C92',
      border: '#D6C5EF',
      like: '#D957A0',
      success: '#3FB07E',
      danger: '#E5564E',
      shadow: 'rgba(110,70,180,0.18)',
    },
  },
  light_blue: {
    key: 'light_blue',
    name: 'Light Blue',
    mode: 'light',
    radius: soft,
    gradient: ['#7CC3EE', '#BFE0F5'],
    colors: {
      bg: '#BFE0F5',
      bgAlt: '#F0F9FF',
      bgInset: '#D2E9F8',
      primary: '#1E83C9',
      onPrimary: '#FFFFFF',
      secondary: '#84C3EC',
      accent: '#1CB3C9',
      text: '#0F3A52',
      textMuted: '#4E7894',
      border: '#C2DEF0',
      like: '#F2618A',
      success: '#2FA9A0',
      danger: '#E85C48',
      shadow: 'rgba(30,110,170,0.18)',
    },
  },
  matcha: {
    key: 'matcha',
    name: 'Matcha',
    mode: 'light',
    radius: soft,
    gradient: ['#A9C97A', '#CFE0AE'],
    colors: {
      bg: '#CFE0AE',
      bgAlt: '#F6FAEC',
      bgInset: '#DDE9C2',
      primary: '#5C8C36',
      onPrimary: '#FFFFFF',
      secondary: '#A8C57E',
      accent: '#87B24C',
      text: '#28381C',
      textMuted: '#5E7048',
      border: '#CFDFB4',
      like: '#DC6E84',
      success: '#4E9A5E',
      danger: '#C26A38',
      shadow: 'rgba(80,120,50,0.18)',
    },
  },
  earthy: {
    key: 'earthy',
    name: 'Earthy',
    mode: 'light',
    radius: soft,
    gradient: ['#D2AC78', '#E2C9A3'],
    colors: {
      bg: '#E2C9A3',
      bgAlt: '#FBF3E6',
      bgInset: '#EAD9BE',
      primary: '#A85A2C',
      onPrimary: '#FFF6EC',
      secondary: '#8C9A5B',
      accent: '#C8893A',
      text: '#3A2A1A',
      textMuted: '#7A6648',
      border: '#E0CDA8',
      like: '#BB4D2E',
      success: '#6E8B4E',
      danger: '#B5503F',
      shadow: 'rgba(120,80,40,0.18)',
    },
  },
  cat: {
    key: 'cat',
    name: 'Cat',
    mode: 'light',
    radius: round,
    gradient: ['#D6B98D', '#E6D2B8'],
    colors: {
      bg: '#E6D2B8',
      bgAlt: '#FCF6EC',
      bgInset: '#EDDFC8',
      primary: '#B0703C',
      onPrimary: '#FFF6EC',
      secondary: '#6E6660',
      accent: '#D99A4E',
      text: '#33271B',
      textMuted: '#7E6E5C',
      border: '#E2D2B8',
      like: '#DB6E88',
      success: '#6FA08A',
      danger: '#C76B52',
      shadow: 'rgba(120,80,50,0.18)',
    },
  },
  rubber_duck: {
    key: 'rubber_duck',
    name: 'Rubber Duck',
    mode: 'light',
    radius: round,
    gradient: ['#FFD23F', '#FFE890'],
    colors: {
      bg: '#FFE266',
      bgAlt: '#FFFBE8',
      bgInset: '#FFF0A6',
      primary: '#1FA6DE',
      onPrimary: '#FFFFFF',
      secondary: '#F2B705',
      accent: '#FF7A3D',
      text: '#3A3206',
      textMuted: '#8A7A2E',
      border: '#F3DD78',
      like: '#FF5C8A',
      success: '#46B97E',
      danger: '#F0673E',
      shadow: 'rgba(180,150,30,0.2)',
    },
  },
  mono: {
    key: 'mono',
    name: 'Mono',
    mode: 'light',
    radius: sharp,
    gradient: ['#D6D6DA', '#F2F2F4'],
    colors: {
      bg: '#E7E7EA',
      bgAlt: '#FFFFFF',
      bgInset: '#DDDDE1',
      primary: '#16161A',
      onPrimary: '#FFFFFF',
      secondary: '#6B7280',
      accent: '#16161A',
      text: '#16161A',
      textMuted: '#6B6B72',
      border: '#D8D8DC',
      like: '#16161A',
      success: '#16A34A',
      danger: '#DC2626',
      shadow: 'rgba(20,20,25,0.12)',
    },
  },
  dark_red: {
    key: 'dark_red',
    name: 'Dark Red',
    mode: 'dark',
    radius: sharp,
    gradient: ['#4A1018', '#260A0F'],
    colors: {
      bg: '#260A0F',
      bgAlt: '#39131B',
      bgInset: '#46171F',
      primary: '#E8344C',
      onPrimary: '#FFFFFF',
      secondary: '#8C1F2A',
      accent: '#E0A458',
      text: '#FBE7EA',
      textMuted: '#C39298',
      border: '#4C1D26',
      like: '#FF4D6D',
      success: '#4FAF8C',
      danger: '#FF6B5B',
      shadow: 'rgba(0,0,0,0.45)',
    },
  },
  emo: {
    key: 'emo',
    name: 'Emo',
    mode: 'dark',
    radius: sharp,
    gradient: ['#1C132E', '#0C0C12'],
    colors: {
      bg: '#0C0C12',
      bgAlt: '#17141F',
      bgInset: '#221C2F',
      primary: '#9B6CFF',
      onPrimary: '#FFFFFF',
      secondary: '#E0265E',
      accent: '#2DD4D4',
      text: '#ECEAF6',
      textMuted: '#9890AE',
      border: '#2A2438',
      like: '#FB3B6F',
      success: '#34D399',
      danger: '#F43F5E',
      shadow: 'rgba(0,0,0,0.55)',
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
