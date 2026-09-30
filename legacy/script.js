/* ==========================================================================
   Baby Steps Creche & Daycare — interactions
   Vanilla JS only. No libraries.
   Designed & built by Praise Francis
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ------------------------------------------------------------------
     1. IMAGE CONFIG — single place to swap every photo on the site.
     Keys match the data-img attribute in the HTML. The HTML carries the
     same URL as a no-JS fallback; this keeps config.js the source of truth.
     All URLs: https://images.unsplash.com/...?w=..&h=..&q=80&auto=format&fit=crop
  ------------------------------------------------------------------ */
  var IMAGES = {
    hero:   'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&h=1100&q=80&auto=format&fit=crop',
    about:  'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=900&h=1100&q=80&auto=format&fit=crop',
    prog1:  'https://images.unsplash.com/photo-1526634332515-d56c5fd16991?w=1000&h=580&q=80&auto=format&fit=crop',
    prog2:  'https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=800&h=500&q=80&auto=format&fit=crop',
    prog3:  'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=800&h=500&q=80&auto=format&fit=crop',
    quote:  'https://images.unsplash.com/photo-1587616211892-f743fcca64f9?w=700&h=930&q=80&auto=format&fit=crop',
    day1:   'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800&h=600&q=80&auto=format&fit=crop',
    day2:   'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&h=500&q=80&auto=format&fit=crop',
    fac1:   'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&h=640&q=80&auto=format&fit=crop',
    fac2:   'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=700&h=700&q=80&auto=format&fit=crop',
    fac3:   'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=700&h=930&q=80&auto=format&fit=crop',
    fac4:   'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800&h=600&q=80&auto=format&fit=crop',
    fac5:   'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=900&h=560&q=80&auto=format&fit=crop',
    fac6:   'https://images.unsplash.com/photo-1568480289356-5a75d0fd47fc?w=700&h=700&q=80&auto=format&fit=crop'
    // swap any URL above — nothing else needs to change.
  };

  function applyImageConfig() {
    $$('img[data-img]').forEach(function (img) {
      var url = IMAGES[img.getAttribute('data-img')];
      if (url && url !== img.getAttribute('src')) img.setAttribute('src', url);
      var reveal = function () { img.classList.add('loaded'); };
      if (img.complete && img.naturalWidth > 0) reveal();
      else {
        img.addEventListener('load', reveal, { once: true });
        img.addEventListener('error', function () { img.classList.add('loaded'); }, { once: true });
      }
    });
  }

  /* ------------------------------------------------------------------
     2. PAGE INTRO
  ------------------------------------------------------------------ */
  function intro() {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add('ready'); });
    });
  }

  /* ------------------------------------------------------------------
     3. HEADER + ACTIVE NAV + MOBILE MENU
  ------------------------------------------------------------------ */
  function header() {
    var head = $('#siteHeader');
    var onScroll = function () { head.classList.toggle('scrolled', window.scrollY > 14); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var links = $$('#navLinks a');
    var sections = links
      .map(function (a) { return $(a.getAttribute('href')); })
      .filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { io.observe(s); });
    }

    var burger = $('#burger'), menu = $('#mobileMenu');
    if (!burger || !menu) return;
    var close = function () {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('menu-open');
    };
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('menu-open', open);
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ------------------------------------------------------------------
     4. SCROLL REVEALS
  ------------------------------------------------------------------ */
  function reveals() {
    var els = $$('.rv, .rv-left, .rv-right, .rv-scale, .wipe, .wipe-up');
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var pending = [];
    var show = function (el) {
      el.classList.add('in');
      var i = pending.indexOf(el);
      if (i > -1) pending.splice(i, 1);
    };

    // Clipped (.wipe) elements report zero intersection while hidden, so we
    // observe their unclipped parent instead and reveal the children.
    var groups = new Map();
    var watch = function (target, elsForTarget) {
      if (!groups.has(target)) { groups.set(target, []); io.observe(target); }
      groups.get(target).push.apply(groups.get(target), elsForTarget);
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        (groups.get(e.target) || []).forEach(show);
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    els.forEach(function (el) {
      if (el.closest('.hero')) { el.classList.add('in'); return; } // hero handles its own intro
      pending.push(el);
      var clipped = el.classList.contains('wipe') || el.classList.contains('wipe-up');
      var target = (clipped && el.parentElement) ? el.parentElement : el;
      watch(target, [el]);
    });

    // safety net: nothing may ever stay invisible
    var ticking = false;
    var sweep = function () {
      ticking = false;
      var limit = window.innerHeight * 0.96;
      pending.slice().forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < limit && r.bottom > -40) show(el);
      });
    };
    var queue = function () {
      if (ticking || !pending.length) return;
      ticking = true;
      requestAnimationFrame(sweep);
    };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    window.addEventListener('load', queue);
    setTimeout(sweep, 400);
  }

  /* ------------------------------------------------------------------
     5. ANIMATED COUNTERS
  ------------------------------------------------------------------ */
  function counters() {
    var els = $$('[data-count]');
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in window)) return;

    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1400, t0 = performance.now();
      var tick = function (now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0' + suffix;
      requestAnimationFrame(tick);
    };

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     6. FAQ ACCORDION (smooth height)
  ------------------------------------------------------------------ */
  function faq() {
    var items = $$('.faq-item');
    if (!items.length) return;

    var setOpen = function (item, open) {
      var panel = $('.faq-a', item);
      var btn = $('.faq-q', item);
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    };

    items.forEach(function (item) {
      setOpen(item, item.classList.contains('open'));
      $('.faq-q', item).addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        items.forEach(function (other) { if (other !== item) setOpen(other, false); });
        setOpen(item, !isOpen);
      });
    });

    window.addEventListener('resize', function () {
      items.forEach(function (item) {
        if (item.classList.contains('open')) {
          $('.faq-a', item).style.maxHeight = $('.faq-a', item).scrollHeight + 'px';
        }
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     7. CONTACT FORM (validation + success state)
  ------------------------------------------------------------------ */
  function form() {
    var f = $('#contactForm');
    if (!f) return;
    var success = $('#formSuccess');
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var fieldOf = function (input) { return input.closest('[data-field]'); };
    var validate = function (input) {
      var wrap = fieldOf(input);
      if (!wrap) return true;
      var v = input.value.trim();
      var ok = true;
      if (input.hasAttribute('required') && !v) ok = false;
      if (ok && input.type === 'email' && v && !emailRe.test(v)) ok = false;
      if (ok && input.type === 'tel' && v && v.replace(/[^\d]/g, '').length < 6) ok = false;
      wrap.classList.toggle('invalid', !ok);
      return ok;
    };

    $$('input, textarea', f).forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        var wrap = fieldOf(input);
        if (wrap && wrap.classList.contains('invalid')) validate(input);
      });
    });

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = $$('input[required]', f);
      var ok = true;
      fields.forEach(function (i) { if (!validate(i)) ok = false; });
      if (!ok) {
        var first = $('.field.invalid input', f);
        if (first) first.focus();
        return;
      }
      success.classList.add('show');
      f.reset();
    });

    var reset = $('#formReset');
    if (reset) {
      reset.addEventListener('click', function () {
        success.classList.remove('show');
        $$('.field', f).forEach(function (w) { w.classList.remove('invalid'); });
        var first = $('input', f);
        if (first) first.focus();
      });
    }
  }

  /* ------------------------------------------------------------------
     8. MOTION LAYER — magnetic buttons, parallax, cursor glow
  ------------------------------------------------------------------ */
  function motion() {
    if (reduced) return;

    // magnetic CTAs (fine pointers only)
    if (finePointer) {
      $$('[data-magnetic]').forEach(function (el) {
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) * 0.22;
          var y = (e.clientY - r.top - r.height / 2) * 0.32;
          el.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)';
        });
        el.addEventListener('mouseleave', function () { el.style.transform = ''; });
      });

      // cursor-follow glow
      var glow = $('.cursor-glow');
      if (glow) {
        var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
        var cx = tx, cy = ty, raf = null;
        var loop = function () {
          cx += (tx - cx) * 0.14;
          cy += (ty - cy) * 0.14;
          glow.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
          raf = requestAnimationFrame(loop);
        };
        window.addEventListener('mousemove', function (e) {
          tx = e.clientX; ty = e.clientY;
          glow.classList.add('on');
          if (!raf) raf = requestAnimationFrame(loop);
        }, { passive: true });
        document.addEventListener('mouseleave', function () { glow.classList.remove('on'); });
      }
    }

    // slow parallax on hero decoration
    var shapes = $$('[data-parallax]');
    if (shapes.length) {
      var ticking = false;
      var apply = function () {
        var y = window.scrollY;
        shapes.forEach(function (el) {
          var s = parseFloat(el.getAttribute('data-parallax')) || 0;
          el.style.transform = 'translate3d(0,' + (y * s).toFixed(1) + 'px,0)';
        });
        ticking = false;
      };
      window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(apply); }
      }, { passive: true });
      apply();
    }
  }

  /* ------------------------------------------------------------------
     9. SIGNATURE INTERACTION — footsteps trail that draws on scroll
     Desktop only. Hidden below 1240px and under prefers-reduced-motion.
  ------------------------------------------------------------------ */
  function footsteps() {
    var host = $('#steps');
    var svg = $('#stepsSvg');
    if (!host || !svg) return;
    if (reduced) { host.remove(); return; }

    var NS = 'http://www.w3.org/2000/svg';
    var FOOT = 'M12 2C8 2 6 6 6 10c0 3 1.2 4.5 1.2 7 0 4-2.8 5-2.8 8.5 0 1.5 1.2 2.5 3 2.5 3 0 4.6-2 4.6-2s1.6 2 4.6 2c1.8 0 3-1 3-2.5 0-3.5-2.8-4.5-2.8-8.5 0-2.5 1.2-4 1.2-7 0-4-2-8-6-8z';
    var COLORS = ['#E8266F', '#0FA79A', '#FFC94A'];

    var maskPath, trailPath, prints = [], pathEl, total = 0;
    var yStart = 0, yEnd = 1, built = false;

    function build() {
      svg.innerHTML = '';
      prints = [];
      built = false;

      var w = window.innerWidth;
      var gutter = (w - 1180) / 2;
      if (gutter < 34) { host.classList.remove('on'); return; }

      var docH = document.documentElement.scrollHeight;
      host.style.height = docH + 'px';
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + docH);

      var hero = $('.hero'), contact = $('#contact');
      if (!hero || !contact) return;
      yStart = hero.offsetTop + hero.offsetHeight * 0.58;
      yEnd = contact.offsetTop + contact.offsetHeight * 0.42;
      if (yEnd - yStart < 400) { host.classList.remove('on'); return; }

      var contentLeft = gutter + 32;
      var xMin = Math.max(10, gutter * 0.22);
      var xMax = contentLeft - 24;
      if (xMax - xMin < 34) xMin = Math.max(8, xMax - 34);

      var steps = Math.max(8, Math.min(16, Math.round((yEnd - yStart) / 340)));
      var seg = (yEnd - yStart) / steps;

      var d = 'M ' + xMin.toFixed(1) + ' ' + yStart.toFixed(1);
      var prevX = xMin, prevY = yStart;
      for (var i = 1; i <= steps; i++) {
        var y = yStart + seg * i;
        var x = (i % 2 === 1) ? xMax : xMin;
        d += ' C ' + prevX.toFixed(1) + ' ' + (prevY + seg * 0.5).toFixed(1) +
             ', ' + x.toFixed(1) + ' ' + (y - seg * 0.5).toFixed(1) +
             ', ' + x.toFixed(1) + ' ' + y.toFixed(1);
        prevX = x; prevY = y;
      }

      // mask that reveals the trail progressively
      var defs = document.createElementNS(NS, 'defs');
      var mask = document.createElementNS(NS, 'mask');
      mask.setAttribute('id', 'trailMask');
      mask.setAttribute('maskUnits', 'userSpaceOnUse');
      maskPath = document.createElementNS(NS, 'path');
      maskPath.setAttribute('d', d);
      maskPath.setAttribute('fill', 'none');
      maskPath.setAttribute('stroke', '#fff');
      maskPath.setAttribute('stroke-width', '44');
      maskPath.setAttribute('stroke-linecap', 'round');
      mask.appendChild(maskPath);
      defs.appendChild(mask);
      svg.appendChild(defs);

      var g = document.createElementNS(NS, 'g');
      g.setAttribute('mask', 'url(#trailMask)');
      trailPath = document.createElementNS(NS, 'path');
      trailPath.setAttribute('d', d);
      trailPath.setAttribute('class', 'trail');
      g.appendChild(trailPath);
      svg.appendChild(g);

      pathEl = trailPath;
      total = pathEl.getTotalLength();
      maskPath.setAttribute('stroke-dasharray', total + ' ' + total);
      maskPath.setAttribute('stroke-dashoffset', total);

      // footprints along the path, alternating left / right
      var count = Math.max(10, Math.min(52, Math.round(total / 118)));
      var fpLayer = document.createElementNS(NS, 'g');
      for (var k = 0; k < count; k++) {
        var f = (k + 1) / count;
        var pt = pathEl.getPointAtLength(f * total);
        var pt2 = pathEl.getPointAtLength(Math.min(total, f * total + 2));
        var dx = pt2.x - pt.x, dy = pt2.y - pt.y;
        var angle = Math.atan2(dx, -dy) * 180 / Math.PI;
        var side = (k % 2 === 0) ? 1 : -1;

        var grp = document.createElementNS(NS, 'g');
        grp.setAttribute('class', 'fp');
        grp.setAttribute('transform',
          'translate(' + pt.x.toFixed(1) + ',' + pt.y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ')');
        var inner = document.createElementNS(NS, 'g');
        inner.setAttribute('transform', 'scale(' + (0.62 * side).toFixed(3) + ',0.62) translate(-12,-15)');
        var p = document.createElementNS(NS, 'path');
        p.setAttribute('d', FOOT);
        p.setAttribute('fill', COLORS[k % COLORS.length]);
        inner.appendChild(p);
        grp.appendChild(inner);
        fpLayer.appendChild(grp);
        prints.push({ el: grp, f: f });
      }
      svg.appendChild(fpLayer);

      built = true;
      update();
    }

    function update() {
      if (!built) return;
      var line = window.scrollY + window.innerHeight * 0.82;
      var p = (line - yStart) / (yEnd - yStart);
      p = p < 0 ? 0 : (p > 1 ? 1 : p);

      maskPath.setAttribute('stroke-dashoffset', (total * (1 - p)).toFixed(1));

      for (var i = 0; i < prints.length; i++) {
        var on = p >= prints[i].f - 0.01;
        if (on !== prints[i].on) {
          prints[i].on = on;
          prints[i].el.classList.toggle('on', on);
        }
      }
      host.classList.add('on');
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { update(); ticking = false; });
    }, { passive: true });

    var rt;
    var rebuild = function () {
      clearTimeout(rt);
      rt = setTimeout(build, 220);
    };
    window.addEventListener('resize', rebuild);
    window.addEventListener('load', rebuild);

    if ('ResizeObserver' in window) {
      var lastH = 0;
      new ResizeObserver(function () {
        var h = document.documentElement.scrollHeight;
        if (Math.abs(h - lastH) > 40) { lastH = h; rebuild(); }
      }).observe(document.body);
    }

    build();
  }

  /* ------------------------------------------------------------------ */
  function init() {
    applyImageConfig();
    intro();
    header();
    reveals();
    counters();
    faq();
    form();
    motion();
    footsteps();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
