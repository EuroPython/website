<script>
  /**
   * SessionGrid — display sessions as a responsive card grid.
   *
   * Props:
   *   sessions  — array of SessionCollectionEntry objects
   *   speakerMap  — optional { [speakerId]: name } for resolving speaker names
   *   compact  — if true, use tighter grid for smaller cards
   */

  import { t } from '../../utils/i18n';

  let {
    sessions = /** @type {Array} */ ([]),
    speakerMap = /** @type {Record<string,string>} */ ({}),
    compact = false,
  } = $props();

  function speakerId(s) {
    return typeof s === 'string' ? s : s.id;
  }

  function speakerName(s) {
    const id = speakerId(s);
    return speakerMap[id] || id;
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
</script>

<div class="session-grid" class:compact>
  {#each sessions as session (session.id || session.data?.code)}
    <article
      class="session-card"
      class:beginner={session.data?.level === 'beginner'}
      class:advanced={session.data?.level === 'advanced'}
    >
      <div class="session-card-body">
        <a href={`/session/${session.id}`} class="session-card-title">
          {session.data?.title}
        </a>

        {#if session.data?.speakers?.length}
          <p class="session-card-speakers">

            {#each session.data.speakers as speaker, i}
              <a href="/speaker/{speakerId(speaker)}" class="speaker-link">{speakerName(speaker)}</a>{i < session.data.speakers.length - 1 ? ', ' : ''}
            {/each}
          </p>
        {/if}
      </div>

      <div class="session-card-meta">
        {#if session.data?.room}
          <span class="session-meta-room">{session.data.room}</span>
        {/if}
        {#if session.data?.duration}
          <span class="session-meta-duration">{session.data.duration}min</span>
        {/if}
      </div>

      <div class="session-card-badges">
        {#if session.data?.session_type}
          <span class="session-badge-tag">{capitalize(session.data.session_type)}</span>
        {/if}
        {#if session.data?.level}
          <span
            class="session-badge-level"
            class:beginner={session.data.level === 'beginner'}
            class:intermediate={session.data.level === 'intermediate'}
            class:advanced={session.data.level === 'advanced'}
          >
            {capitalize(session.data.level)}
          </span>
        {/if}
        {#if session.data?.track}
          <span class="session-badge-track">{t(session.data.track)}</span>
        {/if}
      </div>
    </article>
  {/each}
</div>

{#if sessions.length === 0}
  <p class="session-empty">No sessions found.</p>
{/if}

<style>
  .session-grid * {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 0.9rem;
  }

  .session-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .session-grid.compact {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
  }

  .session-card {
    display: flex;
    flex-direction: column;
    background: var(--color-surface-subtle, var(--ep-surface-subtle));
    border: 1px solid var(--color-border, var(--ep-border));
    border-radius: 6px;
    padding: 1.25rem;
    text-decoration: none;
    font-family: 'Inter Tight', system-ui, sans-serif;
    transition: border-color 0.1s ease-in-out, background 0.1s ease-in-out;
  }

  .session-card-body {
    flex: 1;
  }

  .session-card:hover {
    border-color: var(--ep-accent);
    background: var(--ep-session-hover-bg) !important;
  }

  .session-card.beginner {
    background:
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 4px,
        var(--ep-beginner-stripe) 4px,
        var(--ep-beginner-stripe) 6px
      ),
      var(--color-surface-subtle, var(--ep-surface-subtle));
  }

  .session-card.advanced {
    background:
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 4px,
        var(--ep-advanced-stripe) 4px,
        var(--ep-advanced-stripe) 6px
      ),
      var(--color-surface-subtle, var(--ep-surface-subtle));
  }

  .session-card-title {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--color-text, var(--ep-white));
    margin: 0;
    line-height: 1.3;
    text-decoration: none;
  }

  .session-card-title:hover {
    text-decoration: underline;
  }

  .session-card-speakers {
    font-size: 0.85rem;
    color: var(--color-text-secondary, var(--ep-text-secondary));
    margin: 0.15rem 0 0;
    line-height: 1.3;
  }

  .session-card-speakers :global(.speaker-link) {
    color: var(--color-text-secondary, var(--ep-text-secondary));
    text-decoration: none;
  }

  .session-card-speakers :global(.speaker-link:hover) {
    text-decoration: underline;
  }

  /* ── meta: inline room + duration with · separator, like schedule ── */
  .session-card-meta {
    padding-top: 0.3rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    color: var(--color-text-muted, var(--ep-text-muted));
    font-weight: 500;
    line-height: 1.4;
  }

  .session-meta-room,
  .session-meta-duration {
    display: inline;
  }

  .session-meta-duration::before {
    content: '·';
    margin-right: 0.3rem;
    opacity: 0.5;
  }

  /* ── badges: type/level/track pills, like schedule ── */
  .session-card-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3em;
    margin-top: 0.15em;
  }

  .session-badge-tag,
  .session-badge-track {
    padding: 0.1em 0.5em;
    border-radius: 3px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .session-badge-tag {
    background: var(--ep-level-intermediate-bg);
    color: var(--ep-level-intermediate-text);
  }

  .session-badge-level {
    display: inline-block;
    padding: 0.1em 0.5em;
    border-radius: 3px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    border: 1px solid transparent;
  }

  .session-badge-level.beginner {
    background: var(--ep-level-beginner-bg);
    color: var(--ep-level-beginner-text);
  }

  .session-badge-level.intermediate {
    background: var(--ep-level-intermediate-bg);
    color: var(--ep-level-intermediate-text);
  }

  .session-badge-level.advanced {
    background: var(--ep-level-advanced-bg);
    color: var(--ep-level-advanced-text);
  }

  .session-empty {
    text-align: center;
    color: var(--color-text-muted, var(--ep-text-muted));
    font-size: 1rem;
    padding: 3rem;
    border: 1px dashed var(--color-border-bright);
    border-radius: 6px;
  }

  /* ── large screens: scale up like schedule page ── */
  @media (min-width: 1281px) {
    .session-grid * {
      font-size: 1.1rem;
    }
  }
</style>
