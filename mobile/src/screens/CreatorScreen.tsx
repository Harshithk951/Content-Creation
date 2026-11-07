import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Updates from "expo-updates";
import * as Haptics from "expo-haptics";
import {
  Instagram,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Smartphone,
  Zap,
} from "lucide-react-native";
import { NOTION_LIBRARY_URL, INSTAGRAM_URL } from "../lib/supabase";
import { colors, typography } from "../lib/theme";

export function CreatorScreen() {
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string>("App is up to date");

  const handleOpenInstagram = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(INSTAGRAM_URL);
  };

  const handleOpenNotion = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(NOTION_LIBRARY_URL);
  };

  const handleCheckOTAUpdate = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (__DEV__) {
      Alert.alert(
        "Development Mode",
        "EAS Over-The-Air updates are disabled in development builds. In production, updates download seamlessly in the background."
      );
      return;
    }

    try {
      setCheckingUpdate(true);
      setUpdateStatus("Checking for updates...");
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setUpdateStatus("Downloading update...");
        await Updates.fetchUpdateAsync();
        Alert.alert(
          "Update Ready",
          "A fresh version of 100 Days of Free AI has downloaded. Reload now?",
          [
            { text: "Later", style: "cancel" },
            {
              text: "Reload App",
              onPress: async () => {
                await Updates.reloadAsync();
              },
            },
          ]
        );
      } else {
        setUpdateStatus("You are on the latest version!");
        Alert.alert("Up to Date", "Your app has the latest episodes and features.");
      }
    } catch (e: any) {
      setUpdateStatus("Check completed");
      Alert.alert("Update Check", e.message || "Failed to check updates");
    } finally {
      setCheckingUpdate(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Creator Identity Hero */}
        <View style={styles.heroCard}>
          <View style={styles.avatarRow}>
            {/* Harshith Avatar Pill */}
            <View style={styles.avatarBubble}>
              <View style={styles.avatarInitialH}>
                <Text style={styles.avatarLetter}>H</Text>
              </View>
              <Text style={styles.avatarName}>Harshith</Text>
              <Text style={styles.avatarRole}>Creator</Text>
            </View>

            <Text style={styles.plusSign}>+</Text>

            {/* Claude Avatar Pill */}
            <View style={styles.avatarBubble}>
              <View style={styles.avatarInitialC}>
                <Text style={styles.avatarLetter}>C</Text>
              </View>
              <Text style={styles.avatarName}>Claude</Text>
              <Text style={styles.avatarRole}>AI Co-Host</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>100 Days of Free AI</Text>
          <Text style={styles.heroBio}>
            Created by Harshith Kumar to empower developers, creators, and students to build cutting-edge software with $0 subscriptions.
          </Text>

          {/* Social Links */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.instagramButton}
              onPress={handleOpenInstagram}
            >
              <Instagram size={16} color="#FFFFFF" />
              <Text style={styles.instagramButtonText}>@harshith.claude</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleOpenNotion}
            >
              <Sparkles size={16} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Notion Guides</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Real-Time Sync & OTA Card */}
        <View style={styles.syncCard}>
          <View style={styles.syncCardHeader}>
            <View style={styles.syncIconContainer}>
              <Smartphone size={20} color={colors.accentBlue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.syncTitle}>Live Cloud & OTA Updates</Text>
              <Text style={styles.syncSubtitle}>
                New episodes appear automatically the moment they are released in Supabase.
              </Text>
            </View>
          </View>

          <View style={styles.otaStatusBox}>
            <View style={styles.otaRow}>
              <Text style={styles.otaLabel}>Update Channel</Text>
              <Text style={styles.otaValue}>Production / Live</Text>
            </View>
            <View style={styles.otaRow}>
              <Text style={styles.otaLabel}>Supabase Sync</Text>
              <View style={styles.statusIndicator}>
                <View style={styles.greenDot} />
                <Text style={styles.statusText}>Connected</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkUpdateButton}
            onPress={handleCheckOTAUpdate}
            disabled={checkingUpdate}
          >
            {checkingUpdate ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <RefreshCw size={16} color={colors.text} />
            )}
            <Text style={styles.checkUpdateButtonText}>
              {checkingUpdate ? "Checking EAS OTA..." : "Check for App Updates"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Savings Promise */}
        <View style={styles.guaranteeCard}>
          <ShieldCheck size={24} color={colors.accentEmerald} />
          <View style={{ flex: 1 }}>
            <Text style={styles.guaranteeTitle}>The 100% Free Guarantee</Text>
            <Text style={styles.guaranteeText}>
              Every tool featured in this series has a genuine, production-grade free tier, open-source license, or local runtime.
            </Text>
          </View>
        </View>

        {/* Footer info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Built with React Native & Expo • Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    textAlign: "center",
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
    gap: 12,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarBubble: {
    alignItems: "center",
  },
  avatarInitialH: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  avatarInitialC: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accentBlue,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.accentBlue,
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  avatarLetter: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
  },
  avatarName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginTop: 6,
  },
  avatarRole: {
    fontSize: 11,
    color: colors.textMuted,
  },
  plusSign: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.textMuted,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  heroBio: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
    width: "100%",
  },
  instagramButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.text,
  },
  instagramButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  syncCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  syncCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  syncIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentBlueLight,
    justifyContent: "center",
    alignItems: "center",
  },
  syncTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  syncSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  otaStatusBox: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  otaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  otaLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  otaValue: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentEmerald,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.accentEmerald,
  },
  checkUpdateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkUpdateButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  guaranteeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.accentEmeraldLight,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 16,
    padding: 14,
  },
  guaranteeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.accentEmerald,
  },
  guaranteeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
});
