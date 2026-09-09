import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MetricCard } from '../src/components/MetricCard';
import { ProductCard } from '../src/components/ProductCard';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { colors, spacing, typography } from '../src/theme/tokens';
import { mockMacroProgress, mockScannedProducts } from '../src/lib/mockData';

/** Shopping session summary (build brief Section 12) - scanned products + running totals. */
export default function SessionSummaryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Session summary</Text>

        <View style={styles.metricsRow}>
          <MetricCard
            label="Protein"
            current={mockMacroProgress.protein.current}
            target={mockMacroProgress.protein.target}
            unit={mockMacroProgress.protein.unit}
          />
          <MetricCard
            label="Calories"
            current={mockMacroProgress.calories.current}
            target={mockMacroProgress.calories.target}
          />
        </View>

        <Text style={styles.sectionLabel}>Scanned products</Text>
        <View style={styles.productList}>
          {mockScannedProducts.map((product) => (
            <ProductCard
              key={product.barcode}
              name={product.name}
              macroLine={product.macroLine}
              trustStatus={product.trustStatus}
            />
          ))}
        </View>

        <PrimaryButton label="Done" onPress={() => router.replace('/dashboard')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  title: {
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    color: colors.textPrimary,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.supporting.fontSize,
    color: colors.textSecondary,
  },
  productList: {
    gap: spacing.md,
  },
});
