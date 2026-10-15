// Shows the Maathruthva loading indicator the instant a visitor clicks something that leaves the page,
// instead of leaving the old page frozen until the next page can paint.
(function () {
  var SAFETY_MS = 12000;
  var timer;

  var css =
    '#nav-loader{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;' +
    'background:rgba(247,242,231,.9);opacity:0;visibility:hidden;transition:opacity .12s ease,visibility .12s ease;}' +
    '#nav-loader.on{opacity:1;visibility:visible;}' +
    '.nl-ring{position:relative;width:84px;height:84px;}' +
    '.nl-ring img{width:84px;height:84px;border-radius:50%;object-fit:contain;background:#FBF8F0;box-shadow:0 4px 16px rgba(74,104,48,.25);}' +
    '.nl-ring:before{content:"";position:absolute;inset:-8px;border-radius:50%;border:3px solid rgba(107,140,74,.2);border-top-color:#6B8C4A;animation:nlspin .8s linear infinite;}' +
    '.nl-text{font-family:Jost,Arial,sans-serif;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;color:#8A7A50;}' +
    '@keyframes nlspin{to{transform:rotate(360deg)}}' +
    '@media(prefers-reduced-motion:reduce){.nl-ring:before{animation-duration:2.4s}#nav-loader{transition:none}}';

  function overlay() {
    var el = document.getElementById('nav-loader');
    if (el) return el;
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    el = document.createElement('div');
    el.id = 'nav-loader';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<div class="nl-ring"><img src="/assets/img/c05170bd02.webp" alt=""></div><div class="nl-text">Loading</div>';
    document.body.appendChild(el);
    return el;
  }

  function show() {
    if (!document.body) return;
    var el = overlay();
    el.classList.add('on');
    clearTimeout(timer);
    timer = setTimeout(hide, SAFETY_MS);   // never leave the page covered if a navigation turns out to be a download or is cancelled
  }

  function hide() {
    clearTimeout(timer);
    var el = document.getElementById('nav-loader');
    if (el) el.classList.remove('on');
  }

  // Links to another page: react on the click itself.
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('download')) return;
    if (a.target && a.target !== '_self') return;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(javascript|mailto|tel):/i.test(href)) return;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return;   // in-page anchor
    show();
  });

  // Everything else that leaves the page (buttons calling location.href, "Buy it now", redirects to login, ...).
  window.addEventListener('beforeunload', show);

  // Coming back with the Back button restores the page from cache: make sure it is not covered.
  window.addEventListener('pageshow', hide);
})();
