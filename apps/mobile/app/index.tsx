import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { TextField } from '../src/components/TextField';
import { colors, spacing, typography } from '../src/theme/tokens';

/**
 * Onboarding/auth - log in (build brief Section 12). No real auth backend
 * yet, so "Log in" just navigates on - the client has no business logic.
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Log in</Text>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />
        <PrimaryButton label="Log in" onPress={() => router.replace('/dashboard')} />
        <Link href="/signup" style={styles.link}>
          <Text style={styles.linkText}>Don&apos;t have an account? Sign up</Text>
        </Link>
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
  link: {
    marginTop: spacing.lg,
    alignSelf: 'center',
  },
  linkText: {
    color: colors.accent,
    fontSize: typography.supporting.fontSize,
  },
});
