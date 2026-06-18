import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ComponentProps, type ReactNode } from 'react';
import { View } from 'react-native';

import { Spacing, useTheme } from '@/theme';

import { IconButton, Text } from './ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
  title: string;
  closeIcon?: IconName;
  onClose?: () => void;
  right?: ReactNode;
}

export function ScreenHeader({ title, closeIcon = 'chevron-back', onClose, right }: Props) {
  const router = useRouter();
  useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.three }}>
      <IconButton icon={closeIcon} onPress={onClose ?? (() => router.back())} />
      <Text variant="heading" style={{ flex: 1 }} numberOfLines={1}>
        {title}
      </Text>
      {right}
    </View>
  );
}
