import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_THEME, getTheme, THEMES, type ThemeKey, type ThemeTokens } from './themes';

const STORAGE_KEY = 'onda.theme';

interface ThemeContextValue {
  theme: ThemeTokens;
  themeKey: ThemeKey;
  /** Switch the active theme and persist it locally for instant load next time. */
  setThemeKey: (key: ThemeKey) => void;
  ready: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES[DEFAULT_THEME],
  themeKey: DEFAULT_THEME,
  setThemeKey: () => {},
  ready: false,
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeKey, setKey] = useState<ThemeKey>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  // Restore the last-used theme on launch so there's no flash of the default.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored && stored in THEMES) setKey(stored as ThemeKey);
      })
      .finally(() => setReady(true));
  }, []);

  const setThemeKey = useCallback((key: ThemeKey) => {
    setKey(key);
    AsyncStorage.setItem(STORAGE_KEY, key).catch(() => {});
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: getTheme(themeKey), themeKey, setThemeKey, ready }),
    [themeKey, setThemeKey, ready],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Access the active theme tokens (colors, radius, gradient…). */
export const useTheme = (): ThemeTokens => useContext(ThemeContext).theme;

/** Access the theme controls (current key + setter). */
export const useThemeControl = () => useContext(ThemeContext);
