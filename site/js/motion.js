/* Motion behaviours. Progressive enhancement only. If this file fails to load
   the page still reads, still navigates and still converts. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- scroll reveal ---------------------------------------------------- */
  var targets = document.querySelectorAll('.rise, .card__list');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---- hero drawing: fit, do not crop, on a phone ------------------------
     The rack is authored 1600x700 and set to "slice", which covers the box and
     crops the overflow. On a 375px screen that scales the drawing to 988px and
     throws away roughly 62% of the flow line, so the travelling dots are off
     screen for most of their nine seconds. Below 700px switch to "meet" so the
     whole pipeline fits the width and the movement is actually visible. */
  (function () {
    var rack = document.querySelector('.hero__rack');
    if (!rack) return;
    var narrow = window.matchMedia('(max-width: 700px)');
    var apply = function () {
      rack.setAttribute('preserveAspectRatio',
        narrow.matches ? 'xMidYMax meet' : 'xMidYMax slice');
    };
    apply();
    if (narrow.addEventListener) narrow.addEventListener('change', apply);
  }());

  /* ---- stagger index for pills ----------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.card__list, .cloud'), function (list) {
    Array.prototype.forEach.call(list.children, function (pill, i) {
      pill.style.setProperty('--i', i);
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('.pipe__flow'), function (d, i) {
    d.style.setProperty('--i', i);
  });

  /* ---- count up --------------------------------------------------------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-to'));
    var dp = parseInt(el.getAttribute('data-dp') || '0', 10);
    var dur = 1250, t0 = null;
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      el.textContent = (target * eased).toLocaleString('en-GB', {
        minimumFractionDigits: dp, maximumFractionDigits: dp
      });
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var nums = document.querySelectorAll('[data-to]');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(nums, function (el) {
      el.textContent = parseFloat(el.getAttribute('data-to')).toLocaleString('en-GB');
    });
  } else {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { countUp(e.target); nio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(nums, function (el) { nio.observe(el); });
  }

  /* ---- sticky bar shrink ------------------------------------------------ */
  var bar = document.querySelector('.bar'), ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      bar.classList.toggle('small', window.scrollY > 90);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- cursor-aware button glow ---------------------------------------- */
  if (!reduced) {
    Array.prototype.forEach.call(document.querySelectorAll('.btn--primary,.btn--dark'), function (b) {
      b.addEventListener('pointermove', function (ev) {
        var r = b.getBoundingClientRect();
        b.style.setProperty('--mx', ((ev.clientX - r.left) / r.width * 100) + '%');
        b.style.setProperty('--my', ((ev.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ---- what we build: index and detail ---------------------------------
     Tabs at desktop, accordion below 980px. Selection is by CLICK only.
     The index sits directly in the reading path, so hover-switching would
     fire every time the cursor crossed it on the way somewhere else.     */
  [].slice.call(document.querySelectorAll('.build')).forEach(function (root) {
    var tabs   = [].slice.call(root.querySelectorAll('.build__item'));
    var panels = [].slice.call(root.querySelectorAll('.build__panel'));
    if (!tabs.length) return;
    var list = root.querySelector('.build__index');
    var wide = window.matchMedia('(min-width: 980px)');
    var open = 0;

    function paint() {
      var tabsMode = wide.matches;
      tabs.forEach(function (t, i) {
        var on = tabsMode ? i === open : i === open;
        t.classList.toggle('is-on', on);
        if (tabsMode) {
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.removeAttribute('aria-expanded');
          t.tabIndex = on ? 0 : -1;
        } else {
          t.setAttribute('aria-expanded', on ? 'true' : 'false');
          t.removeAttribute('aria-selected');
          t.tabIndex = 0;
        }
        panels[i].hidden = !on;
      });
    }

    function mode() {
      var tabsMode = wide.matches;
      /* In accordion mode the tab roles no longer describe the widget. */
      if (tabsMode) {
        list.setAttribute('role', 'tablist');
        list.setAttribute('aria-orientation', 'vertical');
        tabs.forEach(function (t, i) {
          t.setAttribute('role', 'tab');
          panels[i].setAttribute('role', 'tabpanel');
        });
        if (open < 0) open = 0;            /* tabs always have one selected */
      } else {
        list.removeAttribute('role');
        list.removeAttribute('aria-orientation');
        tabs.forEach(function (t, i) {
          t.removeAttribute('role');
          panels[i].removeAttribute('role');
        });
      }
      paint();
    }

    function select(i, focus) {
      /* accordion allows everything closed; tabs do not */
      open = (!wide.matches && i === open) ? -1 : i;
      paint();
      if (focus && tabs[i]) tabs[i].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        if (!wide.matches) return;         /* arrows are a tabs behaviour */
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = tabs.length - 1;
        if (n === null) return;
        e.preventDefault();
        select(n, true);
      });
    });

    if (wide.addEventListener) wide.addEventListener('change', mode);
    else if (wide.addListener) wide.addListener(mode);
    mode();
  });

  /* ---- customers: open on hover for mice, click/tap and keyboard for all ---
     <details> already handles click, touch and keyboard on its own. This only
     adds hover for devices that actually have a pointer, so touch users are
     never left with names they cannot reveal.                              */
  (function () {
    var groups = [].slice.call(document.querySelectorAll('.cgroup'));
    if (!groups.length) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    groups.forEach(function (d) {
      var held = false;                       /* a real click pins it open */
      d.addEventListener('pointerenter', function () { if (!held) d.open = true; });
      d.addEventListener('pointerleave', function () { if (!held) d.open = false; });
      d.addEventListener('toggle', function () { if (!d.open) held = false; });
      d.querySelector('summary').addEventListener('click', function (e) {
        /* Clicking something hover has already opened should PIN it, not
           close it. Only a click on an already-pinned group closes it. */
        if (d.open && !held) { e.preventDefault(); held = true; }
        else { held = !d.open; }
      });
    });
  })();

})();
