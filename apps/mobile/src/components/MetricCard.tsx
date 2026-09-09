import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

export interface MetricCardProps {
  label: string;
  current: number;
  target: number;
  /** e.g. "g" for protein, "" for calories - appended after the target. */
  unit?: string;
}

export function MetricCard({ label, current, target, unit = '' }: MetricCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>
        {current}
        <Text style={styles.target}>
          {' '}
          / {target}
          {unit ? ` ${unit}` : ''}
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  label: {
    fontSize: typography.supporting.fontSize,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  target: {
    fontSize: typography.supporting.fontSize,
    fontWeight: '400',
    color: colors.textSecondary,
  },
});
