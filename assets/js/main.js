/* Paintium site — theme toggle, mobile nav, screenshot lightbox. */
(function () {
  'use strict';

  var root = document.documentElement;

  // ---- Theme-aware screenshots ---------------------------------------
  // Swaps every .theme-shot <img> between its light/dark capture so screenshots always
  // match whichever theme the page is currently in (not just the visitor's OS preference).
  function applyThemeShots() {
    var dark = root.dataset.theme === 'dark';
    document.querySelectorAll('.theme-shot').forEach(function (img) {
      var wanted = dark ? img.dataset.dark : img.dataset.light;
      if (wanted && img.getAttribute('src') !== wanted) img.src = wanted;
    });

    // The "opposite theme" showcase card always demos whichever theme the visitor ISN'T
    // currently in (its image data-light/data-dark are pre-swapped in the HTML) -- update
    // its label to match what's actually being shown.
    var oppositeCard = document.querySelector('.shot-opposite-theme');
    if (oppositeCard) {
      var showingLabel = dark ? 'Light theme' : 'Dark theme';
      var caption = 'Paintium in ' + showingLabel.toLowerCase();
      var oppositeImg = oppositeCard.querySelector('img');
      var oppositeCaption = oppositeCard.querySelector('figcaption');
      if (oppositeImg) oppositeImg.alt = caption;
      if (oppositeCaption) oppositeCaption.textContent = showingLabel;
      oppositeCard.dataset.caption = caption;
    }
  }
  applyThemeShots();

  // ---- Theme toggle -------------------------------------------------
  var themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('paintium-theme', next);
      applyThemeShots();
    });
  }

  // ---- Mobile nav ---------------------------------------------------
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Screenshot lightbox ------------------------------------------
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbClose = document.getElementById('lb-close');
  var lastFocus = null;

  function openLightbox(fig) {
    var img = fig.querySelector('img');
    if (!img) return;
    lastFocus = document.activeElement;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = fig.dataset.caption || img.alt || '';
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lb.hidden = true;
    lbImg.src = '';
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('.gallery .shot').forEach(function (fig) {
    fig.tabIndex = 0;
    fig.setAttribute('role', 'button');
    fig.addEventListener('click', function () { openLightbox(fig); });
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(fig);
      }
    });
  });

  if (lb) {
    lbClose.addEventListener('click', closeLightbox);
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.tagName === 'FIGURE') closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lb.hidden) closeLightbox();
    });
  }

  // ---- Footer year ---------------------------------------------------
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
