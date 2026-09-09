import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { ProductCard } from '../src/components/ProductCard';
import { DataTrustBadge } from '../src/components/DataTrustBadge';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { colors, radii, spacing, typography } from '../src/theme/tokens';
import { findMockProductByBarcode, mockMacroProgress, mockStore } from '../src/lib/mockData';

// A detected barcode is only added here once expo-camera has fully decoded
// it - the high-level CameraView API doesn't expose a "seen but too
// small/blurry to decode" signal at the JS layer (that needs a lower-level
// pipeline, e.g. react-native-vision-camera frame processors, as a future
// follow-up). Zero active detections is used below as the closest honest
// stand-in for the Section 2 "move closer" state.
const STALE_AFTER_MS = 1200;
const PRUNE_INTERVAL_MS = 400;

interface DetectedBarcode {
  data: string;
  x: number;
  y: number;
  lastSeenAt: number;
}

export default function ScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const { width, height } = useWindowDimensions();
  const [detections, setDetections] = useState<Record<string, DetectedBarcode>>({});

  const handleBarcodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      const bounds = result.bounds;
      // bounds is reported in the camera's own coordinate space; mapping it
      // 1:1 onto the preview's screen size is good enough for this skeleton
      // overlay, but real positioning needs calibration against the
      // camera's actual output resolution, which varies by device.
      const x = bounds ? bounds.origin.x + bounds.size.width / 2 : width / 2;
      const y = bounds ? bounds.origin.y + bounds.size.height / 2 : height / 2;

      setDetections((prev) => ({
        ...prev,
        [result.data]: { data: result.data, x, y, lastSeenAt: Date.now() },
      }));
    },
    [width, height],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDetections((prev) => {
        const next: Record<string, DetectedBarcode> = {};
        for (const [key, value] of Object.entries(prev)) {
          if (Date.now() - value.lastSeenAt < STALE_AFTER_MS) {
            next[key] = value;
          }
        }
        return next;
      });
    }, PRUNE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (!permission) {
    return <View style={styles.screen} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.screen, styles.permissionScreen]}>
        <Text style={styles.permissionText}>
          Hyllvy needs camera access to detect barcodes on the shelf.
        </Text>
        <PrimaryButton label="Grant camera access" onPress={requestPermission} />
      </View>
    );
  }

  const activeDetections = Object.values(detections);
  const proteinPct = Math.min(
    100,
    (mockMacroProgress.protein.current / mockMacroProgress.protein.target) * 100,
  );

  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        // EAN-13/EAN-8 cover Swedish/EU retail; UPC-A/E for imported goods.
        // TODO: tap-to-focus and telephoto-lens selection (Section 2) aren't
        // exposed by expo-camera's current JS API - would need
        // react-native-vision-camera or native module work to add.
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View style={styles.topBar}>
        <Text style={styles.storeName}>{mockStore.name}</Text>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${proteinPct}%` }]} />
      </View>

      {activeDetections.map((detection) => {
        const product = findMockProductByBarcode(detection.data);
        const cardLeft = clamp(detection.x - 100, spacing.lg, width - 208 - spacing.lg);
        const cardTop = clamp(detection.y - 40, 96, height - 220);

        return (
          <Pressable
            key={detection.data}
            style={[styles.overlayCardPosition, { left: cardLeft, top: cardTop }]}
            onPress={() => router.push(`/product/${detection.data}`)}
          >
            {product ? (
              <ProductCard
                variant="overlay"
                name={product.name}
                macroLine={product.macroLine}
                price={product.price}
                pricePerGramProtein={product.pricePerGramProtein}
              />
            ) : (
              <View style={styles.notFoundCard}>
                <DataTrustBadge status="missing" />
                <Text style={styles.notFoundText}>Tap to submit a label photo</Text>
              </View>
            )}
          </Pressable>
        );
      })}

      {activeDetections.length === 0 && (
        <View style={styles.moveCloserBanner}>
          <Text style={styles.moveCloserText}>Move closer to read</Text>
        </View>
      )}

      <Pressable
        style={styles.shutter}
        onPress={() => router.push('/session-summary')}
        accessibilityLabel="End shopping session"
      />
    </View>
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.scanBackground,
  },
  permissionScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.lg,
  },
  permissionText: {
    color: colors.textOnDark,
    fontSize: typography.cardLabel.fontSize,
    textAlign: 'center',
  },
  topBar: {
    position: 'absolute',
    top: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    color: colors.textOnDark,
    fontSize: typography.cardLabel.fontSize,
    fontWeight: '600',
  },
  closeIcon: {
    color: colors.textOnDark,
    fontSize: 18,
    fontWeight: '700',
  },
  progressTrack: {
    position: 'absolute',
    top: 64,
    left: spacing.lg,
    right: spacing.lg,
    height: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
  },
  overlayCardPosition: {
    position: 'absolute',
    width: 200,
  },
  notFoundCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  notFoundText: {
    fontSize: typography.supporting.fontSize,
    color: colors.textSecondary,
  },
  moveCloserBanner: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    bottom: 120,
    borderWidth: 1,
    borderColor: colors.borderOnDark,
    borderRadius: radii.card,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  moveCloserText: {
    color: colors.textOnDark,
    fontSize: typography.supporting.fontSize,
  },
  shutter: {
    position: 'absolute',
    bottom: spacing.xl,
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.textOnDark,
  },
});
