import { Image } from 'expo-image';
import { View } from 'react-native';

import { colorFromString } from '@/lib/colors';

import { Text } from './ui';

interface Props {
  name: string;
  url?: string | null;
  size?: number;
}

export function Avatar({ name, url, size = 40 }: Props) {
  if (url) {
    return <Image source={{ uri: url }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />;
  }
  const initial = (name || '?').trim().charAt(0).toUpperCase() || '?';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colorFromString(name || 'onda'),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ fontWeight: '700', color: '#33333A', fontSize: size * 0.42 }}>{initial}</Text>
    </View>
  );
}
