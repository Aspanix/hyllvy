import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { DataTrustBadge } from '../../src/components/DataTrustBadge';
import { GhostButton } from '../../src/components/GhostButton';
import { colors, radii, spacing, typography } from '../../src/theme/tokens';
import { findMockProductByBarcode } from '../../src/lib/mockData';
import { formatCostPerGramProtein, formatPriceSek } from '../../src/lib/format';

/**
 * Product detail (build brief Section 12) - full nutrition breakdown,
 * price + cost-effectiveness, data-trust badges, report/submit actions.
 * `id` is the barcode - matches how the scan/dashboard screens navigate here.
 */
export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = findMockProductByBarcode(id ?? '');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Product</Text>
      </View>

      {product ? (
        <View style={styles.content}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.macroLine}>{product.macroLine}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPriceSek(product.price)}</Text>
            <View style={styles.costPill}>
              <Text style={styles.costPillText}>
                {formatCostPerGramProtein(product.pricePerGramProtein)}
              </Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            <DataTrustBadge status={product.trustStatus} />
          </View>

          <Text style={styles.disclaimer}>
            Nutrition data is informational and sourced from Open Food Facts /
            user submissions - always check the physical packaging for allergen
            information.
          </Text>

          <GhostButton label="Report incorrect data" onPress={() => {}} />
        </View>
      ) : (
        <View style={styles.content}>
          <DataTrustBadge status="missing" />
          <Text style={styles.macroLine}>
            No entry found for this barcode yet.
          </Text>
          <GhostButton label="Submit label photo" onPress={() => {}} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  backIcon: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  title: {
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  macroLine: {
    fontSize: typography.cardLabel.fontSize,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  price: {
    fontSize: 22,
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
  badgeRow: {
    flexDirection: 'row',
  },
  disclaimer: {
    fontSize: typography.supporting.fontSize,
    color: colors.textSecondary,
  },
});
