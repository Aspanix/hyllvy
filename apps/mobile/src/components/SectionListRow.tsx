import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';

export interface SectionListRowProps {
  label: string;
  onPress?: () => void;
}

/** Label + trailing chevron - used in settings and any other navigable list. */
export function SectionListRow({ label, onPress }: SectionListRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.chevron}>{'›'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: typography.cardLabel.fontSize,
    color: colors.textPrimary,
  },
  chevron: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});

