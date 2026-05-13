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