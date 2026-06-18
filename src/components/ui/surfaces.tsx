import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

/**
 * Reusable "material" texture layers for the Metallic and Glass themes.
 * They fill their parent (absolute, no touches) and are reused on EVERYTHING
 * those themes touch — the background, the menu bar, cards and the hero — so the
 * whole app shares one material.
 *
 * The look is built by stacking gradients:
 *   • a base material gradient,
 *   • bright "gloss" highlights (the shiny reflections),
 *   • thin bevel/edge lines for a 3D, light-catching edge.
 * To make metal shinier or glass clearer, change the rgba alpha numbers.
 */

// ---- METAL: brushed steel + a bright diagonal glint -------------------------
// `gloss` = how strong the moving highlight is (0..1). Cards use a strong glint;
// the big background uses a softer one so cards still stand out.
export function MetallicLayers({ gloss = 0.85 }: { gloss?: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* base steel, banded like a curved reflective surface */}
      <LinearGradient
        colors={['#F4F6F9', '#D3D9E0', '#B9C0C9', '#CDD4DB', '#ECEFF2']}
        locations={[0, 0.28, 0.5, 0.72, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* the shiny glint — a bright white diagonal sweep */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0)',
          'rgba(255,255,255,0)',
          `rgba(255,255,255,${gloss})`,
          'rgba(255,255,255,0.2)',
          'rgba(255,255,255,0)',
        ]}
        locations={[0, 0.34, 0.47, 0.56, 0.82]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.75 }}
        style={StyleSheet.absoluteFill}
      />
      {/* polished bevel: bright top edge, dark bottom edge */}
      <View style={[StyleSheet.absoluteFill, { borderTopWidth: 1.5, borderTopColor: 'rgba(255,255,255,0.9)' }]} />
      <View style={[StyleSheet.absoluteFill, { borderBottomWidth: 1.5, borderBottomColor: 'rgba(40,50,60,0.18)' }]} />
    </View>
  );
}

// ---- GLASS: clear, see-through + a glossy top reflection --------------------
// Light frost (so it stays see-through and SHINY, not matte) + a bright top-half
// gloss + a sharp diagonal glare + bright reflective edges.
export function GlassLayers({ dark = false }: { dark?: boolean }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* light frost — low intensity keeps the glass clear & shiny */}
      <BlurView intensity={26} tint={dark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      {/* very light tint so color still shows through like real glass */}
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: dark ? 'rgba(20,22,40,0.16)' : 'rgba(255,255,255,0.14)' },
        ]}
      />
      {/* TOP GLOSS — a bright reflection on the upper half (the "shiny glass" cue) */}
      <LinearGradient
        colors={['rgba(255,255,255,0.62)', 'rgba(255,255,255,0.14)', 'rgba(255,255,255,0)']}
        locations={[0, 0.42, 0.62]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* a sharp diagonal glare streak */}
      <LinearGradient
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
        locations={[0.36, 0.46, 0.56]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* bright reflective edges (top + left catch the most light) */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)',
            borderTopColor: 'rgba(255,255,255,0.95)',
            borderLeftColor: 'rgba(255,255,255,0.7)',
          },
        ]}
      />
    </View>
  );
}
