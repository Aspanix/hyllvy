import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { TextField } from '../src/components/TextField';
import { colors, spacing, typography } from '../src/theme/tokens';

/** Macro goal setup (build brief Section 2/12) - daily protein/carbs/fat/calorie targets. */
export default function MacroSetupScreen() {
  const router = useRouter();
  const [proteinG, setProteinG] = useState('200');
  const [carbsG, setCarbsG] = useState('250');
  const [fatG, setFatG] = useState('70');
  const [calories, setCalories] = useState('2400');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Daily macro targets</Text>
        <TextField label="Protein (g)" value={proteinG} onChangeText={setProteinG} keyboardType="numeric" />
        <TextField label="Carbs (g)" value={carbsG} onChangeText={setCarbsG} keyboardType="numeric" />
        <TextField label="Fat (g)" value={fatG} onChangeText={setFatG} keyboardType="numeric" />
        <TextField label="Calories" value={calories} onChangeText={setCalories} keyboardType="numeric" />
        <PrimaryButton label="Continue" onPress={() => router.replace('/dashboard')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.screenTitle.fontSize,
    fontWeight: typography.screenTitle.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
});
