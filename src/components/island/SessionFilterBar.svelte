<script>
  /**
   * SessionFilterBar — multi-select filter controls for session views.
   *
   * Props:
   *   allDays    — array of day IDs ("2026-07-13") extracted from days collection
   *   allRooms   — array of room names from the data
   *
   * Reads/writes filter state via the sessionFilters store.
   */
  import {
    filterStore,
    getFilters,
    setFilter,
    clearFilters,
    SESSION_TYPES,
    LEVELS,
    TRACKS,
    DATA_AI_TRACKS,
    DURATIONS,
  } from '../../stores/sessionFilters';

  let {
    allDays = /** @type {string[]} */ ([]),
    allRooms = /** @type {string[]} */ ([]),
  } = $props();

  // ── local reactive state synced to store ──
  let filters = $state(getFilters());
  let expanded = $state(false);
  let searchTimeout = $state(0);

  // Re-sync when store changes — guard against infinite loops
  $effect(() => {
    const unsub = filterStore.subscribe(() => {
      const next = getFilters();
      if (JSON.stringify(next) !== JSON.stringify(filters)) {
        filters = next;
      }
    });
    return unsub;
  });

  function toggleType(t) {
    const arr = [...filters.types];
    const idx = arr.indexOf(t);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(t);
    setFilter('types', arr);
  }

  function toggleLevel(l) {
    const arr = [...filters.levels];
    const idx = arr.indexOf(l);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(l);
    setFilter('levels', arr);
  }

  function toggleTrack(t) {
    // If Data & AI is on and toggling a DATA_AI_TRACK, turn Data & AI off first
    const arr = [...filters.tracks];
    const idx = arr.indexOf(t);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(t);
    // Turn off dataAi if user manually toggles a data-ai track
    if (filters.dataAi && DATA_AI_TRACKS.includes(t)) {
      setFilter('dataAi', false);
    }
    setFilter('tracks', arr);
  }

  function toggleDay(d) {
    const arr = [...filters.days];
    const idx = arr.indexOf(d);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(d);
    setFilter('days', arr);
  }

  function toggleRoom(r) {
    const arr = [...filters.rooms];
    const idx = arr.indexOf(r);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(r);
    setFilter('rooms', arr);
  }

  function toggleDuration(v) {
    const arr = [...filters.durations];
    const idx = arr.indexOf(v);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(v);
    setFilter('durations', arr);
  }

  function toggleFavorites() {
    setFilter('favoritesOnly', !filters.favoritesOnly);
  }

  function toggleDataAi() {
    const next = !filters.dataAi;
    setFilter('dataAi', next);
    // When turning ON, clear individual data-ai tracks to avoid double-count
    if (next) {
      const remaining = filters.tracks.filter((t) => !DATA_AI_TRACKS.includes(t));
      setFilter('tracks', remaining);
    }
  }

  function onSearchInput(e) {
    const val = e.target.value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setFilter('search', val);
    }, 200);
  }

  function handleClear() {
    clearFilters();
  }

  function formatDayName(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T12:00:00Z');
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  }

  let activeCount = $derived(
    (filters.search ? 1 : 0) +
    filters.types.length +
    filters.levels.length +
    filters.tracks.length +
    filters.days.length +
    filters.rooms.length +
    filters.durations.length +
    (filters.favoritesOnly ? 1 : 0) +
    (filters.dataAi ? 1 : 0)
  );
</script>

<div class="filter-bar">
  <div class="filter-bar-top">
    <!-- search -->
    <div class="filter-search-wrap">
      <i class="fa-solid fa-magnifying-glass filter-search-icon"></i>
      <input
        type="text"
        class="filter-search"
        placeholder="Search sessions..."
        value={filters.search}
        oninput={onSearchInput}
      />
      {#if filters.search}
        <button class="filter-search-clear" onclick={() => setFilter('search', '')} aria-label="Clear search">
          <i class="fa-solid fa-xmark"></i>
        </button>
      {/if}
    </div>

    <!-- active filters summary + clear -->
    <div class="filter-actions">
      {#if activeCount > 0}
        <span class="filter-count">{activeCount} filter{activeCount !== 1 ? 's' : ''} active</span>
        <button class="filter-clear-btn" onclick={handleClear}>
          <i class="fa-solid fa-rotate-left"></i> Clear all
        </button>
      {/if}
      <button class="filter-expand-btn" onclick={() => (expanded = !expanded)}>
        <i class="fa-solid fa-sliders"></i>
        <span>Filters</span>
        <i class="fa-solid fa-chevron-down" class:rotated={expanded}></i>
      </button>
    </div>
  </div>

  {#if expanded}
    <div class="filter-groups">
      <!-- session type -->
      <div class="filter-group">
        <span class="filter-group-label">Type</span>
        <div class="filter-chips">
          {#each SESSION_TYPES as t}
            <button
              class="filter-chip"
              class:active={filters.types.includes(t)}
              onclick={() => toggleType(t)}
            >{t}</button>
          {/each}
        </div>
      </div>

      <!-- level -->
      <div class="filter-group">
        <span class="filter-group-label">Level</span>
        <div class="filter-chips">
          {#each LEVELS as l}
            <button
              class="filter-chip"
              class:active={filters.levels.includes(l)}
              onclick={() => toggleLevel(l)}
            >{l.charAt(0).toUpperCase() + l.slice(1)}</button>
          {/each}
        </div>
      </div>

      <!-- track -->
      <div class="filter-group">
        <span class="filter-group-label">Track</span>
        <div class="filter-chips">
          <button
            class="filter-chip filter-chip-brand"
            class:active={filters.dataAi}
            onclick={toggleDataAi}
          >Data &amp; AI</button>
          {#each TRACKS as tr}
            <button
              class="filter-chip"
              class:active={filters.tracks.includes(tr) && !(filters.dataAi && DATA_AI_TRACKS.includes(tr))}
              class:hidden={filters.dataAi && DATA_AI_TRACKS.includes(tr)}
              onclick={() => toggleTrack(tr)}
            >{tr}</button>
          {/each}
        </div>
      </div>

      <!-- day -->
      {#if allDays.length > 0}
        <div class="filter-group">
          <span class="filter-group-label">Day</span>
          <div class="filter-chips">
            {#each allDays as d}
              <button
                class="filter-chip"
                class:active={filters.days.includes(d)}
                onclick={() => toggleDay(d)}
              >{formatDayName(d)}</button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- room -->
      {#if allRooms.length > 0}
        <div class="filter-group">
          <span class="filter-group-label">Room</span>
          <div class="filter-chips">
            {#each allRooms as r}
              <button
                class="filter-chip"
                class:active={filters.rooms.includes(r)}
                onclick={() => toggleRoom(r)}
              >{r}</button>
            {/each}
          </div>
        </div>
      {/if}

      <!-- duration -->
      <div class="filter-group">
        <span class="filter-group-label">Duration</span>
        <div class="filter-chips">
          {#each DURATIONS as d}
            <button
              class="filter-chip"
              class:active={filters.durations.includes(d.value)}
              onclick={() => toggleDuration(d.value)}
            >{d.label}</button>
          {/each}
        </div>
      </div>

      <!-- favorites -->
      <div class="filter-group">
        <span class="filter-group-label">Other</span>
        <div class="filter-chips">
          <button
            class="filter-chip"
            class:active={filters.favoritesOnly}
            onclick={toggleFavorites}
          ><i class="fa-solid fa-heart"></i> Favorites only</button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .filter-bar {
    font-family: 'Inter Tight', system-ui, sans-serif;
    margin-bottom: 1rem;
  }

  /* ── top row ── */
  .filter-bar-top {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .filter-search-wrap {
    position: relative;
    flex: 1;
    min-width: 180px;
  }

  .filter-search-icon {
    position: absolute;
    left: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-muted, var(--ep-text-muted));
    font-size: 0.8rem;
    pointer-events: none;
  }

  .filter-search {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 1.8rem;
    font-family: inherit;
    font-size: 0.9rem;
    color: var(--color-text, var(--ep-white));
    background: var(--color-surface-subtle, var(--ep-surface-subtle));
    border: 1px solid var(--color-border, var(--ep-border));
    border-radius: 6px;
    outline: none;
    transition: border-color 0.15s;
  }

  .filter-search:focus {
    border-color: var(--color-accent-themed, var(--ep-accent));
  }

  .filter-search::placeholder {
    color: var(--color-text-faint, var(--ep-text-muted));
  }

  .filter-search-clear {
    position: absolute;
    right: 0.4rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--color-text-muted, var(--ep-text-muted));
    cursor: pointer;
    padding: 0.2rem;
    font-size: 0.8rem;
  }

  .filter-search-clear:hover {
    color: var(--color-text, var(--ep-white));
  }

  .filter-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .filter-count {
    font-size: 0.8rem;
    color: var(--color-accent-themed, var(--ep-accent));
    font-weight: 600;
    white-space: nowrap;
  }

  .filter-clear-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.4rem 0.7rem;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-muted, var(--ep-text-muted));
    background: transparent;
    border: 1px solid var(--color-border, var(--ep-border));
    border-radius: 6px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }

  .filter-clear-btn:hover {
    color: var(--color-text, var(--ep-white));
    border-color: var(--color-accent-themed, var(--ep-accent));
  }

  .filter-expand-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-muted, var(--ep-text-muted));
    background: var(--color-surface-subtle, var(--ep-surface-subtle));
    border: 1px solid var(--color-border, var(--ep-border));
    border-radius: 6px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  .filter-expand-btn:hover {
    color: var(--color-text, var(--ep-white));
    border-color: var(--color-accent-themed, var(--ep-accent));
  }

  .filter-expand-btn .fa-chevron-down {
    transition: transform 0.2s;
    font-size: 0.7rem;
  }

  .filter-expand-btn .fa-chevron-down.rotated {
    transform: rotate(180deg);
  }

  /* ── filter groups ── */
  .filter-groups {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--color-surface-subtle, var(--ep-surface-subtle));
    border: 1px solid var(--color-border, var(--ep-border));
    border-radius: 6px;
  }

  .filter-group {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4rem;
  }

  .filter-group-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-muted, var(--ep-text-muted));
    min-width: 3.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .filter-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .filter-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25em 0.65em;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-muted, var(--ep-text-muted));
    background: var(--color-surface-medium);
    border: 1px solid var(--color-border, var(--ep-border));
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.12s ease;
    white-space: nowrap;
  }

  .filter-chip:hover {
    color: var(--color-text, var(--ep-white));
    border-color: var(--color-accent-themed, var(--ep-accent));
  }

  .filter-chip.active {
    color: var(--color-on-accent, var(--ep-white));
    background: var(--color-accent-themed, var(--ep-accent));
    border-color: var(--color-accent-themed, var(--ep-accent));
  }

  .filter-chip-brand {
    border-color: var(--color-accent-themed, var(--ep-accent));
    color: var(--color-accent-themed, var(--ep-accent));
  }

  .filter-chip-brand.active {
    background: var(--color-accent-themed, var(--ep-accent));
    color: var(--color-on-accent, var(--ep-white));
  }

  .filter-chip.hidden {
    display: none;
  }

  @media (max-width: 640px) {
    .filter-group-label {
      min-width: 100%;
    }
  }
</style>
