import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
} from "lucide-react-native";
import { ROADMAP_DATA } from "../lib/roadmapData";
import { NOTION_LIBRARY_URL } from "../lib/supabase";
import { colors, typography } from "../lib/theme";

export function RoadmapScreen() {
  const [expandedPhases, setExpandedPhases] = useState<{ [key: string]: boolean }>({
    "phase-1": true,
    "phase-2": true,
  });

  const togglePhase = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedPhases((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenNotion = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await WebBrowser.openBrowserAsync(NOTION_LIBRARY_URL);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Sparkles size={12} color={colors.primary} />
            <Text style={styles.badgeText}>100-DAY CURRICULUM</Text>
          </View>
          <Text style={styles.title}>The Free AI Roadmap</Text>
          <Text style={styles.subtitle}>
            A complete journey from $0 voice and image generators to autonomous local coding agents and cloud deployment.
          </Text>
        </View>

        {/* Unlocked Savings Banner */}
        <View style={styles.savingsBanner}>
          <View style={styles.savingsIconBox}>
            <TrendingUp size={22} color={colors.accentEmerald} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.savingsTitle}>$840/year Unlocked So Far</Text>
            <Text style={styles.savingsSubtitle}>
              Days 01–03 replace Kokoro, Midjourney & Copilot with $0 tools.
            </Text>
          </View>
        </View>

        {/* Notion Hub Link */}
        <TouchableOpacity style={styles.notionCard} onPress={handleOpenNotion}>
          <View style={{ flex: 1 }}>
            <Text style={styles.notionCardTitle}>Open Public Notion Hub</Text>
            <Text style={styles.notionCardSub}>
              Read detailed markdown guides, copy code snippets & scripts
            </Text>
          </View>
          <ExternalLink size={18} color={colors.primary} />
        </TouchableOpacity>

        {/* Phases Accordion */}
        <View style={styles.phasesContainer}>
          {ROADMAP_DATA.map((phase) => {
            const isExpanded = expandedPhases[phase.id];
            return (
              <View key={phase.id} style={styles.phaseCard}>
                <TouchableOpacity
                  style={styles.phaseHeader}
                  onPress={() => togglePhase(phase.id)}
                >
                  <View style={{ flex: 1 }}>
                    <View style={styles.phaseTagRow}>
                      <Text style={styles.phaseEpisodes}>{phase.episodes}</Text>
                      {phase.status === "active" && (
                        <View style={styles.activePill}>
                          <Text style={styles.activePillText}>IN PROGRESS</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.phaseTitle}>{phase.title}</Text>
                  </View>
                  {isExpanded ? (
                    <ChevronDown size={20} color={colors.textSecondary} />
                  ) : (
                    <ChevronRight size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.topicsList}>
                    <Text style={styles.phaseDesc}>{phase.description}</Text>
                    {phase.topics.map((topic) => (
                      <View key={topic.day} style={styles.topicRow}>
                        {topic.completed ? (
                          <CheckCircle2 size={18} color={colors.accentEmerald} />
                        ) : (
                          <Circle size={18} color={colors.border} />
                        )}
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.topicTitle,
                              topic.completed && styles.topicCompleted,
                            ]}
                          >
                            Day {topic.day.toString().padStart(2, "0")}: {topic.title}
                          </Text>
                          <Text style={styles.topicMeta}>
                            Tool: {topic.tool} • Saved: {topic.costSaved}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
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
  header: {
    paddingVertical: 10,
    gap: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    ...typography.hero,
  },
  subtitle: {
    ...typography.subtitle,
    lineHeight: 20,
  },
  savingsBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.accentEmeraldLight,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    borderRadius: 16,
    padding: 14,
  },
  savingsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  savingsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.accentEmerald,
  },
  savingsSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  notionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  notionCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  notionCardSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  phasesContainer: {
    gap: 12,
  },
  phaseCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    overflow: "hidden",
  },
  phaseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  phaseTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  phaseEpisodes: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  activePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.primary,
  },
  phaseTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  phaseDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  topicsList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: 12,
  },
  topicRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  topicTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  topicCompleted: {
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  topicMeta: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
