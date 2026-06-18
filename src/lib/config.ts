/**
 * App configuration.
 *
 * Supabase URL + publishable key are read from EXPO_PUBLIC_* env vars (see .env),
 * with the project defaults baked in as a fallback so the app runs out of the box.
 * The publishable/anon key is designed to ship in client apps — the database is
 * protected by Row Level Security, so this is safe to commit.
 */

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://pppwlxlykiqamandwmli.supabase.co';

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  'sb_publishable_LEdNnVmsDadpy9DjoucscQ_Pi7Wnm9z';

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  /** Whether we have enough config to talk to Supabase at all. */
  supabaseEnabled: Boolean(supabaseUrl && supabaseAnonKey),
} as const;
