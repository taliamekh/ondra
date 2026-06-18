import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { config } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { useThemeControl } from '@/theme';
import type { DataMode, Profile } from '@/types/models';

import { createLocalRepository } from './localRepo';
import type { Repository } from './repository';
import { createSupabaseRepository } from './supabaseRepo';

interface DataContextValue {
  repo: Repository;
  profile: Profile | null;
  /** 'cloud' = synced to Supabase, 'local' = offline AsyncStorage fallback. */
  mode: DataMode;
  loading: boolean;
  userId: string | null;
  refreshProfile: () => Promise<Profile | null>;
  updateProfile: (patch: Partial<Profile>) => Promise<Profile>;
  /** Sign out (cloud) and start fresh — used by "start over" in settings. */
  resetAccount: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { setThemeKey } = useThemeControl();
  const [repo, setRepo] = useState<Repository>(() => createLocalRepository());
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mode, setMode] = useState<DataMode>('local');
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initKey, setInitKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      let activeRepo: Repository = createLocalRepository();
      let activeMode: DataMode = 'local';
      let uid: string | null = null;

      if (config.supabaseEnabled) {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          let session = sessionData.session;
          if (!session) {
            // Anonymous sign-in gives every device a real Supabase user (with
            // RLS-protected cloud data) without a signup wall.
            const { data, error } = await supabase.auth.signInAnonymously();
            if (error) throw error;
            session = data.session;
          }
          if (session?.user) {
            uid = session.user.id;
            activeRepo = createSupabaseRepository(uid);
            activeMode = 'cloud';
          }
        } catch {
          activeRepo = createLocalRepository();
          activeMode = 'local';
          uid = null;
        }
      }

      let prof: Profile | null = null;
      try {
        prof = await activeRepo.getProfile();
      } catch {
        // Any cloud read failure → degrade gracefully to local storage.
        activeRepo = createLocalRepository();
        activeMode = 'local';
        uid = null;
        prof = await activeRepo.getProfile();
      }

      if (cancelled) return;
      setRepo(() => activeRepo);
      setMode(activeMode);
      setUserId(uid);
      setProfile(prof);
      if (prof?.theme) setThemeKey(prof.theme);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [initKey, setThemeKey]);

  const refreshProfile = useCallback(async () => {
    const p = await repo.getProfile();
    setProfile(p);
    return p;
  }, [repo]);

  const updateProfile = useCallback(
    async (patch: Partial<Profile>) => {
      const p = await repo.updateProfile(patch);
      setProfile(p);
      if (patch.theme) setThemeKey(patch.theme);
      return p;
    },
    [repo, setThemeKey],
  );

  const resetAccount = useCallback(async () => {
    if (mode === 'cloud') await supabase.auth.signOut().catch(() => {});
    setInitKey((k) => k + 1);
  }, [mode]);

  const value = useMemo<DataContextValue>(
    () => ({ repo, profile, mode, loading, userId, refreshProfile, updateProfile, resetAccount }),
    [repo, profile, mode, loading, userId, refreshProfile, updateProfile, resetAccount],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
