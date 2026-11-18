/* ARx Media website — interactions (no dependencies) */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Parallax mousemove (hero sections) ---------- */
  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    var raf = 0;
    function set(x, y) { el.style.setProperty('--mx', x.toFixed(3)); el.style.setProperty('--my', y.toFixed(3)); }
    el.addEventListener('mousemove', function (e) {
      if (reduce) return;
      var cx = e.clientX, cy = e.clientY;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var r = el.getBoundingClientRect();
        set((cx - r.left) / r.width - 0.5, (cy - r.top) / r.height - 0.5);
      });
    });
    el.addEventListener('mouseleave', function () { if (raf) cancelAnimationFrame(raf); set(0, 0); });
  });

  /* ---------- Image lightbox (Screens and moments) ---------- */
  var shots = Array.prototype.slice.call(document.querySelectorAll('[data-lb]'));
  if (shots.length) {
    var items = shots.map(function (b) {
      var img = b.querySelector('img');
      var fig = b.closest('figure');
      var cap = fig && fig.querySelector('figcaption');
      return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', cap: cap ? cap.textContent : (img.getAttribute('alt') || '') };
    });
    var cur = 0, lastFocus = null, box = null;
    var BTN = 'display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:999px;background:transparent;border:1px solid rgba(255,255,255,0.3);color:#FAFAFA;cursor:pointer';
    var many = items.length > 1;
    function build() {
      box = document.createElement('div');
      box.className = 'arx-lb';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.style.cssText = 'position:fixed;inset:0;z-index:1000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;box-sizing:border-box;padding:72px clamp(16px,6vw,96px) 40px;background:rgba(3,3,3,0.94);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)';
      box.innerHTML =
        '<button type="button" class="arx-lb-btn" data-act="close" aria-label="Close enlarged image" style="position:absolute;top:18px;right:18px;' + BTN + '"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"></path></svg></button>' +
        '<img class="arx-lb-img" alt="" style="display:block;max-width:100%;max-height:calc(100vh - 190px);width:auto;height:auto;object-fit:contain;border-radius:10px;box-shadow:0 30px 80px rgba(0,0,0,0.6)">' +
        '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 24px;color:#C4C4C4">' +
        (many ? '<button type="button" class="arx-lb-btn" data-act="prev" aria-label="Previous image" style="' + BTN + '"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M10 3L5 8l5 5"></path></svg></button>' : '') +
        '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;min-width:180px;text-align:center"><span data-cap style="font-size:15px;color:#FAFAFA"></span><span data-lbcount style="font-size:12px;font-weight:500;letter-spacing:0.22em;text-transform:uppercase;color:#8A8A8A"></span></div>' +
        (many ? '<button type="button" class="arx-lb-btn" data-act="next" aria-label="Next image" style="' + BTN + '"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 3l5 5-5 5"></path></svg></button>' : '') +
        '</div>';
      box.addEventListener('click', function (e) {
        var a = e.target.closest('[data-act]');
        if (a) { var act = a.getAttribute('data-act'); if (act === 'close') close(); else go(cur + (act === 'next' ? 1 : -1)); return; }
        if (e.target === box) close();
      });
      box.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') go(cur + 1);
        else if (e.key === 'ArrowLeft') go(cur - 1);
        else if (e.key === 'Tab') { // keep focus inside the dialog
          var f = box.querySelectorAll('button'); var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
    function render() {
      var it = items[cur];
      var img = box.querySelector('img');
      img.src = it.src; img.alt = it.alt;
      img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
      box.querySelector('[data-cap]').textContent = it.cap;
      box.querySelector("[data-lbcount]").textContent = (cur + 1) + ' / ' + items.length;
      box.setAttribute('aria-label', 'Enlarged image: ' + it.cap);
    }
    function go(k) { cur = ((k % items.length) + items.length) % items.length; render(); }
    function open(k) {
      if (!box) build();
      lastFocus = document.activeElement;
      cur = k; render();
      document.body.appendChild(box);
      document.documentElement.style.overflow = 'hidden';
      box.querySelector('[data-act="close"]').focus();
    }
    function close() {
      if (box && box.parentNode) box.parentNode.removeChild(box);
      document.documentElement.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    shots.forEach(function (b, k) { b.addEventListener('click', function () { open(k); }); });
  }

  /* ---------- Portfolio filter ---------- */
  var filters = document.querySelectorAll('[data-filter]');
  if (filters.length) {
    var cards = document.querySelectorAll('[data-cat]');
    var count = document.querySelector('[data-count]');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-filter');
        filters.forEach(function (b) {
          var on = b === btn;
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          b.style.background = on ? '#FAFAFA' : 'transparent';
          b.style.color = on ? '#050505' : '#FAFAFA';
          b.style.borderColor = on ? '#FAFAFA' : 'rgba(255,255,255,0.28)';
        });
        var n = 0;
        cards.forEach(function (c) {
          var show = cat === 'All' || c.getAttribute('data-cat') === cat;
          c.style.display = show ? '' : 'none';
          if (show) n++;
        });
        if (count) count.textContent = n + (n === 1 ? ' project' : ' projects');
      });
    });
  }

  /* ---------- Contact / enquiry forms ----------
     FORM_ENDPOINT: paste a form-service URL here (for example
     'https://formspree.io/f/abcdwxyz') and applications are sent
     straight to your inbox. Left empty, the form opens the visitor's
     email app with the message filled in, addressed to FORM_EMAIL. */
  var FORM_ENDPOINT = '';
  var FORM_EMAIL = 'admin@arxmedia.co';
  document.querySelectorAll('[data-arx-form]').forEach(function (form) {
    var status = form.querySelector('.arx-form-status');
    var btn = form.querySelector('button[type="submit"]');
    function say(msg, ok) { if (status) { status.textContent = msg; status.style.color = ok === false ? '#FF8A80' : (ok ? '#FAFAFA' : '#A3A3A3'); } }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) { say('Please fill in the highlighted fields.', false); return; }
      var d = new FormData(form);
      if (d.get('_gotcha')) return; // spam trap
      var name = d.get('name'), topic = d.get('topic');
      var subject = 'Website enquiry: ' + topic + ' - ' + name;
      if (FORM_ENDPOINT) {
        d.append('_subject', subject);
        d.append('page', location.pathname);
        btn.disabled = true; say('Sending...');
        fetch(FORM_ENDPOINT, { method: 'POST', body: d, headers: { Accept: 'application/json' } })
          .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); say('Thank you, ' + name + '! Your message is on its way. We will be in touch soon.', true); })
          .catch(function () { say('Sorry, that did not go through. Please email ' + FORM_EMAIL + ' instead.', false); })
          .then(function () { btn.disabled = false; });
      } else {
        var body = ['Name: ' + name, 'Email: ' + d.get('email'), 'Phone: ' + (d.get('phone') || '-'), 'Company: ' + (d.get('company') || '-'), 'Topic: ' + topic, '', d.get('message')].join('\n');
        location.href = 'mailto:' + FORM_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        say('Your email app should open with your message ready. Just press send.', true);
      }
    });
  });

  /* ---------- YouTube player (ISEKAI ZERO page) ---------- */
  var player = document.querySelector('[data-yt-player]');
  if (player) {
    var list = Array.prototype.slice.call(document.querySelectorAll('[data-yt]'));
    var titleEl = document.querySelector('[data-yt-title]');
    var watchEl = document.querySelector('[data-yt-watch]');
    var current = list.length ? list[0].getAttribute('data-yt') : null;
    function play(id, name) {
      current = id;
      player.querySelectorAll('iframe, [data-yt-play]').forEach(function (n) { n.remove(); });
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
      f.title = name;
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      f.allowFullscreen = true;
      f.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0';
      player.appendChild(f);
      if (titleEl) titleEl.textContent = name;
      if (watchEl) watchEl.href = 'https://www.youtube.com/watch?v=' + id;
      list.forEach(function (b) {
        var on = b.getAttribute('data-yt') === id;
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.style.background = on ? 'rgba(255,193,7,0.12)' : 'rgba(26,13,107,0.35)';
        b.style.borderColor = on ? 'rgba(255,193,7,0.7)' : 'rgba(255,193,7,0.18)';
      });
    }
    var startBtn = player.querySelector('[data-yt-play]');
    if (startBtn) startBtn.addEventListener('click', function () {
      var b = list.filter(function (x) { return x.getAttribute('data-yt') === current; })[0];
      play(current, b ? b.getAttribute('data-yt-name') : '');
    });
    list.forEach(function (b) {
      b.addEventListener('click', function () { play(b.getAttribute('data-yt'), b.getAttribute('data-yt-name')); });
    });
  }
})();
