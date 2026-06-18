import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { config } from './config';

/**
 * Shared Supabase client.
 *
 * Uses AsyncStorage for session persistence (which maps to localStorage on web),
 * so the user stays signed in across launches on every platform.
 */
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // We are not using OAuth redirect callbacks, so don't try to parse the URL.
    detectSessionInUrl: false,
  },
});
