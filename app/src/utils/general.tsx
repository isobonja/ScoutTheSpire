import React from "react";

const COLOR_MAP: Record<string, string> = {
  blue: "text-blue-400",
  green: "text-green-400",
  red: "text-red-400",
  orange: "text-orange-400",
  purple: "text-purple-400",
  gold: "text-yellow-400",
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatSecondsToHMS = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  const parts = []

  if (h) {
    parts.push(`${h}hr`)
  }

  if (m) {
    parts.push(`${m}min`)
  }

  if (s || parts.length === 0) {
    parts.push(`${s}sec`)
  }

  return parts.join(" ")
}

export function resolveSTSTextColorFormatTag(
  text: string
): React.ReactNode[] {
  const regex =
    /\[(blue|green|red|orange|purple|gold)\](.*?)\[\/\1\]/g;

  const result: React.ReactNode[] = [];

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, color, content] = match;

    // Add plain text before match
    if (match.index > lastIndex) {
      result.push(
        text.slice(lastIndex, match.index)
      );
    }

    // Add colored span
    result.push(
      <span
        key={match.index}
        className={COLOR_MAP[color]}
      >
        {content}
      </span>
    );

    lastIndex = match.index + fullMatch.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
}