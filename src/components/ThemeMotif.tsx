import Svg, { Circle, Ellipse, Path, Polygon } from 'react-native-svg';

import type { ThemeMotif as Motif } from '@/theme';

/**
 * Draws the little creature that belongs to a theme:
 *   • 'duck' -> a yellow rubber duck (Rubber Duck theme)
 *   • 'cat'  -> a ginger sitting cat (Cat theme)
 *
 * These are simple hand-built SVG drawings. To tweak a shape, edit the numbers
 * in its <Ellipse>/<Circle>/<Polygon>/<Path> (they're coordinates on a 64x64
 * grid). To recolor, change the `fill` colors.
 */
export function ThemeMotif({ motif, size = 56 }: { motif: Motif; size?: number }) {
  if (motif === 'duck') {
    return (
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {/* body */}
        <Ellipse cx={29} cy={42} rx={21} ry={13} fill="#FCD23B" />
        {/* wing */}
        <Path d="M20 41 Q29 33 39 41 Q29 47 20 41 Z" fill="#F0B400" />
        {/* head */}
        <Circle cx={46} cy={27} r={12} fill="#FCD23B" />
        {/* beak */}
        <Polygon points="55,24 64,28 55,32" fill="#FF9E3D" />
        {/* eye */}
        <Circle cx={48} cy={24} r={2} fill="#2A2620" />
      </Svg>
    );
  }

  // cat
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {/* tail (curls up on the right) */}
      <Path d="M42 50 Q60 48 55 32 Q53 25 48 29 Q53 36 46 41 Z" fill="#C9824B" />
      {/* body */}
      <Ellipse cx={30} cy={47} rx={16} ry={15} fill="#C9824B" />
      {/* ears */}
      <Polygon points="16,16 20,3 30,14" fill="#C9824B" />
      <Polygon points="40,16 36,3 26,14" fill="#C9824B" />
      {/* head */}
      <Circle cx={28} cy={23} r={12} fill="#C9824B" />
      {/* inner ears */}
      <Polygon points="19,13 21,6 26,13" fill="#E89AA0" />
      <Polygon points="37,13 35,6 30,13" fill="#E89AA0" />
      {/* eyes */}
      <Circle cx={23} cy={23} r={2} fill="#2E2A22" />
      <Circle cx={33} cy={23} r={2} fill="#2E2A22" />
      {/* nose */}
      <Polygon points="26,27 30,27 28,30" fill="#E89AA0" />
    </Svg>
  );
}
