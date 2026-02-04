// Platform-aware colors that work on both iOS and web
// On iOS, uses @bacons/apple-colors for native semantic colors
// On web, provides equivalent CSS values

import AC from "@bacons/apple-colors";

// Check if we're on web
const isWeb = process.env.EXPO_OS === "web";

// Web fallback colors (light mode defaults, CSS will handle dark mode)
const webColors = {
  // Labels
  label: "#000000",
  secondaryLabel: "#3c3c4399",
  tertiaryLabel: "#3c3c434d",
  quaternaryLabel: "#3c3c432e",

  // Fills
  systemFill: "#78788033",
  secondarySystemFill: "#78788029",
  tertiarySystemFill: "#7676801f",
  quaternarySystemFill: "#74748014",

  // Backgrounds
  systemBackground: "#ffffff",
  secondarySystemBackground: "#f2f2f7",
  tertiarySystemBackground: "#ffffff",

  // Grouped backgrounds
  systemGroupedBackground: "#f2f2f7",
  secondarySystemGroupedBackground: "#ffffff",
  tertiarySystemGroupedBackground: "#f2f2f7",

  // Separator
  separator: "#3c3c4349",
  opaqueSeparator: "#c6c6c8",

  // System colors
  systemBlue: "#007aff",
  systemGreen: "#34c759",
  systemRed: "#ff3b30",
  systemOrange: "#ff9500",
  systemYellow: "#ffcc00",
  systemPink: "#ff2d55",
  systemPurple: "#af52de",
  systemTeal: "#5ac8fa",
  systemIndigo: "#5856d6",
  systemGray: "#8e8e93",
};

// Export colors that work on both platforms
export const Colors = {
  label: isWeb ? webColors.label : AC.label,
  secondaryLabel: isWeb ? webColors.secondaryLabel : AC.secondaryLabel,
  tertiaryLabel: isWeb ? webColors.tertiaryLabel : AC.tertiaryLabel,
  quaternaryLabel: isWeb ? webColors.quaternaryLabel : AC.quaternaryLabel,

  systemFill: isWeb ? webColors.systemFill : AC.systemFill,
  secondarySystemFill: isWeb ? webColors.secondarySystemFill : AC.secondarySystemFill,
  tertiarySystemFill: isWeb ? webColors.tertiarySystemFill : AC.tertiarySystemFill,
  quaternarySystemFill: isWeb ? webColors.quaternarySystemFill : AC.quaternarySystemFill,

  systemBackground: isWeb ? webColors.systemBackground : AC.systemBackground,
  secondarySystemBackground: isWeb ? webColors.secondarySystemBackground : AC.secondarySystemBackground,
  tertiarySystemBackground: isWeb ? webColors.tertiarySystemBackground : AC.tertiarySystemBackground,

  systemGroupedBackground: isWeb ? webColors.systemGroupedBackground : AC.systemGroupedBackground,
  secondarySystemGroupedBackground: isWeb ? webColors.secondarySystemGroupedBackground : AC.secondarySystemGroupedBackground,
  tertiarySystemGroupedBackground: isWeb ? webColors.tertiarySystemGroupedBackground : AC.tertiarySystemGroupedBackground,

  separator: isWeb ? webColors.separator : AC.separator,
  opaqueSeparator: isWeb ? webColors.opaqueSeparator : AC.opaqueSeparator,

  systemBlue: isWeb ? webColors.systemBlue : AC.systemBlue,
  systemGreen: isWeb ? webColors.systemGreen : AC.systemGreen,
  systemRed: isWeb ? webColors.systemRed : AC.systemRed,
  systemOrange: isWeb ? webColors.systemOrange : AC.systemOrange,
  systemYellow: isWeb ? webColors.systemYellow : AC.systemYellow,
  systemPink: isWeb ? webColors.systemPink : AC.systemPink,
  systemPurple: isWeb ? webColors.systemPurple : AC.systemPurple,
  systemTeal: isWeb ? webColors.systemTeal : AC.systemTeal,
  systemIndigo: isWeb ? webColors.systemIndigo : AC.systemIndigo,
  systemGray: isWeb ? webColors.systemGray : AC.systemGray,
};
