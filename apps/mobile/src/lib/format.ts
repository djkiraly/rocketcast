/**
 * Formats a team label for compact UI (score bugs, pickers).
 * Returns "Name (ABBR)" when an abbreviation is present, otherwise just the trimmed name.
 * Abbreviations are upper-cased; whitespace is trimmed on both inputs.
 */
export function formatTeamLabel(name: string, abbreviation?: string): string {
  const trimmedName = name.trim();
  const abbr = abbreviation?.trim().toUpperCase() ?? "";
  if (abbr.length === 0) return trimmedName;
  return `${trimmedName} (${abbr})`;
}
