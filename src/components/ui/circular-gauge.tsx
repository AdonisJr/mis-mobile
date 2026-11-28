import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GaugeValueFont } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const GAUGE_SIZE = 160;
const GAUGE_TICK_COUNT = 40;
const GAUGE_TICK_LENGTH = 14;
const GAUGE_TICK_WIDTH = 4;
const GAUGE_RADIUS = (GAUGE_SIZE - GAUGE_TICK_LENGTH) / 2;
const DEGREES_PER_TICK = 360 / GAUGE_TICK_COUNT;
const MAX_FONT_SIZE_MULTIPLIER = 1.2;

export type CircularGaugeProps = { percent: number; caption: string };

export function CircularGauge({ percent, caption }: CircularGaugeProps) {
  const theme = useTheme();
  const clampedPercent = Math.round(Math.min(Math.max(percent, 0), 100));
  // floor so the ring is full only at 100%
  const filledTicks = Math.floor((clampedPercent / 100) * GAUGE_TICK_COUNT);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={caption}
      accessibilityValue={{ min: 0, max: 100, now: clampedPercent }}
      style={styles.gauge}>
      {Array.from({ length: GAUGE_TICK_COUNT }, (_, index) => (
        <View
          key={index}
          style={[
            styles.tick,
            {
              backgroundColor: index < filledTicks ? theme.graphic : theme.track,
              transform: [
                { rotate: `${index * DEGREES_PER_TICK}deg` },
                { translateY: -GAUGE_RADIUS },
              ],
            },
          ]}
        />
      ))}
      <View style={styles.centre}>
        <ThemedText maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER} style={styles.value}>
          {`${clampedPercent}%`}
        </ThemedText>
        <ThemedText
          type="small"
          themeColor="textSecondary"
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={MAX_FONT_SIZE_MULTIPLIER}>
          {caption}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gauge: {
    width: GAUGE_SIZE,
    height: GAUGE_SIZE,
    alignSelf: 'center',
  },
  tick: {
    position: 'absolute',
    left: (GAUGE_SIZE - GAUGE_TICK_WIDTH) / 2,
    top: (GAUGE_SIZE - GAUGE_TICK_LENGTH) / 2,
    width: GAUGE_TICK_WIDTH,
    height: GAUGE_TICK_LENGTH,
    borderRadius: GAUGE_TICK_WIDTH / 2,
  },
  centre: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: GAUGE_TICK_LENGTH * 2,
  },
  value: {
    fontSize: GaugeValueFont.fontSize,
    lineHeight: GaugeValueFont.lineHeight,
    fontWeight: 700,
  },
});
