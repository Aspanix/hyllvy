import { StyleSheet, Text, View } from 'react-native';
import { TrustStatus } from '@hyllvy/shared-types';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { DataTrustBadge } from './DataTrustBadge';
import { formatCostPerGramProtein, formatPriceSek } from '../lib/format';

/**
 * Used in the live scan overlay, shopping session summaries, and product
 * detail (build brief Section 12) - one component, styled per context via
 * `variant` rather than forked into separate components.
 */
export interface ProductCardProps {
  name: string;
  /** e.g. "12g protein / 100g" */
  macroLine: string;
  price?: number;
  /** Overlay variant only: shows the cost-effectiveness pill instead of a trust badge. */
  pricePerGramProtein?: number;
  trustStatus?: TrustStatus;
  variant?: 'list' | 'overlay';
}

export function ProductCard({
  name,
  macroLine,
  price,
  pricePerGramProtein,
  trustStatus,
  variant = 'list',
}: ProductCardProps) {
  const isOverlay = variant === 'overlay';

  return (
    <View style={[styles.card, isOverlay && styles.cardOverlay]}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.macroLine}>{macroLine}</Text>
      {isOverlay ? (
        <View style={styles.trailingRow}>
          {price !== undefined && <Text style={styles.price}>{formatPriceSek(price)}</Text>}
          {pricePerGramProtein !== undefined && (
            <View style={styles.costPill}>
              <Text style={styles.costPillText}>
                {formatCostPerGramProtein(pricePerGramProtein)}
              </Text>
            </View>
          )}
        </View>
      ) : (
        trustStatus && (
          <View style={styles.trustBadgeSlot}>
            <DataTrustBadge status={trustStatus} />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardOverlay: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  name: {
    fontSize: typography.cardLabel.fontSize,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  macroLine: {
    fontSize: typography.supporting.fontSize,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  trailingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  price: {
    fontSize: typography.cardLabel.fontSize,
    fontWeight: '700',
    color: colors.accent,
  },
  costPill: {
    backgroundColor: colors.accentTint,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  costPillText: {
    fontSize: typography.supporting.fontSize,
    color: colors.accent,
    fontWeight: '600',
  },
  trustBadgeSlot: {
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg,
  },
});
