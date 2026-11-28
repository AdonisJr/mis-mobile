import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, TouchTarget } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AvatarProps = { firstName: string; lastName: string; size?: number };

function getInitials(firstName: string, lastName: string): string {
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
}

export function Avatar({ firstName, lastName, size = TouchTarget }: AvatarProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={`${firstName} ${lastName}`}
      style={[styles.circle, { width: size, height: size, backgroundColor: theme.accent }]}>
      <ThemedText type="smallBold" themeColor="onAccent">
        {getInitials(firstName, lastName)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
