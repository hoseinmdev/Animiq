const UNITS = ["B", "KB", "MB", "GB"];

export function formatBytes(bytes: number | null): string {
  if (!bytes) return "Unknown size";

  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex > 0 && value < 10 ? 1 : 0)} ${UNITS[unitIndex]}`;
}

export function getQualityLabel(width: number | null, height: number | null): string {
  if (!width || !height) return "Unknown quality";

  const megapixels = (width * height) / 1_000_000;
  if (megapixels >= 3) return "High quality";
  if (megapixels >= 1) return "Standard quality";
  return "Low quality";
}
