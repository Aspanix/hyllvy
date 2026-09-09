import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MetricCard } from '../src/components/MetricCard';
import { ProductCard } from '../src/components/ProductCard';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { colors, spacing, typography } from '../src/theme/tokens';
import { mockMacroProgress, mockScannedProducts } from '../src/lib/mockData';

/** Dashboard/home - matches the reference mockup (build brief Section 12/13). */
export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Today</Text>
          <Pressable onPress={() => router.push('/settings')} hitSlop={12}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </Pressable>
        </View>

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

        <Text style={styles.sectionLabel}>Last shopping session</Text>
        <View style={styles.sessionList}>
          {mockScannedProducts.map((product) => (
            <Pressable
              key={product.barcode}
              onPress={() => router.push(`/product/${product.barcode}`)}
            >
              <ProductCard
                name={product.name}
                macroLine={product.macroLine}
                trustStatus={product.trustStatus}
              />
            </Pressable>
          ))}
        </View>

        <PrimaryButton label="Start scanning" onPress={() => router.push('/scan')} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  settingsIcon: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.supporting.fontSize,
    color: colors.textSecondary,
  },
  sessionList: {
    gap: spacing.md,
  },
});
