/* SEO audit counter — deterministic demo report keyed off the URL.
   Ported from the original Claude Design component. Same hash, same scoring,
   so the same URL always yields the same "receipt". */
(function () {
  'use strict';

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return Math.abs(h >>> 0);
  }

  function buildReport(url) {
    var h = hash(url.toLowerCase().trim());
    var r = function (n, m) { return Math.floor(h / (m + 1)) % n; };
    var titleLen = 38 + r(40, 1);
    var metaOk = r(3, 2) !== 0;
    var h1 = r(3, 3);
    var alts = r(14, 4);
    var lcp = (1.4 + r(32, 5) / 10).toFixed(1);
    var cls = (r(30, 6) / 100).toFixed(2);
    var inp = 90 + r(300, 7);
    var links = 40 + r(200, 8);
    var broken = r(6, 9);
    var canon = r(4, 10) !== 0;

    var score = 100;
    if (titleLen > 60) score -= 8;
    if (!metaOk) score -= 10;
    if (h1 !== 1) score -= 9;
    score -= Math.min(15, alts);
    if (lcp > 2.5) score -= 12;
    if (cls > 0.1) score -= 8;
    if (inp > 200) score -= 6;
    score -= broken * 3;
    if (!canon) score -= 7;
    score = Math.max(31, score);

    var ok = '\u2713', bad = '\u2715', warn = '!';
    return {
      score: score,
      lines: [
        { mark: '\u2192', text: 'Fetching ' + url + ' \u2026 200 OK in 0.' + (3 + r(6, 11)) + 's' },
        { mark: titleLen > 60 ? warn : ok, text: 'Title tag: ' + titleLen + ' chars' + (titleLen > 60 ? ' (over 60, truncates in results)' : '') },
        { mark: metaOk ? ok : bad, text: metaOk ? 'Meta description: present and unique' : 'Meta description: missing' },
        { mark: h1 === 1 ? ok : warn, text: 'H1 headings found: ' + h1 },
        { mark: alts ? warn : ok, text: 'Images missing alt text: ' + alts },
        { mark: (lcp > 2.5 || cls > 0.1) ? warn : ok, text: 'Core Web Vitals: LCP ' + lcp + 's \u00b7 CLS ' + cls + ' \u00b7 INP ' + inp + 'ms' },
        { mark: canon ? ok : bad, text: canon ? 'Indexable, canonical self-referencing' : 'Canonical points elsewhere' },
        { mark: broken ? warn : ok, text: 'Internal links: ' + links + ' \u00b7 broken: ' + broken }
      ]
    };
  }

  function grade(score) {
    if (score >= 80) return 'Solid foundation. Next: content and links.';
    if (score >= 60) return 'Fixable in a sprint. I have seen worse.';
    return 'This is why you called me.';
  }

  function init() {
    var form = document.getElementById('audit-form');
    if (!form) return;
    var input = document.getElementById('audit-url');
    var button = document.getElementById('audit-btn');
    var out = document.getElementById('audit-lines');
    var idle = document.getElementById('audit-idle');
    var result = document.getElementById('audit-result');
    var gradeEl = document.getElementById('audit-grade');
    var scoreEl = document.getElementById('audit-score');
    var dateEl = document.getElementById('audit-date');
    var running = false, timer = null;

    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var url = input.value.trim();
      if (!url || running) return;
      clearTimeout(timer);
      url = url.replace(/^https?:\/\//, '');

      var report = buildReport(url);
      out.innerHTML = '';
      if (idle) idle.style.display = 'none';
      if (result) result.style.display = 'none';
      running = true;
      button.textContent = 'Checking\u2026';

      var cursor = document.createElement('span');
      cursor.className = 'audit-cursor';

      var i = 0;
      function step() {
        var line = report.lines[i];
        var row = document.createElement('div');
        row.className = 'audit-line';
        row.innerHTML = '<span class="audit-mark">' + line.mark + '</span><span>' + line.text + '</span>';
        out.appendChild(row);
        i++;
        if (i < report.lines.length) {
          out.appendChild(cursor);
          timer = setTimeout(function () {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            step();
          }, 380 + Math.random() * 250);
        } else {
          if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          timer = setTimeout(function () {
            running = false;
            button.textContent = 'Check another';
            if (gradeEl) gradeEl.textContent = grade(report.score);
            if (scoreEl) scoreEl.firstChild.textContent = report.score;
            if (result) result.style.display = 'flex';
          }, 400);
        }
      }
      out.appendChild(cursor);
      timer = setTimeout(function () {
        if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
        step();
      }, 300);
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
