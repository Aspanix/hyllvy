import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

export interface GhostButtonProps {
  label: string;
  onPress: () => void;
}

/** Secondary action - everything that isn't the one primary action on a screen. */
export function GhostButton({ label, onPress }: GhostButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    color: colors.accent,
    fontSize: typography.cardLabel.fontSize,
    fontWeight: '600',
  },
});
