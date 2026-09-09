import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SectionListRow } from '../src/components/SectionListRow';
import { colors, spacing, typography } from '../src/theme/tokens';

/**
 * Settings (build brief Section 12) - macro goals, account, data/privacy
 * controls (GDPR view/export/delete per Section 5), about/legal links.
 */
export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        <SectionListRow label="Macro goals" onPress={() => router.push('/macro-setup')} />
        <SectionListRow label="Account" onPress={() => {}} />
        <SectionListRow label="Privacy & data" onPress={() => {}} />
        <SectionListRow label="About & legal" onPress={() => {}} />
      </View>
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
    paddingHorizontal: spacing.xl,
  },
});
