<script>
  const STORAGE_KEY = 'ep-bingo-checked';

  const editions = [
    { year: 2002, city: 'Charleroi' },
    { year: 2003, city: 'Charleroi' },
    { year: 2004, city: 'Gothenburg' },
    { year: 2005, city: 'Gothenburg' },
    { year: 2006, city: 'CERN, Geneva' },
    { year: 2007, city: 'Vilnius' },
    { year: 2008, city: 'Vilnius' },
    { year: 2009, city: 'Birmingham' },
    { year: 2010, city: 'Birmingham' },
    { year: 2011, city: 'Florence' },
    { year: 2012, city: 'Florence' },
    { year: 2013, city: 'Florence' },
    { year: 2014, city: 'Berlin' },
    { year: 2015, city: 'Bilbao' },
    { year: 2016, city: 'Bilbao' },
    { year: 2017, city: 'Rimini' },
    { year: 2018, city: 'Edinburgh' },
    { year: 2019, city: 'Basel' },
    { year: 2020, city: 'Online' },
    { year: 2021, city: 'Online' },
    { year: 2022, city: 'Dublin' },
    { year: 2023, city: 'Prague' },
    { year: 2024, city: 'Prague' },
    { year: 2025, city: 'Prague' },
    { year: 2026, city: 'Kraków' },
  ];

  function loadChecked() {
    if (typeof localStorage === 'undefined') return new Array(25).fill(false);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return new Array(25).fill(false);
  }

  let checked = $state(loadChecked());
  let checkedCount = $derived(checked.filter(Boolean).length);

  function toggle(i) {
    checked[i] = !checked[i];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch {}
  }

  function buildShareText() {
    const attended = editions.filter((_, i) => checked[i]).map(e => `${e.year} ${e.city}`);
    const count = attended.length;
    const base = `I've attended ${count} EuroPython conference${count !== 1 ? 's' : ''}! 🐍`;
    return count > 0 ? `${base}\n${attended.join(' · ')}` : base;
  }

  const PAGE_URL = 'https://ep2026.europython.eu/#bingo';
  const BINGO_PAGE_URL = 'https://ep2026.europython.eu/bingo';

  function shareLinkedIn() {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(BINGO_PAGE_URL)}`,
      '_blank', 'noopener,noreferrer'
    );
  }

  function shareX() {
    const text = buildShareText() + '\n#EuroPython #Python';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(PAGE_URL)}`,
      '_blank', 'noopener,noreferrer'
    );
  }

  function shareBlueSky() {
    const text = `${buildShareText()}\n#EuroPython #Python\n${PAGE_URL}`;
    window.open(
      `https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`,
      '_blank', 'noopener,noreferrer'
    );
  }

  function shareMastodon() {
    const text = `${buildShareText()}\n#EuroPython #Python\n${PAGE_URL}`;
    window.open(
      `https://shareopenly.org/share/?url=${encodeURIComponent(PAGE_URL)}&text=${encodeURIComponent(text)}`,
      '_blank', 'noopener,noreferrer'
    );
  }

  function downloadImage() {
    const COLS = 5;
    const CELL = 130;
    const PAD = 28;
    const HEADER_H = 100;
    const W = COLS * CELL + PAD * 2;
    const H = COLS * CELL + PAD * 2 + HEADER_H;

    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    /* background */
    ctx.fillStyle = '#0b1121';
    ctx.fillRect(0, 0, W, H);

    /* title */
    ctx.fillStyle = '#f0c040';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('EuroPython Bingo', W / 2, PAD + 34);

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '13px system-ui, sans-serif';
    ctx.fillText(
      `${checkedCount} of 25 editions attended · ep2026.europython.eu/#bingo`,
      W / 2, PAD + 60
    );

    editions.forEach((ed, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = PAD + col * CELL;
      const y = HEADER_H + PAD + row * CELL;
      const isChecked = checked[i];
      const isCurrent = ed.year === 2026;

      /* cell bg */
      ctx.fillStyle = isChecked ? '#f0c040' : isCurrent ? '#111d36' : '#0d1520';
      roundRect(ctx, x + 3, y + 3, CELL - 6, CELL - 6, 2);
      ctx.fill();

      /* cell border — dashed approximation via dotted segments */
      ctx.strokeStyle = isChecked ? '#d4a830' : isCurrent ? '#2a4a80' : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      roundRect(ctx, x + 3, y + 3, CELL - 6, CELL - 6, 2);
      ctx.stroke();
      ctx.setLineDash([]);

      /* year */
      ctx.fillStyle = isChecked ? '#0b1121' : '#ffffff';
      ctx.font = `bold 21px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(ed.year.toString(), x + CELL / 2, y + CELL * 0.46);

      /* city */
      ctx.fillStyle = isChecked ? 'rgba(11,17,33,0.65)' : 'rgba(255,255,255,0.55)';
      ctx.font = `12px system-ui, sans-serif`;
      ctx.fillText(ed.city, x + CELL / 2, y + CELL * 0.68);
    });

    const link = document.createElement('a');
    link.download = 'europython-bingo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
</script>

<div class="bingo-wrapper">
  <p class="bingo-tally">
    {checkedCount === 0
      ? "Click each edition you’ve attended"
      : checkedCount === 25
        ? '🎉 You attended all 25 editions!'
        : `${checkedCount} of 25 attended`}
  </p>

  <div class="bingo-grid" role="grid" aria-label="EuroPython Bingo card — tick each edition you attended">
    {#each editions as edition, i}
      <button
        class="bingo-cell"
        class:checked={checked[i]}
        class:current={edition.year === 2026}
        onclick={() => toggle(i)}
        aria-pressed={checked[i]}
        aria-label={`${edition.year} ${edition.city}${checked[i] ? ' — attended' : ''}`}
        role="gridcell"
      >
        <span class="cell-year">{edition.year}</span>
        <span class="cell-city">{edition.city}</span>
        {#if edition.year === 2026}
          <span class="cell-now">Now!</span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="share-wrap">
    <p class="share-heading">Share your card</p>
    <div class="share-row">
      <button class="share-btn" onclick={shareLinkedIn} aria-label="Share on LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      </button>
      <button class="share-btn" onclick={shareX} aria-label="Share on X">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </button>
      <button class="share-btn" onclick={shareBlueSky} aria-label="Share on BlueSky">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.204-.659-.3-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z"/></svg>
      </button>
      <button class="share-btn" onclick={shareMastodon} aria-label="Share on Mastodon">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/></svg>
      </button>
      <button class="share-btn share-btn--ig" onclick={downloadImage} aria-label="Save image for Instagram">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
      </button>
    </div>
  </div>
</div>

<style>
  .bingo-wrapper {
    width: 100%;
  }

  /* ── tally ── */
  .bingo-tally {
    text-align: center;
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: 0 0 1.5rem;
    min-height: 1.5em;
  }

  /* ── grid ── */
  .bingo-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    max-width: 780px;
    margin: 0 auto 2.5rem;
  }

  /* ── cell ── */
  .bingo-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    border: 1px dashed var(--color-border);
    border-radius: 2px;
    background: var(--color-surface-faint);
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.15s;
    padding: 8px 6px;
    gap: 3px;
    text-align: center;
    font-family: inherit;
    -webkit-tap-highlight-color: transparent;
  }

  .bingo-cell:hover {
    border-color: var(--color-accent);
    background: var(--color-surface-subtle);
    transform: translateY(-3px);
    z-index: 1;
  }

  .bingo-cell:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  /* current year — slightly highlighted border */
  .bingo-cell.current {
    border-color: var(--color-border-bright);
  }

  /* checked state */
  .bingo-cell.checked {
    background: var(--color-accent);
    border-style: solid;
    border-color: var(--color-accent-hover);
  }

  .bingo-cell.checked:hover {
    border-color: var(--color-accent-hover);
    background: var(--color-accent-hover);
    transform: translateY(-3px);
  }

  /* ── cell text ── */
  .cell-year {
    font-size: clamp(1rem, 2.5vw, 1.35rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
    line-height: 1;
  }

  .bingo-cell.checked .cell-year {
    color: var(--color-on-accent);
  }

  .cell-city {
    font-size: clamp(0.6rem, 1.4vw, 0.75rem);
    color: var(--color-text-faint);
    line-height: 1.1;
  }

  .bingo-cell.checked .cell-city {
    color: var(--color-on-accent);
    opacity: 0.7;
  }

.cell-now {
    font-size: clamp(0.45rem, 1vw, 0.6rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-accent);
    line-height: 1;
    margin-top: 1px;
  }

  .bingo-cell.checked .cell-now {
    color: var(--color-on-accent);
    opacity: 0.6;
  }

  /* ── share ── */
  .share-wrap {
    text-align: center;
  }

  .share-heading {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-faint);
    margin: 0 0 0.875rem;
  }

  .share-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }

  .share-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px dashed var(--color-border-strong);
    border-radius: 2px;
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }

  .share-btn svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .share-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-surface-subtle);
  }

  .share-btn--ig:hover {
    border-color: oklch(0.6 0.23 10);
    color: oklch(0.6 0.23 10);
  }

  /* ── responsive ── */
  @media (max-width: 540px) {
    .bingo-grid { gap: 5px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bingo-cell { transition: border-color 0.15s, background 0.15s; }
    .bingo-cell:hover { transform: none; }
  }
</style>
