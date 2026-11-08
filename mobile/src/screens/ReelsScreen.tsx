import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Share,
  Platform,
  ViewToken,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import {
  Play,
  Volume2,
  VolumeX,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Share2,
} from "lucide-react-native";
import { VideoRecord } from "../types";
import { fetchLiveEpisodes, NOTION_LIBRARY_URL } from "../lib/supabase";
import { colors, typography } from "../lib/theme";

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get("window");

interface ReelItemProps {
  item: VideoRecord;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  copiedCaptionId: string | null;
  copiedCommentId: string | null;
  onCopyCaption: (item: VideoRecord) => void;
  onCopyComment: (item: VideoRecord) => void;
  onOpenNotion: () => void;
  onShare: (item: VideoRecord) => void;
}

function ReelItem({
  item,
  isActive,
  isMuted,
  onToggleMute,
  copiedCaptionId,
  copiedCommentId,
  onCopyCaption,
  onCopyComment,
  onOpenNotion,
  onShare,
}: ReelItemProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  const videoUri =
    item.video_url ||
    `https://tqtfkuhtvkevqhhmnkfv.supabase.co/storage/v1/object/public/videos/sample-ep0${item.episode_number}.mp4`;

  const player = useVideoPlayer(videoUri, (p) => {
    p.loop = true;
    p.muted = isMuted;
    if (isActive) {
      p.play();
    } else {
      p.pause();
    }
  });

  useEffect(() => {
    player.muted = isMuted;
  }, [isMuted, player]);

  useEffect(() => {
    if (isActive) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  }, [isActive, player]);

  const handleTogglePlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.reelContainer}>
      {/* Native Hardware-Accelerated Video Player */}
      <Pressable onPress={handleTogglePlay} style={StyleSheet.absoluteFill}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
        />

        {/* Scrim Overlays */}
        <View style={styles.topScrim} />
        <View style={styles.bottomScrim} />

        {/* Center Play Indicator when Paused */}
        {!isPlaying && isActive && (
          <View style={styles.centerPlayBadge}>
            <Play size={42} color="#FFFFFF" fill="#FFFFFF" />
          </View>
        )}
      </Pressable>

      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandBadge}>
          <Sparkles size={14} color={colors.primary} />
          <Text style={styles.brandBadgeText}>100 DAYS OF FREE AI</Text>
        </View>

        {/* Audio Mute/Unmute Pill */}
        <TouchableOpacity
          onPress={onToggleMute}
          style={[styles.mutePill, isMuted && styles.mutePillActive]}
        >
          {isMuted ? (
            <>
              <VolumeX size={16} color="#FFFFFF" />
              <Text style={styles.mutePillText}>Tap for Sound</Text>
            </>
          ) : (
            <Volume2 size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* Right Floating Actions */}
      <View style={styles.rightActionsBar}>
        {/* Notion Guide Button */}
        <TouchableOpacity style={styles.actionPill} onPress={onOpenNotion}>
          <View style={[styles.actionIconCircle, { backgroundColor: colors.primary }]}>
            <ExternalLink size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionLabel}>Guide</Text>
        </TouchableOpacity>

        {/* 1-Tap Copy Caption */}
        <TouchableOpacity
          style={styles.actionPill}
          onPress={() => onCopyCaption(item)}
        >
          <View
            style={[
              styles.actionIconCircle,
              copiedCaptionId === item.id && { backgroundColor: colors.accentEmerald },
            ]}
          >
            {copiedCaptionId === item.id ? (
              <Check size={20} color="#FFFFFF" />
            ) : (
              <Copy size={20} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.actionLabel}>
            {copiedCaptionId === item.id ? "Copied!" : "Caption"}
          </Text>
        </TouchableOpacity>

        {/* 1-Tap Copy Comment */}
        <TouchableOpacity
          style={styles.actionPill}
          onPress={() => onCopyComment(item)}
        >
          <View
            style={[
              styles.actionIconCircle,
              copiedCommentId === item.id && { backgroundColor: colors.accentBlue },
            ]}
          >
            {copiedCommentId === item.id ? (
              <Check size={20} color="#FFFFFF" />
            ) : (
              <MessageSquare size={20} color="#FFFFFF" />
            )}
          </View>
          <Text style={styles.actionLabel}>
            {copiedCommentId === item.id ? "Copied!" : "Comment"}
          </Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity style={styles.actionPill} onPress={() => onShare(item)}>
          <View style={styles.actionIconCircle}>
            <Share2 size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Details Section */}
      <View style={styles.bottomDetails}>
        <View style={styles.episodePillRow}>
          <View style={styles.episodeTag}>
            <Text style={styles.episodeTagText}>
              DAY {item.episode_number.toString().padStart(2, "0")} / 100
            </Text>
          </View>
          <View style={styles.savingsTag}>
            <Text style={styles.savingsTagText}>
              {item.episode_number === 3
                ? "Saves $120/yr"
                : item.episode_number === 2
                ? "Saves $120/yr"
                : "Saves $600/yr"}
            </Text>
          </View>
        </View>

        <Text style={styles.episodeTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.episodeDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cohostRow}>
          <Text style={styles.cohostText}>
            Hosted by <Text style={{ fontWeight: "700", color: "#FFFFFF" }}>Harshith & Claude</Text> • 100% Free
          </Text>
        </View>
      </View>
    </View>
  );
}

export function ReelsScreen() {
  const [episodes, setEpisodes] = useState<VideoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  // Default to MUTED to protect user from sudden sound/distortion on launch
  const [isMuted, setIsMuted] = useState(true);
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);
  const [copiedCommentId, setCopiedCommentId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchLiveEpisodes();
      setEpisodes(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 75,
  }).current;

  const toggleMute = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsMuted(!isMuted);
  };

  const handleCopyCaption = async (item: VideoRecord) => {
    if (!item.caption) return;
    const text = item.hashtags
      ? `${item.caption}\n\n${item.hashtags}`
      : item.caption;
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedCaptionId(item.id);
    setTimeout(() => setCopiedCaptionId(null), 2500);
  };

  const handleCopyComment = async (item: VideoRecord) => {
    if (!item.pinned_comment) return;
    await Clipboard.setStringAsync(item.pinned_comment);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedCommentId(item.id);
    setTimeout(() => setCopiedCommentId(null), 2500);
  };

  const handleOpenNotionGuide = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await WebBrowser.openBrowserAsync(NOTION_LIBRARY_URL, {
      toolbarColor: colors.background,
      controlsColor: colors.primary,
    });
  };

  const handleShare = async (item: VideoRecord) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `${item.title}\nWatch 100 Days of Free AI by @harshith.claude: ${NOTION_LIBRARY_URL}`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading 100 Days of Free AI...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={episodes}
        renderItem={({ item, index }) => (
          <ReelItem
            item={item}
            isActive={index === activeIndex}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            copiedCaptionId={copiedCaptionId}
            copiedCommentId={copiedCommentId}
            onCopyCaption={handleCopyCaption}
            onCopyComment={handleCopyComment}
            onOpenNotion={handleOpenNotionGuide}
            onShare={handleShare}
          />
        )}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={WINDOW_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshing={loading}
        onRefresh={loadData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    gap: 12,
  },
  loadingText: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
  reelContainer: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    position: "relative",
  },
  topScrim: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  bottomScrim: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: "rgba(0,0,0,0.65)",
  },
  centerPlayBadge: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: [{ translateX: -36 }, { translateY: -36 }],
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 36,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  brandBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.text,
    letterSpacing: 0.5,
  },
  mutePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  mutePillActive: {
    backgroundColor: "rgba(234, 88, 12, 0.85)",
  },
  mutePillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  rightActionsBar: {
    position: "absolute",
    right: 12,
    bottom: 110,
    alignItems: "center",
    gap: 16,
    zIndex: 10,
  },
  actionPill: {
    alignItems: "center",
    gap: 4,
  },
  actionIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomDetails: {
    position: "absolute",
    bottom: 40,
    left: 16,
    right: 80,
    zIndex: 10,
    gap: 6,
  },
  episodePillRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  episodeTag: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  episodeTagText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  savingsTag: {
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsTagText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  episodeTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  episodeDescription: {
    fontSize: 12,
    fontWeight: "400",
    color: "rgba(255,255,255,0.85)",
    lineHeight: 16,
  },
  cohostRow: {
    paddingTop: 4,
  },
  cohostText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
  },
});
