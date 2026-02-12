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
  label: isWeb ? webColors.label : (AC.label || webColors.label),
  secondaryLabel: isWeb ? webColors.secondaryLabel : (AC.secondaryLabel || webColors.secondaryLabel),
  tertiaryLabel: isWeb ? webColors.tertiaryLabel : (AC.tertiaryLabel || webColors.tertiaryLabel),
  quaternaryLabel: isWeb ? webColors.quaternaryLabel : (AC.quaternaryLabel || webColors.quaternaryLabel),

  systemFill: isWeb ? webColors.systemFill : (AC.systemFill || webColors.systemFill),
  secondarySystemFill: isWeb ? webColors.secondarySystemFill : (AC.secondarySystemFill || webColors.secondarySystemFill),
  tertiarySystemFill: isWeb ? webColors.tertiarySystemFill : (AC.tertiarySystemFill || webColors.tertiarySystemFill),
  quaternarySystemFill: isWeb ? webColors.quaternarySystemFill : (AC.quaternarySystemFill || webColors.quaternarySystemFill),

  systemBackground: isWeb ? webColors.systemBackground : (AC.systemBackground || webColors.systemBackground),
  secondarySystemBackground: isWeb ? webColors.secondarySystemBackground : (AC.secondarySystemBackground || webColors.secondarySystemBackground),
  tertiarySystemBackground: isWeb ? webColors.tertiarySystemBackground : (AC.tertiarySystemBackground || webColors.tertiarySystemBackground),

  systemGroupedBackground: isWeb ? webColors.systemGroupedBackground : (AC.systemGroupedBackground || webColors.systemGroupedBackground),
  secondarySystemGroupedBackground: isWeb ? webColors.secondarySystemGroupedBackground : (AC.secondarySystemGroupedBackground || webColors.secondarySystemGroupedBackground),
  tertiarySystemGroupedBackground: isWeb ? webColors.tertiarySystemGroupedBackground : (AC.tertiarySystemGroupedBackground || webColors.tertiarySystemGroupedBackground),

  separator: isWeb ? webColors.separator : (AC.separator || webColors.separator),
  opaqueSeparator: isWeb ? webColors.opaqueSeparator : (AC.opaqueSeparator || webColors.opaqueSeparator),

  systemBlue: isWeb ? webColors.systemBlue : (AC.systemBlue || webColors.systemBlue),
  systemGreen: isWeb ? webColors.systemGreen : (AC.systemGreen || webColors.systemGreen),
  systemRed: isWeb ? webColors.systemRed : (AC.systemRed || webColors.systemRed),
  systemOrange: isWeb ? webColors.systemOrange : (AC.systemOrange || webColors.systemOrange),
  systemYellow: isWeb ? webColors.systemYellow : (AC.systemYellow || webColors.systemYellow),
  systemPink: isWeb ? webColors.systemPink : (AC.systemPink || webColors.systemPink),
  systemPurple: isWeb ? webColors.systemPurple : (AC.systemPurple || webColors.systemPurple),
  systemTeal: isWeb ? webColors.systemTeal : (AC.systemTeal || webColors.systemTeal),
  systemIndigo: isWeb ? webColors.systemIndigo : (AC.systemIndigo || webColors.systemIndigo),
  systemGray: isWeb ? webColors.systemGray : (AC.systemGray || webColors.systemGray),
};
