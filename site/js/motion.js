/* Motion behaviours. Progressive enhancement only — if this file fails to load
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

})();
