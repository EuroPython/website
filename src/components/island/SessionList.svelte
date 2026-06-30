<script>
  /**
   * SessionList — display sessions as schedule-style cards with timeline on the left.
   *
   * Props:
   *   sessions  — array of SessionCollectionEntry objects
   *   speakerMap  — optional { [speakerId]: name } for resolving speaker names
   *   showAbstract  — if true, show truncated abstract text
   */

  import { t } from '../../utils/i18n';

  let {
    sessions = /** @type {Array} */ ([]),
    speakerMap = /** @type {Record<string,string>} */ ({}),
    showAbstract = false,
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

  function truncate(text, max = 180) {
    if (!text) return '';
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
  }

  function formatTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Warsaw' });
  }
</script>

<div class="session-list-timeline">
  {#each sessions as session (session.id || session.data?.code)}
    <div class="sess-timeline-entry">
      <div class="sess-timeline-marker">
        <time class="sess-timeline-time">{formatTime(session.data?.start)}</time>
        <div class="sess-timeline-line"></div>
      </div>

      <article
        class="session-card"
        class:beginner={session.data?.level === 'beginner'}
        class:advanced={session.data?.level === 'advanced'}
      >
        <a href={`/session/${session.id}`} class="session-card-title">
          {session.data?.title}
        </a>

        {#if session.data?.speakers?.length}
          <div class="session-card-speakers">
            {#each session.data.speakers as speaker, i}
              <a href="/speaker/{speakerId(speaker)}" class="speaker-link">{speakerName(speaker)}</a>{i < session.data.speakers.length - 1 ? ', ' : ''}
            {/each}
          </div>
        {/if}

        {#if showAbstract && session.data?.abstract}
          <p class="session-card-abstract">{truncate(session.data.abstract)}</p>
        {/if}

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
    </div>
  {/each}
</div>

{#if sessions.length === 0}
  <p class="session-empty">No sessions found.</p>
{/if}

<style>
  .session-list-timeline * {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 0.9rem;
  }

  .session-list-timeline {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  /* ── timeline entry ── */
  .sess-timeline-entry {
    display: flex;
    gap: 0.75rem;
    position: relative;
  }

  /* ── left column: time + line ── */
  .sess-timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 4.5rem;
    flex-shrink: 0;
    padding-top: 0.6rem;
  }

  .sess-timeline-time {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--ep-text-muted, var(--color-text-muted));
    white-space: nowrap;
    line-height: 1;
  }

  .sess-timeline-line {
    flex: 1;
    width: 1px;
    background: var(--ep-border, var(--color-border));
    margin-top: 0.4rem;
    min-height: 1.5rem;
  }

  .session-list-timeline .sess-timeline-entry:last-child .sess-timeline-line {
    display: none;
  }

  /* ── session card (same as schedule) ── */
  .session-card {
    flex: 1;
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
    margin-bottom: 4px;
  }

  .session-card:hover {
    border-color: var(--ep-accent, var(--color-accent-themed));
    background: var(--ep-session-hover-bg) !important;
    z-index: 10;
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
      var(--ep-surface-subtle, var(--color-surface-subtle));
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
      var(--ep-surface-subtle, var(--color-surface-subtle));
  }

  .session-card-title {
    font-family: 'Inter Tight', system-ui, sans-serif;
    font-size: 1.1rem;
    font-weight: 400;
    line-height: 1.3;
    color: var(--ep-white, var(--color-text));
    text-decoration: none;
    margin: 0;
    padding: 0;
  }

  .session-card-title:hover {
    text-decoration: underline;
  }

  .session-card-speakers {
    font-size: 0.85rem;
    color: var(--ep-text-secondary, var(--color-text-secondary));
    line-height: 1.3;
  }

  .session-card-speakers :global(.speaker-link) {
    color: var(--ep-text-secondary, var(--color-text-secondary));
    text-decoration: none;
  }

  .session-card-speakers :global(.speaker-link:hover) {
    text-decoration: underline;
  }

  .session-card-abstract {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    color: var(--ep-text-muted, var(--color-text-muted));
    line-height: 1.5;
  }

  .session-card-meta {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.7rem;
    color: var(--ep-text-muted, var(--color-text-muted));
    font-weight: 500;
    line-height: 1.4;
  }

  .session-meta-room,
  .session-meta-duration {
    display: inline;
  }

  .session-meta-duration::before {
    content: '\00b7';
    margin-right: 0.3rem;
    opacity: 0.5;
  }

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

  @media (min-width: 1281px) {
    .session-list-timeline * {
      font-size: 1.1rem;
    }
  }

  @media (max-width: 640px) {
    .sess-timeline-marker {
      width: 3.2rem;
    }
    .sess-timeline-time {
      font-size: 0.65rem;
    }
  }
</style>
