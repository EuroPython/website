
// Mobile hamburger nav
// =====================
(function() {
  var nav = document.querySelector('nav');
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (!toggle || !navLinks || !nav) return;

  function closeMenu() {
    navLinks.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  function openMenu() {
    navLinks.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Make sure nav is visible when opening menu
    nav.classList.remove('nav-hidden');
  }

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Dropdown toggle on mobile: tap to expand/collapse
  navLinks.querySelectorAll('.nav-item.has-dropdown > a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        var item = link.closest('.nav-item');
        // Close other open dropdowns
        navLinks.querySelectorAll('.nav-item.open').forEach(function(other) {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      }
    });

    // Keyboard support for desktop dropdowns
    link.addEventListener('keydown', function(e) {
      if (window.innerWidth <= 900) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        var item = link.closest('.nav-item');
        var isOpen = item.classList.contains('dropdown-open');
        // Close all open dropdowns
        navLinks.querySelectorAll('.nav-item.dropdown-open').forEach(function(other) {
          other.classList.remove('dropdown-open');
          other.querySelector('a[aria-expanded]').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('dropdown-open');
          link.setAttribute('aria-expanded', 'true');
          var firstLink = item.querySelector('.nav-dropdown li a');
          if (firstLink) firstLink.focus();
        }
      } else if (e.key === 'Escape') {
        var item = link.closest('.nav-item');
        item.classList.remove('dropdown-open');
        link.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Escape key inside dropdown items
  navLinks.querySelectorAll('.nav-dropdown li a').forEach(function(ddLink) {
    ddLink.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        var item = ddLink.closest('.nav-item.has-dropdown');
        item.classList.remove('dropdown-open');
        var trigger = item.querySelector(':scope > a');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });

  // Close menu when clicking a sub-link
  navLinks.querySelectorAll('.nav-dropdown li a').forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
      navLinks.querySelectorAll('.nav-item.open').forEach(function(item) {
        item.classList.remove('open');
      });
    });
  });

  // ─── SCROLL-TO-HIDE NAV (mobile only) ──────────────────────────────────
  var lastScrollY = window.scrollY;
  var ticking = false;

  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      // Only apply on mobile, never while menu is open
      if (window.innerWidth <= 900 && !navLinks.classList.contains('open')) {
        var currentY = window.scrollY;
        if (currentY > lastScrollY && currentY > 60) {
          nav.classList.add('nav-hidden');
        } else {
          nav.classList.remove('nav-hidden');
        }
        lastScrollY = currentY;
      } else {
        nav.classList.remove('nav-hidden');
        lastScrollY = window.scrollY;
      }
      ticking = false;
    });
  }, { passive: true });
}());

// EP25 bingo card
// =================
document.querySelectorAll('.ep25-box:not(.ep25-current)').forEach(function(box) {
  box.addEventListener('click', function() { box.classList.toggle('ep25-checked'); });
});


// Session filter
// ==============
(function() {
  var input = document.getElementById('sess-search');
  if (!input) return;
  var grid = document.getElementById('sess-grid');
  var cards = grid.querySelectorAll('.sess-card');
  var groups = grid.querySelectorAll('.sess-topic-group');
  var countEl = document.getElementById('sess-count');
  var noResults = document.getElementById('sess-no-results');
  var trackSelect = document.getElementById('sess-track-filter');
  var total = cards.length;

  function filterCards() {
    var q = input.value.toLowerCase().trim();
    var activeTopic = trackSelect ? trackSelect.value : '';
    var visible = 0;

    cards.forEach(function(card) {
      var matchText = !q || card.getAttribute('data-search').indexOf(q) !== -1;
      var matchTopic = !activeTopic || card.getAttribute('data-track') === activeTopic;
      var show = matchText && matchTopic;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    groups.forEach(function(group) {
      var hasVisible = group.querySelector('.sess-card:not([style*="display: none"])');
      group.style.display = hasVisible ? '' : 'none';
    });

    countEl.textContent = (q || activeTopic) ? visible + ' / ' + total : total;
    noResults.hidden = visible > 0;
  }

  input.addEventListener('input', filterCards);
  if (trackSelect) trackSelect.addEventListener('change', filterCards);
}());

// Speaker filter
// ==============
(function() {
  var input = document.getElementById('spkrs-search');
  if (!input) return;
  var grid = document.getElementById('spkrs-grid');
  var cards = grid.querySelectorAll('.sess-card');
  var noResults = document.getElementById('spkrs-no-results');

  input.addEventListener('input', function() {
    var q = input.value.toLowerCase().trim();
    var visible = 0;
    cards.forEach(function(card) {
      var show = !q || card.getAttribute('data-search').indexOf(q) !== -1;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    noResults.hidden = visible > 0;
  });
}());

// Search modal
// ============
(function() {
  var btn = document.getElementById('nav-search-btn');
  var modal = document.getElementById('search-modal');
  if (!btn || !modal) return;
  var input = document.getElementById('search-modal-input');
  var results = document.getElementById('search-modal-results');
  var backdrop = modal.querySelector('.search-modal-backdrop');
  var items = null;
  var activeIdx = -1;

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function loadIndex() {
    if (items) return;
    var v = modal.getAttribute('data-index-version');
    var url = '/search-index.json' + (v ? '?v=' + v : '');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if (xhr.status === 200) items = JSON.parse(xhr.responseText);
    };
    xhr.send();
  }

  function open() {
    loadIndex();
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    results.innerHTML = '';
    activeIdx = -1;
    input.focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
    btn.focus();
  }

  function setActive(idx) {
    var els = results.querySelectorAll('.search-modal-item');
    if (activeIdx >= 0 && activeIdx < els.length) els[activeIdx].classList.remove('active');
    activeIdx = idx;
    if (activeIdx >= 0 && activeIdx < els.length) {
      els[activeIdx].classList.add('active');
      els[activeIdx].scrollIntoView({ block: 'nearest' });
    }
  }

  btn.addEventListener('click', open);

  var mobileSearch = document.getElementById('nav-mobile-search');
  if (mobileSearch) {
    mobileSearch.addEventListener('click', function(e) {
      e.preventDefault();
      // close mobile menu first
      var navLinks = document.querySelector('.nav-links');
      var navToggle = document.querySelector('.nav-toggle');
      if (navLinks) navLinks.classList.remove('open');
      if (navToggle) navToggle.classList.remove('active');
      open();
    });
  }

  backdrop.addEventListener('click', close);

  modal.addEventListener('keydown', function(e) {
    var els = results.querySelectorAll('.search-modal-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(Math.min(activeIdx + 1, els.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(Math.max(activeIdx - 1, 0));
    } else if (e.key === 'Enter' && els.length) {
      e.preventDefault();
      var target = (activeIdx >= 0 && activeIdx < els.length) ? els[activeIdx] : els[0];
      close();
      window.location.href = target.getAttribute('href');
    } else if (e.key === 'Tab') {
      // Focus trap: cycle between input and result links
      var focusable = [input].concat(Array.prototype.slice.call(els));
      if (focusable.length <= 1) { e.preventDefault(); return; }
      var current = focusable.indexOf(document.activeElement);
      if (e.shiftKey) {
        e.preventDefault();
        var prev = current <= 0 ? focusable.length - 1 : current - 1;
        focusable[prev].focus();
      } else {
        e.preventDefault();
        var next = current >= focusable.length - 1 ? 0 : current + 1;
        focusable[next].focus();
      }
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.hidden) { close(); return; }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open(); }
  });

  input.addEventListener('input', function() {
    activeIdx = -1;
    if (!items) { results.innerHTML = ''; return; }
    var q = input.value.toLowerCase().trim();
    if (!q) { results.innerHTML = ''; return; }

    var words = q.split(/\s+/);
    var scored = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var match = true;
      for (var w = 0; w < words.length; w++) {
        if (item.k.indexOf(words[w]) === -1) { match = false; break; }
      }
      if (!match) continue;
      // Title matches rank higher
      var titleLower = item.t.toLowerCase();
      var titleScore = 0;
      for (var w = 0; w < words.length; w++) {
        if (titleLower.indexOf(words[w]) !== -1) titleScore++;
      }
      scored.push({ item: item, score: titleScore });
    }

    scored.sort(function(a, b) { return b.score - a.score; });
    var matches = scored.slice(0, 15);

    if (!matches.length) {
      results.innerHTML = '<div style="padding:1.2rem 1.4rem;color:rgba(255,255,255,0.65);font-size:1.05rem">No results found.</div>';
      return;
    }

    results.innerHTML = matches.map(function(m) {
      return '<a href="' + escapeHtml(m.item.u) + '" class="search-modal-item">' +
        '<div class="search-modal-item-title">' + escapeHtml(m.item.t) + '</div>' +
        (m.item.p ? '<div class="search-modal-item-meta">' + escapeHtml(m.item.p) + '</div>' : '') +
        '</a>';
    }).join('');

    results.querySelectorAll('.search-modal-item').forEach(function(el) {
      el.addEventListener('click', function() { close(); });
    });
  });
}());

// Schedule day tabs
// =================
(function() {
  var tabs = document.querySelectorAll('.sched-tab');
  if (!tabs.length) return;

  function activateTab(tab) {
    var dayId = tab.getAttribute('data-day');
    tabs.forEach(function(t) {
      t.classList.remove('sched-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('sched-tab--active');
    tab.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.sched-day').forEach(function(d) {
      d.classList.toggle('sched-day--active', d.id === 'sched-' + dayId);
    });
  }

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() { activateTab(tab); });
  });

  // Arrow key navigation between tabs (WAI-ARIA tabs pattern)
  var tablist = document.querySelector('.sched-tabs[role="tablist"]');
  if (tablist) {
    tablist.addEventListener('keydown', function(e) {
      var tabArr = Array.prototype.slice.call(tabs);
      var idx = tabArr.indexOf(document.activeElement);
      if (idx === -1) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        var next = tabArr[(idx + 1) % tabArr.length];
        next.focus();
        activateTab(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        var prev = tabArr[(idx - 1 + tabArr.length) % tabArr.length];
        prev.focus();
        activateTab(prev);
      }
    });
  }
}());

// Schedule deep-link (highlight session from hash)
// =================================================
(function() {
  var hash = location.hash;
  if (!hash || !(hash.startsWith('#session-') || hash.startsWith('#break-'))) return;
  var el = document.getElementById(hash.slice(1));
  if (!el) return;

  // Find which day tab contains this element and activate it
  var day = el.closest('.sched-day');
  if (day) {
    var dayId = day.id.replace('sched-', '');
    document.querySelectorAll('.sched-tab').forEach(function(t) {
      var isActive = t.getAttribute('data-day') === dayId;
      t.classList.toggle('sched-tab--active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    document.querySelectorAll('.sched-day').forEach(function(d) {
      d.classList.toggle('sched-day--active', d === day);
    });
  }

  el.classList.add('sched-highlight');
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}());

// Keyboard nav
// ============
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
});
document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-nav');
});
