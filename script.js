/* Ushna & Usama — Royal Wedding
   Countdown to Baraat: 2026-12-17T19:00:00+05:00 (7:00 PM PKT)
   Three.js gold dust, 3D tilt cards, scroll reveal, lightbox, RSVP (localStorage + mailto) */
(function () {
  'use strict';

  /* ---------- Invitation card images (embedded once in #card-images) ---------- */
  var cardImages = {};
  try { var cardJson = document.getElementById('card-images'); if (cardJson) cardImages = JSON.parse(cardJson.textContent); } catch (err) { cardImages = {}; }
  document.querySelectorAll('img[data-card]').forEach(function (img) {
    var u = cardImages[img.getAttribute('data-card')];
    if (u) img.src = u;
  });

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() { if (preloader) preloader.classList.add('done'); }
  window.addEventListener('load', function () { setTimeout(hidePreloader, 900); });
  setTimeout(hidePreloader, 3500); // never trap the visitor

  /* ---------- Sticky nav + mobile menu ---------- */
  var nav = document.querySelector('.nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.textContent = open ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.textContent = '☰';
      });
    });
  }

  /* ---------- Countdown (Baraat) ---------- */
  var target = new Date('2026-12-17T19:00:00+05:00').getTime();
  var pad = function (n) { return String(n).padStart(2, '0'); };
  function tick() {
    var diff = target - Date.now();
    var d = 0, h = 0, m = 0, s = 0;
    if (diff > 0) {
      d = Math.floor(diff / 86400000);
      h = Math.floor(diff / 3600000) % 24;
      m = Math.floor(diff / 60000) % 60;
      s = Math.floor(diff / 1000) % 60;
    }
    [['cd-d', d], ['cd-h', h], ['cd-m', m], ['cd-s', s],
     ['cd2-d', d], ['cd2-h', h], ['cd2-m', m], ['cd2-s', s]].forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (el) el.textContent = pad(pair[1]);
    });
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 3D tilt on event cards ---------- */
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  document.querySelectorAll('[data-tilt]').forEach(function (card) {
    if (!finePointer) return;
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () { card.style.transform = ''; });
  });

  /* ---------- Hero parallax ---------- */
  var heroContent = document.querySelector('.hero-content');
  var heroRing = document.querySelector('.hero-ring');
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (y < window.innerHeight && heroContent) {
      heroContent.style.transform = 'translateY(' + (y * 0.18) + 'px)';
      heroContent.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
      if (heroRing) heroRing.style.transform = 'translate(-50%,-50%) rotate(' + (y * 0.02) + 'deg)';
    }
  }, { passive: true });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  function openLightbox(src, caption, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || caption;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }
  document.querySelectorAll('.gallery-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var img = btn.querySelector('img');
      openLightbox(cardImages[btn.getAttribute('data-full-card')] || btn.getAttribute('data-full'), btn.getAttribute('data-caption'), img ? img.alt : '');
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lightbox && !lightbox.hidden) closeLightbox(); });

  /* ---------- RSVP ---------- */
  var form = document.getElementById('rsvpForm');
  var success = document.getElementById('rsvpSuccess');
  var formError = document.getElementById('formError');
  var successText = document.getElementById('successText');
  var successDetail = document.getElementById('successDetail');
  var mailtoBtn = document.getElementById('mailtoBtn');
  var rsvpAgain = document.getElementById('rsvpAgain');

  var submitBtn = document.getElementById('rsvpSubmit');
  var sendError = document.getElementById('sendError');

  /* RSVPs are sent automatically to the families at isuya01@gmail.com
     (FormSubmit — no account, no email address needed from the guest).
     The first submission triggers a one-time activation email to that
     inbox; until it is confirmed, FormSubmit holds new RSVPs. */
  var RSVP_ENDPOINT = 'https://formsubmit.co/ajax/isuya01@gmail.com';

  function showRsvpResult(name, attending, guests, message, sent) {
    if (sent) {
      successText.textContent = 'Thank you, ' + name + '! Your RSVP has been sent to the families. We look forward to celebrating with you in Multan.';
      if (mailtoBtn) mailtoBtn.hidden = true;
      if (sendError) sendError.hidden = true;
    } else {
      successText.textContent = 'Thank you, ' + name + '! Your RSVP is saved on this device, but it did not reach the families yet — please tap below to send it by email instead.';
      if (mailtoBtn) mailtoBtn.hidden = false;
      if (sendError) sendError.hidden = false;
    }
    successDetail.textContent = attending.value + '  •  ' + guests + (guests === '1' ? ' guest' : ' guests') +
      (message ? '  •  “' + message + '”' : '');
    var subject = encodeURIComponent('RSVP — Ushna & Usama Wedding — ' + name);
    var body = encodeURIComponent(
      'RSVP for the wedding of Ushna Irfan & Usama Zia\n\n' +
      'Name: ' + name + '\nAttending: ' + attending.value + '\nGuests: ' + guests +
      (message ? '\nMessage: ' + message : '') +
      '\n\nBaraat — Thursday 17 December 2026, 7:00 PM, Evention Marquee Multan\n' +
      'Walima — Sunday 20 December 2026, 7:00 PM, BJ Lawn Marriage Hall, Multan'
    );
    mailtoBtn.href = 'mailto:isuya01@gmail.com?subject=' + subject + '&body=' + body;
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('rsvpName').value.trim();
      var attending = form.querySelector('input[name="attending"]:checked');
      var guests = document.getElementById('rsvpGuests').value;
      var message = document.getElementById('rsvpMessage').value.trim();
      if (!name || !attending) {
        if (formError) formError.hidden = false;
        if (!name) document.getElementById('rsvpName').focus();
        return;
      }
      if (formError) formError.hidden = true;
      if (sendError) sendError.hidden = true;
      var rsvp = {
        name: name, attending: attending.value, guests: guests, message: message,
        submittedAt: new Date().toISOString(), event: 'Ushna & Usama Wedding — Multan, December 2026'
      };
      try {
        var all = JSON.parse(localStorage.getItem('ushna-usama-rsvps') || '[]');
        all.push(rsvp);
        localStorage.setItem('ushna-usama-rsvps', JSON.stringify(all));
        localStorage.setItem('ushna-usama-rsvp-latest', JSON.stringify(rsvp));
      } catch (err) { /* private mode: confirmation still shows */ }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      var fd = new FormData(form);
      fd.set('_subject', 'New RSVP — Ushna & Usama Wedding');
      fd.set('_template', 'table');
      fd.set('_captcha', 'false');
      var done = false;
      function finish(sent) {
        if (done) return;
        done = true;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send RSVP'; }
        showRsvpResult(name, attending, guests, message, sent);
      }
      setTimeout(function () { finish(false); }, 12000); // give up after 12s, keep the mailto fallback
      fetch(RSVP_ENDPOINT, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } })
        .then(function (res) { return res.json().catch(function () { return {}; }); })
        .then(function (data) { finish(data && (data.success === 'true' || data.success === true)); })
        .catch(function () { finish(false); });
    });
  }
  if (rsvpAgain) {
    rsvpAgain.addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      form.reset();
      document.getElementById('rsvpName').focus();
    });
  }

  /* ---------- Three.js golden particle field ---------- */
  try {
    if (window.THREE) {
      var canvas = document.getElementById('gold-dust');
      var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 8;
      var count = 420;
      var positions = new Float32Array(count * 3);
      var speeds = new Float32Array(count);
      for (var i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        speeds[i] = 0.0015 + Math.random() * 0.004;
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      var mat = new THREE.PointsMaterial({
        color: 0xd4af37, size: 0.075, transparent: true, opacity: 0.85,
        sizeAttenuation: true, depthWrite: false
      });
      var points = new THREE.Points(geo, mat);
      scene.add(points);
      function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener('resize', resize);
      var mouseX = 0, mouseY = 0;
      document.addEventListener('mousemove', function (e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.6;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
      }, { passive: true });
      (function animate() {
        requestAnimationFrame(animate);
        var pos = geo.attributes.position.array;
        for (var j = 0; j < count; j++) {
          pos[j * 3 + 1] += speeds[j];
          if (pos[j * 3 + 1] > 7) pos[j * 3 + 1] = -7;
        }
        geo.attributes.position.needsUpdate = true;
        points.rotation.y += 0.0006;
        points.rotation.x += (mouseY * 0.25 - points.rotation.x) * 0.02;
        points.rotation.y += (mouseX * 0.25) * 0.01;
        renderer.render(scene, camera);
      })();
    }
  } catch (err) { /* gold dust is decorative — the site works without it */ }
})();
