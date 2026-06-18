import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { Brand } from '@/components/Brand';
import { Text } from '@/components/ui';
import { useData } from '@/data/DataProvider';
import { useTheme } from '@/theme';

export default function Index() {
  const { loading, profile } = useData();
  const theme = useTheme();

  if (loading || !profile) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.bg, gap: 18 }}>
        <Brand size={52} />
        <Text variant="caption" muted>
          your closet, styled
        </Text>
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 8 }} />
      </View>
    );
  }

  return <Redirect href={profile.onboarded ? '/closet' : '/onboarding'} />;
}
