export type ParsedSteamInput =
  | { type: "steamid"; value: string }
  | { type: "vanity"; value: string };

export function parseSteamInput(input: string): ParsedSteamInput | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^\d{17}$/.test(trimmed)) {
    return { type: "steamid", value: trimmed };
  }

  const profileMatch = trimmed.match(/steamcommunity\.com\/profiles\/(\d{17})/i);
  if (profileMatch) {
    return { type: "steamid", value: profileMatch[1] };
  }

  const vanityMatch = trimmed.match(/steamcommunity\.com\/id\/([^/?#]+)/i);
  if (vanityMatch) {
    return { type: "vanity", value: vanityMatch[1] };
  }

  if (/^[a-zA-Z0-9_-]{2,32}$/.test(trimmed)) {
    return { type: "vanity", value: trimmed };
  }

  return null;
}
