export const TEAM_COLORS: Record<string, string> = {
  red_bull: "#3671C6",
  ferrari: "#E8002D",
  mercedes: "#27F4D2",
  mclaren: "#FF8000",
  aston_martin: "#229971",
  alpine: "#FF87BC",
  williams: "#64C4FF",
  haas: "#B6BABD",
  sauber: "#52E252",
  rb: "#6692FF",
  visa_cash_app_rb: "#6692FF",
  alphatauri: "#469BFF",
  // Legacy
  renault: "#FFF500",
  force_india: "#F596C8",
  racing_point: "#F596C8",
  toro_rosso: "#469BFF",
  brawn: "#80FF00",
  bmw_sauber: "#0067FF",
  lotus_f1: "#FFB800",
  manor: "#FF2A2A",
  caterham: "#006C3E",
};

export const COMPOUND_COLORS: Record<string, string> = {
  SOFT: "#FF3333",
  MEDIUM: "#FFF200",
  HARD: "#EEEEEE",
  INTERMEDIATE: "#39B54A",
  WET: "#0067FF",
  UNKNOWN: "#888888",
  TEST_UNKNOWN: "#888888",
};

export const COMPOUND_TEXT: Record<string, string> = {
  SOFT: "S",
  MEDIUM: "M",
  HARD: "H",
  INTERMEDIATE: "I",
  WET: "W",
  UNKNOWN: "?",
};

export function getTeamColor(constructorId: string): string {
  return TEAM_COLORS[constructorId?.toLowerCase()] ?? "#999999";
}

export function getCompoundColor(compound: string): string {
  return COMPOUND_COLORS[compound?.toUpperCase()] ?? "#888888";
}

export function getCompoundLabel(compound: string): string {
  return COMPOUND_TEXT[compound?.toUpperCase()] ?? "?";
}

export const COUNTRY_FLAGS: Record<string, string> = {
  Australian: "🇦🇺", Austrian: "🇦🇹", Azerbaijan: "🇦🇿", Bahrain: "🇧🇭",
  Belgian: "🇧🇪", Brazilian: "🇧🇷", British: "🇬🇧", Canadian: "🇨🇦",
  Chinese: "🇨🇳", Dutch: "🇳🇱", Emirati: "🇦🇪", French: "🇫🇷",
  German: "🇩🇪", Hungarian: "🇭🇺", Italian: "🇮🇹", Japanese: "🇯🇵",
  Mexican: "🇲🇽", Monegasque: "🇲🇨", Saudi: "🇸🇦", Spanish: "🇪🇸",
  Swiss: "🇨🇭", American: "🇺🇸", Finnish: "🇫🇮", Polish: "🇵🇱",
  Thai: "🇹🇭", Danish: "🇩🇰", New_Zealander: "🇳🇿", Argentine: "🇦🇷",
  South_African: "🇿🇦", Canadian: "🇨🇦", Singaporean: "🇸🇬",
};

export const CIRCUIT_COUNTRIES: Record<string, string> = {
  Australian: "🇦🇺", Bahrain: "🇧🇭", Saudi: "🇸🇦", Japanese: "🇯🇵",
  Chinese: "🇨🇳", Miami: "🇺🇸", Monaco: "🇲🇨", Canadian: "🇨🇦",
  Spanish: "🇪🇸", Austrian: "🇦🇹", British: "🇬🇧", Hungarian: "🇭🇺",
  Belgian: "🇧🇪", Dutch: "🇳🇱", Italian: "🇮🇹", Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬", American: "🇺🇸", Mexican: "🇲🇽", Brazilian: "🇧🇷",
  "Las Vegas": "🇺🇸", Abu_Dhabi: "🇦🇪",
};

export function getFlag(nationality: string): string {
  return COUNTRY_FLAGS[nationality] ?? "🏁";
}
