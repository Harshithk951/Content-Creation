import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import {
  Search,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  ExternalLink,
  Tag,
  Clock,
  HardDrive,
  ShieldCheck,
} from "lucide-react-native";
import { VideoRecord } from "../types";
import { fetchLiveEpisodes, NOTION_LIBRARY_URL } from "../lib/supabase";
import { colors, typography } from "../lib/theme";

export function LibraryScreen() {
  const [episodes, setEpisodes] = useState<VideoRecord[]>([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState<VideoRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filterTabs = ["All", "Coding", "Voice", "Image & Art"];

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLiveEpisodes();
      setEpisodes(data);
      setFilteredEpisodes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let result = episodes;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes(q) ||
          ep.description?.toLowerCase().includes(q) ||
          ep.episode_number.toString().includes(q)
      );
    }

    if (selectedFilter === "Coding") {
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes("copilot") ||
          ep.title.toLowerCase().includes("continue") ||
          ep.title.toLowerCase().includes("coding")
      );
    } else if (selectedFilter === "Voice") {
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes("kokoro") ||
          ep.title.toLowerCase().includes("voice")
      );
    } else if (selectedFilter === "Image & Art") {
      result = result.filter(
        (ep) =>
          ep.title.toLowerCase().includes("flux") ||
          ep.title.toLowerCase().includes("midjourney")
      );
    }

    setFilteredEpisodes(result);
  }, [searchQuery, selectedFilter, episodes]);

  const handleCopyCaption = async (item: VideoRecord) => {
    const text = item.hashtags
      ? `${item.caption}\n\n${item.hashtags}`
      : item.caption || item.title;
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedId(`caption-${item.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyComment = async (item: VideoRecord) => {
    if (!item.pinned_comment) return;
    await Clipboard.setStringAsync(item.pinned_comment);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedId(`comment-${item.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenNotion = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await WebBrowser.openBrowserAsync(NOTION_LIBRARY_URL);
  };

  const renderEpisodeCard = ({ item }: { item: VideoRecord }) => {
    const isCopiedCaption = copiedId === `caption-${item.id}`;
    const isCopiedComment = copiedId === `comment-${item.id}`;

    return (
      <View style={styles.card}>
        {/* Top Badges */}
        <View style={styles.cardHeader}>
          <View style={styles.dayBadge}>
            <Text style={styles.dayBadgeText}>
              DAY {item.episode_number.toString().padStart(2, "0")}
            </Text>
          </View>
          <View style={styles.savingsPill}>
            <Text style={styles.savingsPillText}>
              {item.episode_number === 3
                ? "Saves $120/yr"
                : item.episode_number === 2
                ? "Saves $120/yr"
                : "Saves $600/yr"}
            </Text>
          </View>
        </View>

        {/* Title & Description */}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Action Buttons Row */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              isCopiedCaption && styles.actionButtonActive,
            ]}
            onPress={() => handleCopyCaption(item)}
          >
            {isCopiedCaption ? (
              <Check size={14} color="#FFFFFF" />
            ) : (
              <Copy size={14} color={colors.text} />
            )}
            <Text
              style={[
                styles.actionButtonText,
                isCopiedCaption && { color: "#FFFFFF" },
              ]}
            >
              {isCopiedCaption ? "Copied" : "Caption"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isCopiedComment && styles.actionButtonActive,
            ]}
            onPress={() => handleCopyComment(item)}
          >
            {isCopiedComment ? (
              <Check size={14} color="#FFFFFF" />
            ) : (
              <MessageSquare size={14} color={colors.text} />
            )}
            <Text
              style={[
                styles.actionButtonText,
                isCopiedComment && { color: "#FFFFFF" },
              ]}
            >
              {isCopiedComment ? "Copied" : "Comment"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notionButton}
            onPress={handleOpenNotion}
          >
            <ExternalLink size={14} color={colors.primary} />
            <Text style={styles.notionButtonText}>Guide</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Episode Library</Text>
          <Text style={styles.headerSubtitle}>
            100 Days of Free AI • Zero-Subscription Guides
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search episodes, tools, or topics..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* Filter Chips */}
        <View style={styles.filterRow}>
          {filterTabs.map((tab) => {
            const active = selectedFilter === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedFilter(tab);
                }}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    active && styles.filterChipTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Episode List */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredEpisodes}
            renderItem={renderEpisodeCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
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
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 12,
  },
  headerTitle: {
    ...typography.hero,
  },
  headerSubtitle: {
    ...typography.subtitle,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    marginTop: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayBadge: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  dayBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: colors.primary,
  },
  savingsPill: {
    backgroundColor: colors.accentEmeraldLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  savingsPillText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.accentEmerald,
  },
  cardTitle: {
    ...typography.title,
    marginTop: 2,
  },
  cardDesc: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonActive: {
    backgroundColor: colors.accentEmerald,
    borderColor: colors.accentEmerald,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  notionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  notionButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  center: {
    paddingVertical: 40,
    alignItems: "center",
  },
});
