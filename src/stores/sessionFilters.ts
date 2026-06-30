/**
 * sessionFilters — persistent filter state for session views.
 *
 * Uses persistentMap from @nanostores/persistent (same pattern as
 * favorites.js) so filter selections survive page reloads.
 *
 * Each filter dimension is stored as a JSON-encoded value under the
 * `ep-filter:` localStorage prefix.
 */

import { persistentMap } from "@nanostores/persistent";

// ── Filter option lists ──

export const SESSION_TYPES: string[] = [
  "Keynote",
  "Talk",
  "Tutorial",
  "Poster",
  "Lightning Talk",
  "Open Space",
];

export const LEVELS: string[] = ["beginner", "intermediate", "advanced"];

export const TRACKS: string[] = [
  "Python Core, Internals, Extensions",
  "Machine Learning: Research & Applications",
  "Data Engineering and MLOps",
  "Jupyter and Scientific Python",
  "Data preparation and visualisation",
  "Machine Learning, NLP and CV",
  "Web Development, Web APIs, Front-End Integration",
  "DevOps, Cloud, Scalable Infrastructure",
  "Tooling, Packaging, Developer Productivity",
  "Testing, Quality Assurance, Security",
  "Community Building, Education, Outreach",
  "Professional Development, Careers, Leadership",
  "Ethics, Social Responsibility, Sustainability, Legal",
  "IoT, Embedded Systems, Hardware Integration",
  "Python for Games, Art, Play and Expression",
  "General",
];

/** Tracks that match the "Data & AI" quick filter. */
export const DATA_AI_TRACKS: string[] = [
  "Machine Learning: Research & Applications",
  "Data Engineering and MLOps",
  "Jupyter and Scientific Python",
  "Data preparation and visualisation",
  "Machine Learning, NLP and CV",
];

export const DURATIONS = [
  { label: "≤30 min", value: "short", test: (d: number) => d <= 30 },
  { label: "31–60 min", value: "medium", test: (d: number) => d > 30 && d <= 60 },
  { label: "60+ min", value: "long", test: (d: number) => d > 60 },
];

// ── Store ──

export interface FilterState {
  search: string;
  types: string[];       // session type names
  levels: string[];      // "beginner" | "intermediate" | "advanced"
  tracks: string[];      // full track names
  days: string[];        // "2026-07-13" etc.
  rooms: string[];
  durations: string[];   // "short" | "medium" | "long"
  favoritesOnly: boolean;
  dataAi: boolean;       // Data & AI quick toggle
}

const defaults: FilterState = {
  search: "",
  types: [],
  levels: [],
  tracks: [],
  days: [],
  rooms: [],
  durations: [],
  favoritesOnly: false,
  dataAi: false,
};

export const filterStore = persistentMap<Record<string, string>>(
  "ep-filter:",
  {},
  { encode: JSON.stringify, decode: JSON.parse }
);

// ── Helpers ──

function readValue<T>(key: string, fallback: T): T {
  const raw = filterStore.get()[key];
  if (raw === undefined || raw === null || raw === "") return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeValue(key: string, value: unknown) {
  const v = JSON.stringify(value);
  if (v === JSON.stringify(defaults[key as keyof FilterState])) {
    filterStore.setKey(key, "");
  } else {
    filterStore.setKey(key, v);
  }
}

/** Read all filter values as a typed object. */
export function getFilters(): FilterState {
  const f: FilterState = { ...defaults };
  for (const k of Object.keys(defaults)) {
    (f as any)[k] = readValue(k, (defaults as any)[k]);
  }
  // dataAi is a quick toggle — when ON, inject DATA_AI_TRACKS
  if (f.dataAi) {
    f.tracks = [...new Set([...f.tracks, ...DATA_AI_TRACKS])];
  }
  return f;
}

/** Write a single filter value. Empties from store if it matches the default. */
export function setFilter<K extends keyof FilterState>(key: K, value: FilterState[K]) {
  writeValue(key, value);
}

/** Reset all filters to defaults (clears the localStorage keys). */
export function clearFilters() {
  for (const k of Object.keys(defaults)) {
    filterStore.setKey(k, "");
  }
}

/**
 * Filter sessions array by current filter state.
 *
 * @param sessions — sessions collection entries
 * @param speakerMap — { id → name } for search matching
 * @param favorites — favorites map from the favorites store
 * @param filters — current filter state (optional, reads store if omitted)
 * @returns filtered sessions array
 */
export function filterSessions(
  sessions: any[],
  speakerMap: Record<string, string>,
  favorites: Record<string, any>,
  filters?: FilterState,
): any[] {
  const f = filters ?? getFilters();
  const q = f.search.toLowerCase().trim();

  return sessions.filter((s: any) => {
    const d = s.data || s;

    // ── search ──
    if (q) {
      const title = (d.title ?? "").toLowerCase();
      const speakerNames = (d.speakers ?? [])
        .map((sid: any) => {
          const id = typeof sid === "string" ? sid : sid.id;
          return (speakerMap[id] ?? "").toLowerCase();
        })
        .join(" ");
      if (!title.includes(q) && !speakerNames.includes(q)) return false;
    }

    // ── session type ──
    if (f.types.length > 0) {
      const st = (d.session_type ?? "").toLowerCase();
      const match = f.types.some((t) => {
        const tt = t.toLowerCase();
        if (tt === "talk") return st === "talk" || st === "talk (long session)" || st === "panel";
        return st === tt || st === tt.toLowerCase();
      });
      if (!match) return false;
    }

    // ── level ──
    if (f.levels.length > 0) {
      if (!f.levels.includes(d.level ?? "")) return false;
    }

    // ── track ──
    if (f.tracks.length > 0) {
      if (!f.tracks.includes(d.track ?? "")) return false;
    }

    // ── duration ──
    if (f.durations.length > 0) {
      const dur = parseInt(d.duration ?? "0", 10);
      if (isNaN(dur)) return false;
      const ok = f.durations.some((dv) => {
        const def = DURATIONS.find((dd) => dd.value === dv);
        return def ? def.test(dur) : false;
      });
      if (!ok) return false;
    }

    // ── room ──
    if (f.rooms.length > 0) {
      if (!f.rooms.includes(d.room ?? "")) return false;
    }

    // ── favorites ──
    if (f.favoritesOnly) {
      if (!favorites[d.code]) return false;
    }

    return true;
  });
}

/**
 * Filter schedule events (from days collection) by current filter state.
 * Matches by session_type, level, track against events.
 */
export function filterDayEvents(
  events: any[],
  filters?: FilterState,
): any[] {
  const f = filters ?? getFilters();

  return events.filter((ev: any) => {
    // ── session type ──
    if (f.types.length > 0) {
      const st = (ev.session_type ?? ev.event_type ?? "").toLowerCase();
      const match = f.types.some((t) => {
        const tt = t.toLowerCase();
        if (tt === "talk") return st === "talk" || st === "talk (long session)" || st === "panel";
        return st === tt;
      });
      if (!match) return false;
    }

    // ── level ──
    if (f.levels.length > 0) {
      if (!f.levels.includes(ev.level ?? "")) return false;
    }

    // ── track ──
    if (f.tracks.length > 0) {
      if (!f.tracks.includes(ev.track ?? "")) return false;
    }

    return true;
  });
}
