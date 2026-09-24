export function formatPlaytime(minutes: number): string {
  if (minutes <= 0) return "0 tim";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} tim`;
  }

  return `${hours} tim ${remainingMinutes} min`;
}

export function formatTotalPlaytime(minutes: number): string {
  if (minutes <= 0) return "0 timmar";

  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days > 0) {
    return `${days} d ${remainingHours} tim`;
  }

  return `${hours} timmar`;
}
