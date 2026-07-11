import React from "react";

/** Map of text colors for STS formatting */
const COLOR_MAP: Record<string, string> = {
  blue: "text-blue-400",
  green: "text-green-400",
  red: "text-red-400",
  orange: "text-orange-400",
  purple: "text-purple-400",
  gold: "text-yellow-400",
};

/** Standard capitalize function */
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/** Format seconds to hours, minutes, and seconds 
 * 
 * @param seconds - The number of seconds to format.
 * @returns A string representing the formatted time in hours, minutes, and seconds.
 */
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

/**
 * Resolves text color formatting tags in a string and returns an array of React nodes.
 * The formatting tags are in the format [color]text[/color], where color can be blue, green, red, orange, purple, or gold.
 * 
 * @param text - The input string containing text with color formatting tags.
 * @returns An array of React nodes with the appropriate color formatting applied.
 */
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

/**
 * Extracts the name from a Slay the Spire ID (STS ID) string.
 * The STS ID is expected to be in the format "CATEGORY.NAME", and this function returns the capitalized NAME part.
 * 
 * @param id - The STS ID string from which to extract the name.
 * @returns The capitalized name extracted from the STS ID, or an empty string if the format is invalid.
 */
export function extractNameFromSTSID(id: string) {
  const regex = /\w+\.\w+/g;
  if (!regex.test(id)) {
    return ""
  }

  const name = id.split(".")[1]
  return capitalize(name)
}