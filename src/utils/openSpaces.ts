// Shared utilities for Open Spaces iCal parsing
// Standalone .ts file to avoid Astro compilation scope issues

// Room mapping: iCal codes → display names
const ROOM_MAP: Record<string, string> = {
  "221+222": "S4(1,2,3)",
  "223+224": "S4(4)",
  "s4(1,2,3)": "S4(1,2,3)",
  "s4(4)": "S4(4)",
  "s4(5)": "S4(5)",
};

export interface OpenSpaceEvent {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  room: string;
  host: string;
  date: string;
  startTime: string;
  endTime: string;
  startISO: string;
  endISO: string;
  slug: string;
}

function stripHtml(s: string): string {
  return s
    .replace(/[<>]/g, "")
    .replace(/https?:\/\/ep[^.]*\.europython\.eu(\/[^\s<!]+)/g, "[$1]($1)")
    .replace(/https?:\/\/[^\s]+/g, "")
    .trim()
    .slice(0, 120);
}

function detectRoom(rawDesc: string): string {
  const plain = rawDesc
    .replace(/[<>]/g, "")
    .replace(/https?:\/\/ep[^.]*\.europython\.eu(\/[^\s<!]+)/g, "[$1]($1)")
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .trim()
    .toLowerCase();
  const roomMatch = plain.match(/room\s+([\d\+]+)/);
  if (roomMatch) return ROOM_MAP[roomMatch[1]] || roomMatch[1];
  for (const [kw, room] of Object.entries(ROOM_MAP)) {
    if (plain.includes(kw)) return room;
  }
  const anyRoomMatch = plain.match(/room\s+(\S+)/);
  if (anyRoomMatch) return anyRoomMatch[1];
  return "Open Space";
}

function extractHost(rawDesc: string): string {
  const plain = rawDesc
    .replace(/[<>]/g, "")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\\n/g, "\n");
  const m = plain.match(/booked\s*by[\s:]*(.+?)(?:\r?\n|\n)/i);
  if (m) return m[1].trim();
  const m2 = plain.match(
    /booked\s*by[\s:]*(.+?)\s+(?:open space title|open space description|room)/i
  );
  if (m2) return m2[1].trim();
  return "";
}

function shortenEuroPythonLinks(text: string): string {
  // Replace https://ep*.europython.eu/path with [/path](/path), but only if path has content
  return text.replace(
    /https?:\/\/ep[^.]*\.europython\.eu(\/[^\s<!]+)/g,
    "[$1]($1)"
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0141\u0142]/g, "l")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function parseDt(
  raw: string
): null | { iso: string; hhmm: string; date: string } {
  const tzMatch = raw.match(/TZID=.*?[ :](\d{8}T\d{6})/);
  if (tzMatch) {
    const dt = tzMatch[1];
    const date = `${dt.slice(0, 4)}-${dt.slice(4, 6)}-${dt.slice(6, 8)}`;
    const hhmm = `${dt.slice(9, 11)}:${dt.slice(11, 13)}`;
    return { iso: `${date}T${hhmm}:00+02:00`, hhmm, date };
  }
  const utcMatch = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (utcMatch) {
    const date = `${utcMatch[1]}-${utcMatch[2]}-${utcMatch[3]}`;
    return {
      iso: `${date}T${utcMatch[4]}:${utcMatch[5]}:00Z`,
      hhmm: `${utcMatch[4]}:${utcMatch[5]}`,
      date,
    };
  }
  const localMatch = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/);
  if (localMatch) {
    const date = `${localMatch[1]}-${localMatch[2]}-${localMatch[3]}`;
    return {
      iso: `${date}T${localMatch[4]}:${localMatch[5]}:00+02:00`,
      hhmm: `${localMatch[4]}:${localMatch[5]}`,
      date,
    };
  }
  const allDay = raw.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (allDay) {
    const date = `${allDay[1]}-${allDay[2]}-${allDay[3]}`;
    return { iso: `${date}T00:00:00+02:00`, hhmm: "00:00", date };
  }
  return null;
}

function parseICal(ics: string): OpenSpaceEvent[] {
  const events: OpenSpaceEvent[] = [];
  const blocks = ics.split(/^BEGIN:VEVENT$/m);
  const slugCounts = new Map<string, number>();

  for (const block of blocks.slice(1)) {
    const endPos = block.indexOf("END:VEVENT");
    if (endPos === -1) continue;
    let vevent = block.slice(0, endPos);
    vevent = vevent.replace(/\r?\n[ \t]/g, "");

    const getVal = (key: string): string => {
      const re = new RegExp(`^${key}(?:;[^:]*)?:(.+)$`, "im");
      const m = vevent.match(re);
      if (!m) return "";
      return m[1]
        .trim()
        .replace(/\\,/g, ",")
        .replace(/\\;/g, ";")
        .replace(/\\n/g, "\n")
        .replace(/\\\\/g, "\\");
    };

    const uid = getVal("UID") || crypto.randomUUID();
    const summary = getVal("SUMMARY");
    const rawDescription = getVal("DESCRIPTION");
    const organizer = getVal("ORGANIZER");
    let dtStartRaw = getVal("DTSTART");
    let dtEndRaw = getVal("DTEND");
    if (!dtStartRaw) continue;

    const startDt = parseDt(dtStartRaw);
    if (!startDt) continue;
    const endDt = parseDt(dtEndRaw) || startDt;

    const detectedRoom = detectRoom(rawDescription);
    const host =
      extractHost(rawDescription) ||
      organizer
        .replace(/^.*?CN=([^;]+).*$/, "$1")
        .replace(/"/g, "")
        .trim() ||
      organizer.match(/mailto:(.+)/i)?.[1] ||
      "";

    // Build full description from "Open Space Description" section
    let fullDescription = "";
    const descMatch = rawDescription.match(
      /open space description\s*:?\s*([\s\S]+?)(?:room\s+\S+|$)/i
    );
    if (descMatch) {
      fullDescription = descMatch[1]
        .replace(/[<>]/g, "")
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/\\n/g, "\n")
        .replace(/room\s+\S+/gi, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      fullDescription = shortenEuroPythonLinks(fullDescription);
      fullDescription = fullDescription
        .replace(/this is the open space registration calendar.*/gi, "")
        .trim();
    }

    const description = stripHtml(rawDescription);
    const title = summary || "Untitled";

    // Generate unique slug
    let slug = slugify(title);
    if (!slug)
      slug = uid
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()
        .slice(0, 40);
    const count = slugCounts.get(slug) || 0;
    if (count > 0) slug = `${slug}-${count}`;
    slugCounts.set(slug.replace(/-\d+$/, ""), count + 1);

    events.push({
      id: uid,
      title,
      description,
      fullDescription: fullDescription || description,
      room: detectedRoom,
      host,
      date: startDt.date,
      startTime: startDt.hhmm,
      endTime: endDt.hhmm,
      startISO: startDt.iso,
      endISO: endDt.iso,
      slug,
    });
  }
  return events;
}

export async function fetchOpenSpacesEvents(): Promise<OpenSpaceEvent[]> {
  const ICAL_URL = import.meta.env.EP_OPENSPACES_ICAL_URL || "";
  if (!ICAL_URL) {
    console.warn("[OpenSpacesCalendar] No EP_OPENSPACES_ICAL_URL set");
    return [];
  }
  try {
    const res = await fetch(ICAL_URL, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.warn(`[OpenSpacesCalendar] iCal fetch returned ${res.status}`);
      return [];
    }
    const text = await res.text();
    if (!text.includes("BEGIN:VCALENDAR")) {
      console.warn("[OpenSpacesCalendar] Response is not valid iCal");
      return [];
    }
    const events = parseICal(text);
    console.log(
      `[OpenSpacesCalendar] Loaded ${events.length} events from iCal`
    );
    return events;
  } catch (err) {
    console.error("[OpenSpacesCalendar] iCal fetch failed:", err);
    return [];
  }
}
