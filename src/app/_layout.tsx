import '@/global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DataProvider } from '@/data/DataProvider';
import { AppThemeProvider, FontAssets, useTheme } from '@/theme';

function RootStack() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.bg },
        }}>
        <Stack.Screen name="scan" options={{ presentation: 'modal' }} />
        <Stack.Screen name="item/new" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  // Load fonts in the background. Gate only on native (fast local load); never
  // block web, where the font loader can hang and leave a blank screen — there
  // text just falls back until the font swaps in.
  const [fontsLoaded, fontError] = useFonts(FontAssets);
  if (Platform.OS !== 'web' && !fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppThemeProvider>
          <DataProvider>
            <RootStack />
          </DataProvider>
        </AppThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
