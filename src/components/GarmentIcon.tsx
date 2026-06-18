import Svg, { Circle, Line, Path } from 'react-native-svg';

/**
 * Minimal line-art icons for clothing categories — themeable (stroke = color),
 * crisp at any size. Replaces emoji throughout the app.
 */

const PATHS: Record<string, string> = {
  tshirt: 'M8 4 L4.5 6.6 L6.6 9.7 L8.6 8.3 V20 H15.4 V8.3 L17.4 9.7 L19.5 6.6 L16 4 C16 4 14.4 5.6 12 5.6 C9.6 5.6 8 4 8 4 Z',
  tank: 'M8.6 4 C8.6 4 10 6 12 6 C14 6 15.4 4 15.4 4 V20 H8.6 Z',
  pants: 'M7 3 H17 L16.2 20.5 H12.8 L12 10 L11.2 20.5 H7.8 Z',
  dress: 'M9 4 C9 4 10.5 5.6 12 5.6 C13.5 5.6 15 4 15 4 L16.6 8.4 L19 20 H5 L7.4 8.4 Z',
  jacket: 'M8 4 L4.5 6.6 L6.6 9.7 L8.6 8.3 V20 H15.4 V8.3 L17.4 9.7 L19.5 6.6 L16 4 L12 7 Z M12 7 V20',
  shoe: 'M3.5 11 C5 11 6 11.5 7 12.3 C8 13.1 9 13.1 10 12.5 C12 11.3 13.5 13.5 17 14.5 C19 15.1 20.5 15.1 20.5 16.4 V18 H3.5 Z',
  bag: 'M9 9 V7.4 C9 5.2 15 5.2 15 7.4 V9 M6 9 H18 L17 20 H7 Z',
  hat: 'M5 14.4 C5 9 19 9 19 14.4 Z M3.6 14.4 H20.4 C20.4 14.4 20.4 16 19.4 16 H4.6 C3.6 16 3.6 14.4 3.6 14.4 Z',
  hanger: 'M12 9 V7.4 C12 6.2 11.1 5.6 11.1 5.6 M4.6 16.6 L12 10.6 L19.4 16.6 Z',
};

const SHAPE: Record<string, string> = {
  top: 'tshirt',
  activewear: 'tank',
  bottom: 'pants',
  dress: 'dress',
  swimwear: 'dress',
  outerwear: 'jacket',
  shoes: 'shoe',
  bag: 'bag',
  hat: 'hat',
  accessory: 'glasses',
  jewelry: 'ring',
  other: 'hanger',
};

interface Props {
  category: string;
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function GarmentIcon({ category, color, size = 28, strokeWidth = 1.7 }: Props) {
  const shape = SHAPE[category] ?? 'tshirt';
  const stroke = {
    stroke: color,
    strokeWidth,
    fill: 'none',
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {shape === 'glasses' ? (
        <>
          <Circle cx={7.5} cy={13} r={3.4} {...stroke} />
          <Circle cx={16.5} cy={13} r={3.4} {...stroke} />
          <Line x1={10.8} y1={12} x2={13.2} y2={12} {...stroke} />
          <Line x1={4.3} y1={11.8} x2={2.7} y2={10.4} {...stroke} />
          <Line x1={19.7} y1={11.8} x2={21.3} y2={10.4} {...stroke} />
        </>
      ) : shape === 'ring' ? (
        <>
          <Circle cx={12} cy={15.6} r={4.4} {...stroke} />
          <Path d="M9.6 8.9 L12 5.6 L14.4 8.9 L12 11.1 Z" {...stroke} />
        </>
      ) : (
        <Path d={PATHS[shape]} {...stroke} />
      )}
    </Svg>
  );
}
