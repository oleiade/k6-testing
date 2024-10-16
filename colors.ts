export const ANSI_COLORS = {
  reset: "\x1b[0m",

  // Standard Colors
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",

  // Bright Colors
  brightBlack: "\x1b[90m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",

  // Dark Colors
  darkGrey: "\x1b[90m",
} as const;

export function colorize(
  text: string | undefined,
  color: keyof typeof ANSI_COLORS
): string {
  return `${ANSI_COLORS[color]}${text}${ANSI_COLORS.reset}`;
}
