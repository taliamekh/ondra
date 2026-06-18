import { Ionicons } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/theme';

import { Text } from './ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  icon: IconName;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function EmptyState({ icon, title, subtitle, children }: Props) {
  const theme = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 12 }}>
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          backgroundColor: theme.colors.bgInset,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Ionicons name={icon} size={34} color={theme.colors.primary} />
      </View>
      <Text variant="subtitle" center>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" muted center>
          {subtitle}
        </Text>
      ) : null}
      {children ? <View style={{ marginTop: 8, gap: 10, alignSelf: 'stretch' }}>{children}</View> : null}
    </View>
  );
}
