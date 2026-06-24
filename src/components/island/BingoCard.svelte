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

  const COLS = 5;

  function loadChecked() {
    if (typeof localStorage === 'undefined') return new Array(25).fill(false);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return new Array(25).fill(false);
  }

  let checked = $state(loadChecked());
  let bingo = $state(false);
  let showResult = $state(false);

  // Trigger initial check after render
  $effect(() => {
    if (!bingo) checkBingo();
  });

  function checkBingo() {
    const lines = [];

    // rows
    for (let r = 0; r < 5; r++) {
      lines.push([0,1,2,3,4].map(c => r * 5 + c));
    }
    // cols
    for (let c = 0; c < 5; c++) {
      lines.push([0,1,2,3,4].map(r => r * 5 + c));
    }
    // diagonals
    lines.push([0,6,12,18,24]);
    lines.push([4,8,12,16,20]);

    for (const line of lines) {
      if (line.every(i => checked[i])) {
        if (!bingo) {
          bingo = true;
          try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked])); } catch {}
          setTimeout(() => { showResult = true; }, 600);
        }
        return;
      }
    }
  }

  function reset() {
    checked = new Array(25).fill(false);
    bingo = false;
    showResult = false;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked])); } catch {}
  }

  function toggle(i) {
    if (bingo) return;
    checked[i] = !checked[i];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...checked]));
    } catch {}
  }

  function buildShareText() {
    const attended = editions.filter((_, i) => checked[i]).map(e => `${e.year} ${e.city}`);
    const count = attended.length;
    const base = `I just completed #EuroPythonBingo! 🐍`;
    return `${base}\n${count} editions attended\n${attended.join(' · ')}`;
  }

  // Generate coupon code from flipped cells
  function getBingoCode() {
    const flipped = checked.map((v, i) => v ? i : -1).filter(i => i >= 0);
    // Map flipped cells to the winning line code
    const lines = [
      { code: '329K', cells: [0,1,2,3,4] },
      { code: '7XX6', cells: [5,6,7,8,9] },
      { code: 'JYUW', cells: [10,11,12,13,14] },
      { code: '5G5U', cells: [15,16,17,18,19] },
      { code: '99SR', cells: [20,21,22,23,24] },
      { code: 'PFKN', cells: [0,5,10,15,20] },
      { code: 'HFVK', cells: [1,6,11,16,21] },
      { code: 'JPYK', cells: [2,7,12,17,22] },
      { code: 'W3V8', cells: [3,8,13,18,23] },
      { code: '6HKX', cells: [4,9,14,19,24] },
      { code: 'VMHN', cells: [0,6,12,18,24] },
      { code: '47YA', cells: [4,8,12,16,20] },
    ];
    const sorted = [...flipped].sort((a, b) => a - b).join(',');
    for (const line of lines) {
      if ([...line.cells].sort((a, b) => a - b).join(',') === sorted) {
        return line.code;
      }
    }
    return '';
  }

  let bingoCode = $derived(bingo ? getBingoCode() : '');
  let shareUrl = $derived(bingoCode
    ? window.location.origin + '/bingo/' + bingoCode
    : window.location.origin + '/bingo');

  function shareLinkedIn() {
    const text = buildShareText() + '\n\n' + shareUrl;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }

  function shareX() {
    const text = buildShareText();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  }

  function shareBlueSky() {
    const text = `${buildShareText()}\n\n${shareUrl}`;
    window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }

  function shareMastodon() {
    const text = `${buildShareText()}\n\n${shareUrl}`;
    window.open(`https://shareopenly.org/share/?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  }

  function downloadSvg() {
    const CELL = 124;
    const GAP = 6;
    const PAD = 20;
    const HEADER_H = 74;
    const FOOTER_H = 46;
    const COLS = 5;
    const ROWS = 5;
    const W = COLS * CELL + (COLS - 1) * GAP + PAD * 2;
    const H = HEADER_H + ROWS * CELL + (ROWS - 1) * GAP + FOOTER_H + PAD * 2;

    const isDark = document.documentElement.classList.contains('dark');
    const bgColor = isDark ? '#0b1121' : '#f5f0eb';
    const textColor = isDark ? '#ffffff' : '#1a1a2e';
    const accentColor = isDark ? '#f0c040' : '#1a56db';
    const mutedColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';
    const cellBg = isDark ? '#0d1520' : '#ffffff';
    const cellBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
    const flippedBg = isDark ? '#f0c040' : '#1a56db';
    const flippedText = isDark ? '#0b1121' : '#ffffff';
    const count = checked.filter(Boolean).length;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs>
        <style>
          .title { font: bold 26px system-ui, sans-serif; fill: ${textColor}; text-anchor: middle; }
          .sub { font: 12px system-ui, sans-serif; fill: ${mutedColor}; text-anchor: middle; }
          .year-f { font: bold 20px system-ui, sans-serif; fill: ${textColor}; text-anchor: middle; }
          .city-f { font: 11px system-ui, sans-serif; fill: ${mutedColor}; text-anchor: middle; }
          .year-b { font: bold 20px system-ui, sans-serif; fill: ${flippedText}; text-anchor: middle; }
          .city-b { font: 11px system-ui, sans-serif; fill: ${flippedText}; text-anchor: middle; opacity: 0.65; }
          .watermark { font: bold 56px system-ui, sans-serif; fill: ${accentColor}; text-anchor: middle; opacity: 0.12; }
        </style>
      </defs>
      <rect width="${W}" height="${H}" fill="${bgColor}" rx="4"/>
      <text x="${W / 2}" y="38" class="title">EuroPython Bingo</text>
      <text x="${W / 2}" y="58" class="sub">${count} of 25 editions</text>`;

    editions.forEach((ed, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const x = PAD + col * (CELL + GAP);
      const y = HEADER_H + row * (CELL + GAP);
      const flip = checked[i];

      // card background
      svg += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="3" fill="${flip ? flippedBg : cellBg}" stroke="${flip ? accentColor : cellBorder}" stroke-width="${flip ? 2 : 1}"/>`;

      if (flip) {
        svg += `<text x="${x + CELL / 2}" y="${y + CELL * 0.48}" class="year-b">${ed.year}</text>`;
        svg += `<text x="${x + CELL / 2}" y="${y + CELL * 0.66}" class="city-b">${ed.city}</text>`;
      } else {
        svg += `<text x="${x + CELL / 2}" y="${y + CELL * 0.48}" class="city-f">${ed.city}</text>`;
        svg += `<text x="${x + CELL / 2}" y="${y + CELL * 0.66}" class="year-f">${ed.year}</text>`;
      }
    });

    // watermark
    svg += `<text x="${W / 2}" y="${H - FOOTER_H / 2 + 8}" class="watermark">EuroPython 2026</text>`;
    svg += `</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'europython-bingo.svg';
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="bingo-wrapper">
  {#if !bingo}
    <p class="bingo-tally">
      {checked.filter(Boolean).length === 0
        ? "Flip cards for editions you've attended"
        : `${checked.filter(Boolean).length} of 25 flipped`}
    </p>
  {:else}
    <p class="bingo-tally bingo-won">🎉 BINGO! You completed a line!</p>
  {/if}

  <div class="bingo-grid-wrap" class:flipped={showResult}>
    <div class="grid-front">
      <div class="bingo-grid" role="grid" aria-label="EuroPython Bingo">
        {#each editions as edition, i}
          <button
            class="bingo-cell"
            class:flipped={checked[i]}
            onclick={() => toggle(i)}
            disabled={showResult}
            aria-pressed={checked[i]}
            aria-label={checked[i] ? `${edition.year} ${edition.city} — attended` : `${edition.city} — click to flip`}
          >
            <div class="flipper">
              <div class="front">
                <span class="cell-city-front">{edition.city}</span>
                <span class="cell-year-front">{edition.year}</span>
              </div>
              <div class="back">
                <span class="cell-year-back">{edition.year}</span>
                <span class="cell-city-back">{edition.city}</span>
              </div>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <div class="grid-back">
      <div class="result-card">
        <button class="result-close" onclick={reset} aria-label="Close and reset">✕</button>
        <p class="result-title">🎉 BINGO!</p>
        <p class="result-sub">You completed a line!</p>
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
          <button class="share-btn share-btn--save" onclick={downloadSvg} aria-label="Download SVG">
            Download SVG
          </button>
        </div>
        <button class="result-back" onclick={reset}>← Back to game</button>
      </div>
    </div>
  </div>
</div>

<style>
  .bingo-wrapper { width: 100%; }

  .bingo-tally {
    text-align: center;
    font-size: 1rem;
    color: var(--color-text-muted);
    margin: 0 0 1.5rem;
    min-height: 1.5em;
  }

  .bingo-won { display: none; }

.bingo-grid-wrap {
    position: relative;
    max-width: 700px;
    margin: 0 auto 2.5rem;
    perspective: 1200px;
    transition: transform 0.6s ease;
    transform-style: preserve-3d;
  }

  .bingo-grid-wrap.flipped {
    transform: rotateY(180deg);
  }

  .grid-front,
  .grid-back {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .grid-back {
    position: absolute;
    inset: -2px;
    transform: rotateY(180deg);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--color-accent-themed);
    border-radius: 8px;
    overflow: hidden;
  }

  .bingo-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
  }

  .bingo-cell {
    aspect-ratio: 1;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    perspective: 600px;
    -webkit-tap-highlight-color: transparent;
  }

  .bingo-cell:disabled {
    cursor: default;
  }

  .flipper {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.5s ease;
    transform-style: preserve-3d;
    border-radius: 4px;
  }

  .bingo-cell.flipped .flipper {
    transform: rotateY(180deg);
  }

  .front,
  .back {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    border-radius: 4px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    padding: 6px;
    text-align: center;
  }

  .front {
    background: var(--color-surface-faint);
    border: 1px dashed var(--color-border);
  }

  .bingo-cell:hover .front {
    border-color: var(--color-accent-themed);
    background: var(--color-surface-subtle);
  }

  .back {
    background: var(--color-accent-themed);
    border: 1px solid var(--color-accent-themed);
    transform: rotateY(180deg);
  }

  .bingo-cell.bingo .flipper {
    transition: transform 0.6s ease;
  }

  /* ── text ── */
  .cell-city-front {
    font-size: clamp(0.7rem, 1.6vw, 0.9rem);
    font-weight: 600;
    color: var(--color-text-primary);
    line-height: 1.1;
  }

  .cell-year-front {
    font-size: clamp(0.55rem, 1.2vw, 0.65rem);
    color: var(--color-text-faint);
    line-height: 1;
  }

  .cell-year-back {
    font-size: clamp(1.2rem, 3vw, 1.6rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--color-on-accent);
    line-height: 1;
  }

  .cell-city-back {
    font-size: clamp(0.55rem, 1.2vw, 0.65rem);
    color: var(--color-on-accent);
    opacity: 0.65;
    line-height: 1;
  }

  /* ── share ── */
    .result-card {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-dark);
    border-radius: 6px;
    padding: 2rem;
    text-align: center;
    position: relative;
  }

  .result-close {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 1.2rem;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
  }

  .result-close:hover {
    color: var(--color-text);
  }

  .result-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--color-accent-themed);
    margin: 0 0 0.25rem;
  }

  .result-sub {
    font-size: 1rem;
    color: var(--color-text-secondary);
    margin: 0 0 1.25rem;
  }

  .result-back {
    margin-top: 0.75rem;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-muted);
    font-size: 0.85rem;
    padding: 0.5rem 1.25rem;
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.15s, color 0.15s;
  }

  .result-back:hover {
    border-color: var(--color-accent-themed);
    color: var(--color-accent-themed);
  }

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
    align-items: center;
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
    border-color: var(--color-accent-themed);
    color: var(--color-accent-themed);
    background: var(--color-surface-subtle);
  }

  .share-btn--save {
    width: auto;
    padding: 0 0.875rem;
    font-size: 0.8rem;
    font-weight: 600;
    font-family: inherit;
    letter-spacing: 0.02em;
  }

  @media (max-width: 540px) {
    .bingo-grid { gap: 4px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .flipper { transition: none; }
  }
</style>
