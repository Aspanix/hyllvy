import { StyleSheet, Text, View } from 'react-native';
import { TrustStatus } from '@hyllvy/shared-types';
import { colors, radii, spacing, typography } from '../theme/tokens';

/**
 * "How much should I trust this number" pill - shared by nutrition data
 * and price data (build brief Section 12), not two separate components.
 */
export interface DataTrustBadgeProps {
  status: TrustStatus;
}

const LABELS: Record<TrustStatus, string> = {
  verified: 'Verified',
  community: 'Community',
  missing: 'Not found',
};

const TINTS: Record<TrustStatus, { background: string; text: string }> = {
  verified: { background: colors.accentTint, text: colors.accent },
  community: { background: colors.warningTint, text: colors.warning },
  missing: { background: colors.neutralTint, text: colors.neutralText },
};

export function DataTrustBadge({ status }: DataTrustBadgeProps) {
  const tint = TINTS[status];

  return (
    <View style={[styles.pill, { backgroundColor: tint.background }]}>
      <Text style={[styles.label, { color: tint.text }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: typography.supporting.fontSize,
    fontWeight: '600',
  },
});
