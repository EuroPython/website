<script>
  /**
   * SessionView — parent component that switches between Schedule, List, and Grid views.
   *
   * Props:
   *   sessions   — array of SessionCollectionEntry objects (for list/grid views)
   *   days       — array of DayCollectionEntry objects (for schedule view)
   *   speakerMap — optional { [speakerId]: name } for resolving speaker names
   *   initialView — initial view mode: 'schedule' | 'list' | 'grid' (default: 'schedule')
   *   allDays    — array of day IDs for the filter bar
   *   allRooms   — array of room names for the filter bar
   */

  import SessionSchedule from './SessionSchedule.svelte';
  import SessionList from './SessionList.svelte';
  import SessionGrid from './SessionGrid.svelte';
  import SessionFilterBar from './SessionFilterBar.svelte';
  import { filterSessions, filterDayEvents, getFilters, filterStore } from '../../stores/sessionFilters';
  import { favorites } from '../../stores/favorites';

  let {
    sessions = /** @type {Array} */ ([]),
    days = /** @type {Array} */ ([]),
    speakerMap = /** @type {Record<string,string>} */ ({}),
    initialView = 'schedule',
    allDays = /** @type {string[]} */ ([]),
    allRooms = /** @type {string[]} */ ([]),
  } = $props();

  // Capture initial value once — user switches views freely after mount.
  let view = $state((() => initialView)());
  let showAbstract = $state(false);
  let favMap = $state({});
  let filterState = $state(getFilters()); // re-synced on store changes

  // Subscriptions — only update state when values actually differ
  // to avoid infinite $effect loops.

  const views = [
    { id: 'schedule', label: 'Schedule', cls: 'fa-regular fa-calendar-days' },
    { id: 'list', label: 'List', cls: 'fa-solid fa-list' },
    { id: 'grid', label: 'Grid', cls: 'fa-solid fa-th' },
  ];

  function setView(v) {
    view = v;
  }

  function toggleAbstract() {
    showAbstract = !showAbstract;
  }

  // Subscribe to favorites store
  $effect(() => {
    const unsub = favorites.subscribe(($favs) => {
      favMap = { ...$favs };
    });
    return unsub;
  });

  // Subscribe to filter store — guard against infinite loops by
  // only updating state when the serialised value actually changes.
  $effect(() => {
    const unsub = filterStore.subscribe(() => {
      const next = getFilters();
      if (JSON.stringify(next) !== JSON.stringify(filterState)) {
        filterState = next;
      }
    });
    return unsub;
  });

  // When filterState or input data changes, recompute filtered lists
  let filteredSessions = $derived.by(() => {
    const _ = JSON.stringify(filterState); // depend on filter state
    if (!sessions.length) return sessions;
    return filterSessions(sessions, speakerMap, favMap, filterState);
  });

  let filteredDays = $derived.by(() => {
    const _ = JSON.stringify(filterState);
    if (!days.length) return days;
    const hasActiveFilters = filterState.types.length > 0 || filterState.levels.length > 0 || filterState.tracks.length > 0;
    if (!hasActiveFilters) return days;
    return days.map((day) => ({
      ...day,
      data: {
        ...day.data,
        events: filterDayEvents(day.data?.events ?? [], filterState),
      },
    }));
  });

  let activeFilterCount = $derived.by(() => {
    const f = filterState;
    let count = f.types.length + f.levels.length + f.tracks.length +
      f.days.length + f.rooms.length + f.durations.length +
      (f.favoritesOnly ? 1 : 0) + (f.dataAi ? 1 : 0);
    if (f.search) count++;
    return count;
  });

</script>

<div class="session-view">
  <!-- filter bar -->
  <SessionFilterBar {allDays} {allRooms} />

  <!-- view switcher tabs -->
  <div class="view-tabs" role="tablist" aria-label="Session view mode">
    {#each views as v}
      <button
        class="view-tab"
        class:active={view === v.id}
        role="tab"
        aria-selected={view === v.id}
        onclick={() => setView(v.id)}
      >
        <i class="{v.cls}"></i>
        <span>{v.label}</span>
      </button>
    {/each}

    {#if view === 'list'}
      <button
        class="view-tool ml-auto"
        class:active={showAbstract}
        onclick={toggleAbstract}
        title={showAbstract ? 'Hide abstracts' : 'Show abstracts'}
      >
        <i class="fa-regular fa-rectangle-list"></i>
        <span class="hidden sm:inline">{showAbstract ? 'Hide' : 'Show'} abstracts</span>
      </button>
    {/if}
  </div>

  <!-- schedule view -->
  {#if view === 'schedule'}
    {#if filteredDays.length > 0}
      {#each filteredDays as day (day.id)}
        <SessionSchedule {day} />
      {/each}
    {:else if sessions.length > 0}
      <p class="view-hint">
        <i class="fa-regular fa-circle-info mr-2"></i>
        Schedule view requires day data. Showing list view instead.
      </p>
      <SessionList sessions={filteredSessions} {speakerMap} {showAbstract} />
    {:else}
      <p class="view-empty">No schedule data available.</p>
    {/if}

  <!-- list view -->
  {:else if view === 'list'}
    {#if filteredSessions.length > 0}
      <SessionList sessions={filteredSessions} {speakerMap} {showAbstract} />
    {:else if activeFilterCount > 0}
      <p class="view-empty">No sessions match your filters.</p>
    {:else}
      <p class="view-empty">No sessions to display.</p>
    {/if}

  <!-- grid view -->
  {:else if view === 'grid'}
    {#if filteredSessions.length > 0}
      <SessionGrid sessions={filteredSessions} {speakerMap} />
    {:else if activeFilterCount > 0}
      <p class="view-empty">No sessions match your filters.</p>
    {:else}
      <p class="view-empty">No sessions to display.</p>
    {/if}
  {/if}

  <!-- session count -->
  {#if filteredSessions.length > 0}
    <p class="view-count">
      {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
      {#if sessions.length !== filteredSessions.length}
        <span class="text-muted"> (filtered from {sessions.length})</span>
      {/if}
      {#if days.length > 0}
        &middot; {days.length} day{days.length !== 1 ? 's' : ''}
      {/if}
    </p>
  {/if}
</div>

<style>
  .session-view {
    font-family: 'Inter Tight', system-ui, sans-serif;
  }

  /* ── tabs ── */
  .view-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border, var(--ep-border));
  }

  .view-tab {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-muted, var(--ep-text-muted));
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: color 0.15s, background 0.15s, border-color 0.15s;
  }

  .view-tab:hover {
    color: var(--color-text, var(--ep-white));
    background: var(--color-surface-subtle, var(--ep-surface-subtle));
  }

  .view-tab.active {
    color: var(--color-accent-themed, var(--ep-accent, var(--color-accent)));
    border-color: var(--color-accent-themed, var(--ep-accent, var(--color-accent)));
    background: var(--color-surface-subtle, var(--ep-surface-subtle));
  }

  .view-tool {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    font-family: inherit;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--color-text-muted, var(--ep-text-muted));
    background: transparent;
    border: 1px dashed var(--color-border, var(--ep-border));
    border-radius: 6px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  .view-tool:hover,
  .view-tool.active {
    color: var(--color-text, var(--ep-white));
    border-color: var(--color-accent-themed, var(--ep-accent, var(--color-accent)));
  }

  .view-hint {
    text-align: center;
    color: var(--color-text-muted, var(--ep-text-muted));
    font-size: 0.9rem;
    padding: 1rem;
    background: var(--color-surface-subtle, var(--ep-surface-subtle));
    border: 1px solid var(--color-border, var(--ep-border));
    border-radius: 6px;
    margin-bottom: 1.5rem;
  }

  .view-empty {
    text-align: center;
    color: var(--color-text-muted, var(--ep-text-muted));
    font-size: 1rem;
    padding: 3rem;
    border: 1px dashed var(--color-border-bright);
    border-radius: 6px;
  }

  .view-count {
    text-align: center;
    font-size: 0.8rem;
    color: var(--color-text-muted, var(--ep-text-muted));
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border, var(--ep-border));
  }

  .text-muted {
    color: var(--color-text-muted, var(--ep-text-muted));
  }

  @media (max-width: 640px) {
    .view-tab {
      font-size: 0.8rem;
      padding: 0.4rem 0.6rem;
    }
  }
</style>
