import { type ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from './ui';

interface Props {
  emoji: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function EmptyState({ emoji, title, subtitle, children }: Props) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 40, paddingHorizontal: 24, gap: 10 }}>
      <Text style={{ fontSize: 46 }}>{emoji}</Text>
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
