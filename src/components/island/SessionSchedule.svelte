<script>
  /**
   * SessionSchedule — display a day's schedule as a timetable grid.
   *
   * Props:
   *   day  — a single DayCollectionEntry with events, rooms, etc.
   *
   * The component replicates the core logic from day.astro:
   *   - Parses and groups events by time
   *   - Creates a CSS grid with room columns and time rows
   *   - Handles breaks, room changes, and poster sections
   */

  let {
    day = /** @type {Record<string,any>} */ (null),
  } = $props();

  // ── helpers ──
  function parseTime(iso) {
    const d = new Date(iso);
    return isNaN(d.getTime()) ? new Date(`1970-01-01T${iso}Z`) : d;
  }

  function formatHHmm(date) {
    return date.toISOString().slice(11, 16);
  }

  function timeToNum(s) {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  }

  function numToTime(n) {
    const h = Math.floor(n / 60);
    const m = n % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  // ── derived state ──
  let rooms = $derived(
    (day?.data?.rooms ?? [])
      .filter((r) => r.toLowerCase() !== 'exhibit hall')
      .sort((a, b) => {
        const ka = a.match(/\(S(\d+)([A-Z]?)\)/i) || [];
        const kb = b.match(/\(S(\d+)([A-Z]?)\)/i) || [];
        const na = ka[1] ? String(ka[1]).padStart(2, '0') : '99';
        const nb = kb[1] ? String(kb[1]).padStart(2, '0') : '99';
        const sa = ka[2] || '0';
        const sb = kb[2] || '0';
        return `${na}-${sa}-${a}`.localeCompare(`${nb}-${sb}-${b}`);
      })
  );

  let events = $derived(
    (day?.data?.events ?? [])
      .map((ev) => {
        const start = parseTime(ev.start);
        const startTime = formatHHmm(start);
        let dur = ev.duration;
        dur = Math.ceil(dur / 5) * 5;
        const end = new Date(start.getTime() + dur * 60000);
        const endTime = formatHHmm(end);
        return {
          ...ev,
          start,
          startTime,
          end,
          endTime,
          duration: dur,
          sessionType: ev.session_type?.toLowerCase(),
          type: ev.event_type,
        };
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime())
  );

  let posters = $derived(events.filter((e) => e.sessionType === 'poster'));

  let sessionsByTime = $derived.by(() => {
    const map = {};
    for (const ev of events) {
      if (ev.sessionType === 'poster') continue;
      if (!map[ev.startTime]) map[ev.startTime] = [];
      map[ev.startTime].push(ev);
    }
    return map;
  });

  let slots = $derived.by(() => {
    const sorted = Object.entries(sessionsByTime).sort(([a], [b]) =>
      timeToNum(a) - timeToNum(b)
    );
    return sorted.map(([, s]) => {
      let type = 'session';
      if (s.every((e) => e.type === 'break')) type = 'break';
      else if (s.some((e) => e.title?.toLowerCase().includes('lunch')))
        type = 'lunch';
      else if (s.every((e) => e.type === 'room-change')) type = 'room-change';
      return {
        start: s[0].start,
        startTime: s[0].startTime,
        end: s[0].end,
        endTime: s[0].endTime,
        type,
        sessions: s,
      };
    });
  });

  // ── grid rows ──
  let gridRows = $derived.by(() => {
    const rows = [];
    let row = 1;
    for (let i = 0; i < slots.length; i++) {
      const cur = slots[i];
      const nxt = slots[i + 1];
      const ct = timeToNum(cur.startTime);
      const nt = nxt ? timeToNum(nxt.startTime) : timeToNum(cur.endTime);
      let size = Math.max(1, (nt - ct) / 5);
      if (cur.type === 'break') size = Math.max(3, size);
      else if (cur.type === 'room-change') size = 1;
      const rowSize =
        cur.type === 'break' ? 'var(--break)' : 'fit-content(100px)';
      rows.push(`repeat(${Math.ceil(size)}, ${rowSize})`);
      row += Math.ceil(size);
    }
    return rows;
  });

  let timeToRow = $derived.by(() => {
    const map = {};
    let row = 1;
    for (let i = 0; i < slots.length; i++) {
      const cur = slots[i];
      const nxt = slots[i + 1];
      const ct = timeToNum(cur.startTime);
      const nt = nxt ? timeToNum(nxt.startTime) : timeToNum(cur.endTime);
      let size = Math.max(1, (nt - ct) / 5);
      if (cur.type === 'break') size = Math.max(3, size);
      else if (cur.type === 'room-change') size = 1;
      for (let j = 0; j < Math.ceil(size); j++) {
        map[numToTime(ct + j * 5)] = row + j;
      }
      row += Math.ceil(size);
    }
    const lastEv = events[events.length - 1];
    if (lastEv) {
      const lastEnd = timeToNum(lastEv.endTime);
      for (let t = lastEnd; t <= lastEnd + 5; t += 5) {
        const key = numToTime(t);
        if (!map[key]) map[key] = row++;
      }
    }
    return map;
  });

  function spansAllRooms(evRooms) {
    return rooms.every((r) => evRooms.includes(r));
  }

  function getColStart(ev) {
    if (ev.type === 'room-change') return 2;
    if (ev.type === 'break' && spansAllRooms(ev.rooms)) return 2;
    const idxs = ev.rooms
      .map((r) => rooms.indexOf(r))
      .filter((i) => i >= 0);
    return idxs.length ? Math.min(...idxs) + 2 : 1;
  }

  function getColEnd(ev) {
    if (ev.type === 'room-change' || (ev.type === 'break' && spansAllRooms(ev.rooms)))
      return -1;
    const idxs = ev.rooms
      .map((r) => rooms.indexOf(r))
      .filter((i) => i >= 0);
    return idxs.length ? Math.max(...idxs) + 3 : -1;
  }

  function getStyle(ev) {
    const sr = timeToRow[ev.startTime];
    const er = ev.type === 'room-change' ? sr + 1 : timeToRow[ev.endTime];
    return {
      '--start': sr,
      '--end': er || sr + 1,
      '--col-start': getColStart(ev),
      '--col-end': getColEnd(ev),
    };
  }

  function sortByRoom(a, b) {
    return rooms.indexOf(a.rooms[0]) - rooms.indexOf(b.rooms[0]);
  }

  let dateText = $derived.by(() => {
    if (!day?.id) return '';
    const d = parseTime(day.id + 'T12:00:00Z');
    const opts = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Warsaw' };
    return d.toLocaleDateString('en-GB', opts);
  });

  let lastEndTime = $derived.by(() => {
    if (!slots.length) return '00:00';
    const ends = slots.flatMap((s) => s.sessions.map((e) => timeToNum(e.endTime)));
    return numToTime(Math.max(...ends));
  });

  let hasMobile = $state(false);

  $effect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(max-width: 799px)');
      hasMobile = mq.matches;
      mq.addEventListener('change', (e) => (hasMobile = e.matches));
      return () => mq.removeEventListener('change', () => {});
    }
  });
</script>

{#if !day}
  <p class="session-empty">No schedule data available.</p>
{:else}
  <div class="sched-day">
    <h3 class="sched-day-title" id="sched-day-{day.id}">
      <a href="#sched-day-{day.id}">{dateText}</a>
    </h3>

    <div class="sched-wrapper">
      {#if !hasMobile}
        <!-- header row: room names -->
        <div class="sched-header">
          <div
            class="sched-grid"
            style="grid-template-columns: 80px repeat({rooms.length}, minmax(100px, 1fr))"
          >
            <div>Time</div>
            {#each rooms as room}
              <div class="sched-room-header">{room}</div>
            {/each}
          </div>
        </div>
      {/if}

      <div class="sched-body">
        <div
          class="sched-grid"
          style="grid-template-rows: {gridRows.join(' ')}; grid-template-columns: 80px repeat({rooms.length}, minmax(100px, 1fr))"
        >
          {#each slots as slot}
            <div class="sched-slot">
              {#if slot.type !== 'room-change'}
                <div
                  class="sched-time"
                  style="--start: {timeToRow[slot.startTime]}; --end: {timeToRow[slot.endTime]}"
                >
                  <h4>{formatHHmm(slot.start)}</h4>
                </div>
              {/if}

              {#each (sessionsByTime[slot.startTime] ?? []).sort(sortByRoom) as ev}
                {#if ev.type === 'room-change'}
                  <div
                    class="sched-break room-change"
                    style="--start: {timeToRow[ev.startTime]}; --end: {timeToRow[ev.startTime] + 1}; --col-start: {getColStart(ev)}; --col-end: {getColEnd(ev)}"
                  >
                    {ev.title}
                  </div>
                {:else if ev.type === 'break'}
                  <div
                    class="sched-break"
                    style="--start: {timeToRow[ev.startTime]}; --end: {timeToRow[ev.endTime]}; --col-start: {getColStart(ev)}; --col-end: {getColEnd(ev)}"
                  >
                    {ev.title}
                  </div>
                {:else}
                  <div
                    class="sched-session ep-session"
                    style="--start: {timeToRow[ev.startTime]}; --end: {timeToRow[ev.endTime]}; --col-start: {getColStart(ev)}; --col-end: {getColEnd(ev)}"
                  >
                    <div class="sched-session-body">
                      <a
                        href={ev.slug ? `/session/${ev.slug}` : '#'}
                        class="sched-session-title"
                      >
                        {ev.title}
                      </a>
                      {#if ev.speakers?.length}
                        <div class="sched-session-speakers">
                          {#each ev.speakers as speaker, i}
                            <a href="/speaker/{speaker.code}" class="speaker-link">{speaker.name}</a>{i < ev.speakers.length - 1 ? ', ' : ''}
                          {/each}
                        </div>
                      {/if}
                    </div>
                    <div class="sched-session-meta">
                      {#if ev.rooms.length === 1}
                        <span class="sched-session-room">{ev.rooms[0]}</span>
                      {/if}
                      {#if ev.duration}
                        <span class="sched-session-duration">{ev.duration}min</span>
                      {/if}
                    </div>
                    <div class="sched-session-badges">
                      {#if ev.level}
                        <span
                          class="sched-level-badge"
                          class:beginner={ev.level === 'beginner'}
                          class:intermediate={ev.level === 'intermediate'}
                          class:advanced={ev.level === 'advanced'}
                        >
                          {ev.level.charAt(0).toUpperCase() + ev.level.slice(1)}
                        </span>
                      {/if}
                    </div>
                  </div>
                {/if}
              {/each}

              <!-- posters -->
              {#if posters.length && posters[0].startTime === slot.startTime}
                <div
                  class="sched-posters"
                  style="--start: {timeToRow[posters[0].startTime]}; --end: {timeToRow[posters[0].endTime]}; --col-start: {getColStart(posters[0])}; --col-end: {getColEnd(posters[0])}"
                >
                  <h5 class="sched-posters-title">
                    Posters ({posters[0].rooms.join(', ')})
                  </h5>
                  <div class="sched-posters-list">
                    {#each posters as pst}
                      <div class="sched-session ep-session poster">
                        <a href={pst.slug ? `/session/${pst.slug}` : '#'} class="sched-session-title">
                          {pst.title}
                        </a>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>

        <div class="sched-day-end">
          End of the Day — {lastEndTime}
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .sched-day {
    margin-block: 2rem 3rem;
  }

  .sched-day:first-child {
    margin-top: 0;
  }

  .sched-day-title {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 0.75rem;
    color: var(--color-text, var(--ep-white));
  }

  .sched-day-title a {
    color: inherit;
    text-decoration: none;
  }

  .sched-day-title a:hover {
    text-decoration: underline;
  }

  .sched-wrapper {
    width: 100%;
  }

  /* ── header (desktop only) ── */
  .sched-header {
    display: none;
    position: sticky;
    top: 0;
    background: var(--ep-sched-chrome-bg, var(--color-surface-medium));
    z-index: 20;
    padding-bottom: 4px;
  }

  .sched-header .sched-room-header {
    padding: 0.5rem 0.3rem;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--ep-text-primary, var(--color-text));
    background: var(--ep-sched-room-bg, var(--color-surface-subtle));
    border-radius: 4px;
    text-align: center;
  }

  .sched-header .sched-grid > div:first-child {
    background: transparent;
    color: var(--color-text-muted);
  }

  /* ── grid ── */
  .sched-grid * {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 0.9rem;
  }

  .sched-grid {
    --break: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0;
  }

  .sched-slot {
    display: contents;
  }

  .sched-body .sched-grid {
    margin-top: 0.75rem;
  }

  /* ── time labels ── */
  .sched-time {
    background: transparent;
    border: 1px solid var(--ep-border, var(--color-border));
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    margin: 2px 0;
    text-align: center;
  }

  .sched-time h4 {
    margin: 0;
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--ep-text-secondary, var(--color-text-muted));
  }

  /* ── session cards ── */
  .sched-session {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    padding: 0.5rem 0.6rem;
    background: var(--ep-surface-subtle, var(--color-surface-subtle));
    border: 1px solid var(--ep-border, var(--color-border));
    border-radius: 6px;
    color: var(--ep-white, var(--color-text));
    font-family: 'Inter Tight', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, background 0.2s;
  }

  .sched-session:hover {
    border-color: var(--ep-accent);
    background: var(--ep-session-hover-bg) !important;
    z-index: 10;
  }

  .sched-session-body {
    flex: 1;
  }

  .sched-session-title {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-size: 1.1rem;
    font-weight: 400;
    line-height: 1.3;
    color: var(--ep-white, var(--color-text));
    text-decoration: none;
    margin: 0;
    padding: 0;
  }

  .sched-session-title:hover {
    text-decoration: underline;
  }

  .sched-session-speakers {
    font-size: 0.85rem;
    color: var(--ep-text-secondary, var(--color-text-secondary));
    line-height: 1.3;
  }

  .sched-session-speakers :global(.speaker-link) {
    color: var(--ep-text-secondary, var(--color-text-secondary));
    text-decoration: none;
  }

  .sched-session-speakers :global(.speaker-link:hover) {
    text-decoration: underline;
  }

  .sched-session-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    color: var(--ep-text-muted, var(--color-text-muted));
    font-weight: 500;
    line-height: 1.4;
    margin-top: auto;
  }

  .sched-session-duration::before {
    content: '·';
    margin-right: 0.3rem;
    opacity: 0.5;
  }

  .sched-session-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3em;
    margin-top: 0.15em;
  }

  .sched-level-badge {
    display: inline-block;
    padding: 0.1em 0.5em;
    border-radius: 3px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .sched-level-badge.beginner {
    background: var(--ep-level-beginner-bg);
    color: var(--ep-level-beginner-text);
  }

  .sched-level-badge.intermediate {
    background: var(--ep-level-intermediate-bg);
    color: var(--ep-level-intermediate-text);
  }

  .sched-level-badge.advanced {
    background: var(--ep-level-advanced-bg);
    color: var(--ep-level-advanced-text);
  }

  /* ── breaks ── */
  .sched-break {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    line-height: 1.2;
    min-height: 0;
    overflow: hidden;
    border: 1px solid var(--color-surface-medium);
    border-radius: 4px;
    background: var(--ep-sched-chrome-bg, var(--color-surface-medium));
    color: var(--ep-sched-chrome-text, var(--color-text-muted));
    font-size: 0.9rem;
    padding: 0 8px;
    text-align: center;
  }

  .sched-break.room-change {
    font-weight: 400;
    white-space: nowrap;
    font-size: 0.8rem;
  }

  /* ── posters ── */
  .sched-posters {
    display: none;
    border: 2px solid var(--color-accent-themed);
    border-radius: 6px;
    background: var(--ep-sched-chrome-bg, var(--color-surface-medium));
    position: relative;
  }

  .sched-posters-title {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-weight: 700;
    font-size: 0.8rem;
    color: var(--color-accent-themed);
    padding: 0.4rem 0.5rem;
    margin: 0;
  }

  .sched-posters-list {
    display: flex;
  }

  .sched-posters-list > * {
    flex: 1;
  }

  /* ── day end marker ── */
  .sched-day-end {
    display: none;
    align-items: center;
    text-align: center;
    justify-content: center;
    background: var(--ep-day-end-bg, var(--color-surface-subtle));
    border: 1px solid var(--color-surface-medium);
    border-radius: 4px;
    margin: 0.5rem 0;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: var(--ep-day-end-text, var(--color-text-muted));
  }

  /* ── large screens: scale up like schedule page ── */
  @media (min-width: 1281px) {
    .sched-grid * {
      font-size: 1.1rem;
    }

    .sched-grid h4,
    .sched-grid .sched-break {
      font-size: 1.3rem;
    }
  }

  /* ── desktop ≥800px ── */
  @media (min-width: 800px) {
    .sched-header {
      display: inherit;
    }

    .sched-wrapper .sched-grid {
      display: grid;
    }

    .sched-time,
    .sched-break,
    .sched-session,
    .sched-posters {
      grid-row: var(--start) / var(--end);
      grid-column: var(--col-start) / var(--col-end);
      display: block;
    }

    .sched-time {
      grid-column: 1 / 2;
      text-align: right;
      border: none;
      padding: 0.4rem 0.5rem;
    }

    .sched-time h4 {
      text-align: right;
    }

    .sched-posters {
      display: block;
    }

    .sched-session.poster {
      display: flex;
      height: 100%;
    }

    .sched-day-end {
      display: flex;
    }
  }

  .session-empty {
    text-align: center;
    color: var(--color-text-muted, var(--ep-text-muted));
    font-size: 1rem;
    padding: 3rem;
    border: 1px dashed var(--color-border-bright);
    border-radius: 6px;
  }
</style>
