// Fetches Food_Products from Firestore once per session and exposes:
//   window.PRODUCT_CATALOG  — { FP01: {productId, name}, FP02: ..., ... }
//   window.PRODUCT_ID_MAP   — { "Natural Baby Food Mix": "FP01", ... }
//   window.getProductId(name) — returns productId string or ''

(function () {
  const PROJECT_ID = 'maathruthva';
  const CACHE_KEY  = 'mtr_product_catalog';
  const CACHE_TTL  = 2 * 60 * 1000; // 2 minutes

  function applyData(docs) {
    const catalog = {};
    const idMap   = {};
    docs.forEach(function (d) {
      const f  = d.fields || {};
      // Skip products where isAvailable != 1
      const isAvailable = f.isAvailable && (f.isAvailable.integerValue == 1 || f.isAvailable.booleanValue === true);
      if (!isAvailable) return;
      const pid  = (f.productId && f.productId.stringValue) || d.name.split('/').pop();
      const name = (f.name     && f.name.stringValue)      || '';
      catalog[pid] = { productId: pid, name: name };
      if (name) idMap[name] = pid;
    });
    window.PRODUCT_CATALOG = catalog;
    window.PRODUCT_ID_MAP  = idMap;
    window.getProductId = function (name) { return idMap[name] || ''; };
    // If current page has PRODUCT_NAME set, resolve its ID
    if (window.PRODUCT_NAME && !window.PRODUCT_ID) {
      window.PRODUCT_ID = idMap[window.PRODUCT_NAME] || window.PRODUCT_ID || '';
    }
    document.dispatchEvent(new Event('productCatalogReady'));
  }

  // Try cache first
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
    if (cached && cached.ts && (Date.now() - cached.ts) < CACHE_TTL && cached.docs) {
      applyData(cached.docs);
      return;
    }
  } catch (e) {}

  // Fetch from Firestore REST API
  var url = 'https://firestore.googleapis.com/v1/projects/' + PROJECT_ID +
            '/databases/(default)/documents/Food_Products';
  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var docs = (data.documents || []);
      try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), docs: docs })); } catch (e) {}
      applyData(docs);
    })
    .catch(function (e) {
      console.warn('Product catalog fetch failed, using fallback:', e);
      // Hardcoded fallback so the site still works if Firestore is unreachable
      applyData([
        { name: 'projects/maathruthva/databases/(default)/documents/Food_Products/FP01', fields: { productId: { stringValue: 'FP01' }, name: { stringValue: 'Natural Baby Food Mix' } } },
        { name: 'projects/maathruthva/databases/(default)/documents/Food_Products/FP02', fields: { productId: { stringValue: 'FP02' }, name: { stringValue: 'Growth Mix' } } },
        { name: 'projects/maathruthva/databases/(default)/documents/Food_Products/FP03', fields: { productId: { stringValue: 'FP03' }, name: { stringValue: 'Daily Millet Mix' } } },
      ]);
    });
})();
