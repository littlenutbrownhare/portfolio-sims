/* Mafy Hidalgo portfolio — shared runtime
   - Image slots: click or drag-drop an image, saved to localStorage so previews persist.
   - Nav: injected once so every page stays in sync.
   - Footer year: filled automatically.
*/
(function () {
  'use strict';

  var SLOT_STORE = 'mafy-slots';

  function loadSlots() {
    try { return JSON.parse(localStorage.getItem(SLOT_STORE) || '{}'); }
    catch (e) { return {}; }
  }
  function saveSlot(id, dataUrl) {
    var all = loadSlots();
    all[id] = dataUrl;
    try { localStorage.setItem(SLOT_STORE, JSON.stringify(all)); }
    catch (e) { /* quota; preview still shows for this session */ }
  }

  function renderSlot(el, dataUrl) {
    el.innerHTML = '';
    if (dataUrl) {
      var img = document.createElement('img');
      img.src = dataUrl;
      img.alt = el.getAttribute('data-alt') || '';
      var fit = el.getAttribute('data-fit');
      img.style.objectFit = fit === 'contain' ? 'contain' : 'cover';
      el.appendChild(img);
    } else {
      var ph = document.createElement('span');
      ph.className = 'slot__ph';
      ph.textContent = el.getAttribute('data-placeholder') || 'Drop an image';
      el.appendChild(ph);
    }
  }

  function readFile(file, cb) {
    if (!file || !/^image\//.test(file.type)) return;
    var fr = new FileReader();
    fr.onload = function () { cb(fr.result); };
    fr.readAsDataURL(file);
  }

  function initSlots() {
    var saved = loadSlots();
    document.querySelectorAll('[data-slot]').forEach(function (el) {
      if (el.__slotReady) return;
      el.__slotReady = true;
      var id = el.getAttribute('data-slot');
      el.setAttribute('type', 'button');
      el.setAttribute('aria-label', 'Upload image: ' + (el.getAttribute('data-placeholder') || id));
      renderSlot(el, saved[id]);

      el.addEventListener('click', function () {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', function () {
          readFile(input.files[0], function (dataUrl) {
            saveSlot(id, dataUrl);
            renderSlot(el, dataUrl);
          });
        });
        input.click();
      });

      el.addEventListener('dragover', function (e) {
        e.preventDefault();
        el.classList.add('is-dragover');
      });
      el.addEventListener('dragleave', function () { el.classList.remove('is-dragover'); });
      el.addEventListener('drop', function (e) {
        e.preventDefault();
        el.classList.remove('is-dragover');
        readFile(e.dataTransfer.files[0], function (dataUrl) {
          saveSlot(id, dataUrl);
          renderSlot(el, dataUrl);
        });
      });
    });
  }

  /* ---------- Shared nav ---------- */
  var NAV_LINKS = [
    { href: 'village.html', label: '\uD83D\uDC07 Village map', cls: 'is-village' },
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'about.html', label: 'About', key: 'about' },
    { href: 'skills.html', label: 'Skills', key: 'skills' },
    { href: 'projects.html', label: 'Projects', key: 'projects' },
    { href: 'case-studies.html', label: 'SEO Results', key: 'results' },
    { href: 'testimonials.html', label: 'Kind Words', key: 'words' },
    { href: 'contact.html', label: 'Contact', cls: 'is-contact', key: 'contact' }
  ];

  function buildNav() {
    var mount = document.querySelector('[data-nav]');
    if (!mount) return;
    var active = mount.getAttribute('data-nav') || '';
    var links = NAV_LINKS.map(function (l) {
      var cls = l.cls ? ' ' + l.cls : '';
      if (l.key && l.key === active) cls += ' is-active';
      return '<a href="' + l.href + '" class="' + cls.trim() + '">' + l.label + '</a>';
    }).join('');
    mount.innerHTML =
      '<a href="index.html" class="nav__brand"><span>mafy</span> hidalgo</a>' +
      '<div class="nav__links">' + links + '</div>';
    mount.className = 'nav';
  }

  function fillYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  window.__initSlotsAgain = initSlots;

  ready(function () {
    buildNav();
    initSlots();
    fillYear();
  });
})();
