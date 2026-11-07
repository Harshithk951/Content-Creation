export const colors = {
  background: "#FAF8F5",
  surface: "#FFFFFF",
  surfaceMuted: "#F5F2EB",
  border: "#E7E5E4",
  borderSubtle: "#F0EEE9",
  
  text: "#1C1917",
  textSecondary: "#57534E",
  textMuted: "#78716C",
  
  primary: "#EA580C",
  primaryHover: "#C2410C",
  primaryLight: "#FFF7ED",
  primaryBorder: "#FED7AA",
  
  accentBlue: "#2563EB",
  accentBlueLight: "#EFF6FF",
  accentEmerald: "#059669",
  accentEmeraldLight: "#ECFDF5",
  
  overlayDark: "rgba(10, 10, 10, 0.75)",
  cardShadow: "rgba(0, 0, 0, 0.04)",
};

export const typography = {
  hero: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: colors.text,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  mono: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: colors.textMuted,
  },
  tag: {
    fontSize: 10,
    fontWeight: "700" as const,
  },
};
