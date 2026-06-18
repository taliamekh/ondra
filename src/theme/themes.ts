/**
 * ============================================================================
 *  ONDA THEMES  —  the look of the whole app lives here
 * ============================================================================
 *
 * Each "theme" is a full set of colors (plus a few extras) that reskins the
 * entire app. The one the user picks in onboarding / Profile is applied
 * everywhere automatically.
 *
 * ----------------------------------------------------------------------------
 *  HOW TO EDIT A THEME'S COLORS
 * ----------------------------------------------------------------------------
 *  Find the theme below (e.g. `earthy:`) and change the hex codes in its
 *  `colors: { ... }` block. The most impactful ones:
 *    • bg        -> the big background color you see behind everything
 *    • text      -> the main text color
 *    • primary   -> buttons, links, highlights ("the main colour")
 *    • secondary -> a supporting accent
 *  Hex codes look like '#5A3E27'. Tip: a site like https://coolors.co helps you
 *  pick colors that go together.
 *
 * ----------------------------------------------------------------------------
 *  HOW TO ADD A NEW THEME
 * ----------------------------------------------------------------------------
 *  1. Add its key to the `ThemeKey` union just below.
 *  2. Add a new block in `THEMES` (copy an existing one and change the colors
 *     + `name`).
 *  3. Add its key to `THEME_ORDER` so it shows up in the theme picker.
 *
 * ----------------------------------------------------------------------------
 *  SPECIAL "TEXTURE" THEMES
 * ----------------------------------------------------------------------------
 *  `surface` controls how cards are drawn:
 *    • undefined / 'flat' -> normal solid color (most themes)
 *    • 'metallic'         -> brushed-metal gradient (see Card.tsx)
 *    • 'glass'            -> frosted, see-through blur (see Card.tsx + Screen.tsx)
 *  `motif` shows a little creature on the theme (duck / cat).
 * ============================================================================
 */

// Every theme has a key (its id). To add a theme, add its id here too.
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
  | 'mono'
  | 'metallic'
  | 'glass';

// 'light' = dark text on light backgrounds; 'dark' = light text on dark ones.
export type ThemeMode = 'light' | 'dark';

// Texture style for cards/surfaces. Most themes are 'flat'.
export type ThemeSurface = 'flat' | 'metallic' | 'glass';

// Optional decorative creature shown on a theme.
export type ThemeMotif = 'duck' | 'cat';

/** Every color the app uses. Edit these hex codes to recolor a theme. */
export interface ThemeColors {
  bg: string; // the main app background (biggest color on screen)
  bgAlt: string; // cards and raised surfaces (usually lighter than bg)
  bgInset: string; // inputs, chips, wells, pressed states
  primary: string; // THE main color: buttons, links, highlights
  onPrimary: string; // text/icons that sit ON TOP of `primary` (keep it readable)
  secondary: string; // a supporting accent color
  accent: string; // an extra pop color used sparingly
  text: string; // main text color
  textMuted: string; // secondary / less-important text
  border: string; // thin lines and card outlines
  like: string; // heart / like color
  success: string; // "good" color (confirmations)
  danger: string; // "bad" color (delete, errors)
  shadow: string; // card drop-shadow color (use rgba so it can be see-through)
}

/** Corner roundness. Bigger = softer/rounder. */
export interface ThemeRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
}

/** A complete theme. */
export interface ThemeTokens {
  key: ThemeKey;
  name: string; // shown in the theme picker
  mode: ThemeMode;
  colors: ThemeColors;
  gradient: [string, string]; // top -> bottom gradient used on hero areas
  radius: ThemeRadius;
  surface?: ThemeSurface; // texture style for cards (default 'flat')
  surfaceGradient?: [string, string, string]; // metallic sheen (3 colors)
  motif?: ThemeMotif; // a creature shown on this theme
}

// Three roundness presets you can reuse. (sm..xl are corner sizes in pixels.)
const round: ThemeRadius = { sm: 12, md: 18, lg: 24, xl: 32, pill: 999 }; // very rounded
const soft: ThemeRadius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 }; // medium
const sharp: ThemeRadius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 }; // crisp

// ============================================================================
//  THE THEMES  —  edit the hex codes in any `colors` block to recolor a theme
// ============================================================================
export const THEMES: Record<ThemeKey, ThemeTokens> = {
  // --- Pink Cute: soft pink, playful ----------------------------------------
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

  // --- Lavender: soft purple ------------------------------------------------
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

  // --- Light Blue: airy sky -------------------------------------------------
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

  // --- Matcha: soft green ---------------------------------------------------
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

  // --- Earthy: DARK BROWN + SAGE GREEN (the two main colors) -----------------
  // bg is a soft sage; primary/text are dark brown; secondary is sage green.
  earthy: {
    key: 'earthy',
    name: 'Earthy',
    mode: 'light',
    radius: soft,
    gradient: ['#5E4128', '#9CAF73'], // dark brown -> sage (shows both main colors)
    colors: {
      bg: '#CBD3B2', // soft sage background (not beige)
      bgAlt: '#F4F2E2', // warm cream cards
      bgInset: '#DCE0C4', // sage-tinted inputs/chips
      primary: '#5A3E27', // DARK BROWN — the main color (buttons, highlights)
      onPrimary: '#FAF6EC',
      secondary: '#7E8C4F', // SAGE GREEN — the second main color
      accent: '#8FA05A', // lighter sage
      text: '#2C2015', // espresso brown text
      textMuted: '#6E6047',
      border: '#C5CCA6',
      like: '#B0563A',
      success: '#6E8B4E',
      danger: '#B5503F',
      shadow: 'rgba(70,60,30,0.2)',
    },
  },

  // --- Cat: warm gingers + cream (has a cat motif) --------------------------
  cat: {
    key: 'cat',
    name: 'Cat',
    mode: 'light',
    radius: round,
    motif: 'cat', // shows a cat on this theme
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

  // --- Rubber Duck: bright yellow + sky blue (has a duck motif) --------------
  rubber_duck: {
    key: 'rubber_duck',
    name: 'Rubber Duck',
    mode: 'light',
    radius: round,
    motif: 'duck', // shows a rubber duck on this theme
    gradient: ['#FFD23F', '#FFE890'],
    colors: {
      bg: '#FFE266',
      bgAlt: '#FFFBE8',
      bgInset: '#FFF0A6',
      primary: '#1FA6DE', // sky-blue (pops against the yellow)
      onPrimary: '#FFFFFF',
      secondary: '#F2B705', // duck yellow
      accent: '#FF7A3D', // beak orange
      text: '#3A3206',
      textMuted: '#8A7A2E',
      border: '#F3DD78',
      like: '#FF5C8A',
      success: '#46B97E',
      danger: '#F0673E',
      shadow: 'rgba(180,150,30,0.2)',
    },
  },

  // --- Glass: frosted, see-through "glassmorphism" --------------------------
  // The background is a colorful gradient (Screen.tsx draws it) and the cards
  // are frosted blur (Card.tsx draws them with expo-blur).
  glass: {
    key: 'glass',
    name: 'Glass',
    mode: 'light',
    radius: round,
    surface: 'glass', // <- turns on the frosted-blur card texture
    gradient: ['#A9C9FF', '#FFBBEC'], // dreamy blue -> pink behind the glass
    colors: {
      bg: '#CDD9F5',
      bgAlt: '#EAF0FB', // used for the tab bar etc. (cards use blur instead)
      bgInset: '#E0E8F7',
      primary: '#5B6CF0',
      onPrimary: '#FFFFFF',
      secondary: '#8FA3F2',
      accent: '#E26DBE',
      text: '#232A4A',
      textMuted: '#5C6488',
      border: 'rgba(255,255,255,0.65)', // bright glassy edge
      like: '#E8467F',
      success: '#2FA98C',
      danger: '#E5564E',
      shadow: 'rgba(60,70,140,0.22)',
    },
  },

  // --- Metallic: brushed steel + chrome -------------------------------------
  // Cards use a 3-color sheen gradient (`surfaceGradient`) for a metal look.
  metallic: {
    key: 'metallic',
    name: 'Metallic',
    mode: 'light',
    radius: soft,
    surface: 'metallic', // <- turns on the brushed-metal card texture
    surfaceGradient: ['#F4F6F8', '#CBD1D8', '#E6E9ED'], // light -> mid -> light sheen
    gradient: ['#E9ECF0', '#C3C9D1'], // steel background gradient
    colors: {
      bg: '#DCE0E6',
      bgAlt: '#E4E7EC',
      bgInset: '#D2D7DE',
      primary: '#4B535C', // gunmetal
      onPrimary: '#FFFFFF',
      secondary: '#8A929C', // steel
      accent: '#C9A23F', // brushed gold pop
      text: '#23282E',
      textMuted: '#5E6670',
      border: '#B9C0C9',
      like: '#D14B6A',
      success: '#3E9E78',
      danger: '#D64550',
      shadow: 'rgba(40,50,60,0.22)',
    },
  },

  // --- Mono: clean black & white minimal ------------------------------------
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

  // --- Dark Red: moody crimson (dark mode) ----------------------------------
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

  // --- Emo: dark + violet (dark mode) ---------------------------------------
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

/**
 * The order themes appear in the picker. Add new theme keys here too,
 * or reorder to taste.
 */
export const THEME_ORDER: ThemeKey[] = [
  'pink_cute',
  'lavender',
  'light_blue',
  'matcha',
  'earthy',
  'cat',
  'rubber_duck',
  'glass',
  'metallic',
  'mono',
  'dark_red',
  'emo',
];

// The theme new users start on. Change this to set a different default.
export const DEFAULT_THEME: ThemeKey = 'pink_cute';

/** Look up a theme by key, falling back to the default if it's missing. */
export const getTheme = (key?: string | null): ThemeTokens =>
  (key && (THEMES as Record<string, ThemeTokens>)[key]) || THEMES[DEFAULT_THEME];
