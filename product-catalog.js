// Fetches Food_Products from Firestore and exposes:
//   window.PRODUCT_CATALOG     -- { FP01: {productId, name, isAvailable, isStockAvailable, ...}, ... } (isAvailable=1 only)
//   window.PRODUCT_CATALOG_ALL -- all products including unavailable
//   window.PRODUCT_ID_MAP      -- { "Natural Baby Food Mix": "FP01", ... }
//   window.getProductId(name)  -- returns productId string or ''

(function () {
  const PROJECT_ID = 'maathruthva';
  const CACHE_KEY  = 'mtr_product_catalog';
  const CACHE_TTL  = 2 * 60 * 1000; // 2 minutes

  function fsVal(v) {
    if (!v) return undefined;
    if (v.stringValue  !== undefined) return v.stringValue;
    if (v.integerValue !== undefined) return Number(v.integerValue);
    if (v.doubleValue  !== undefined) return Number(v.doubleValue);
    if (v.booleanValue !== undefined) return v.booleanValue;
    return undefined;
  }

  function applyData(docs) {
    const catalog    = {};
    const catalogAll = [];
    const idMap      = {};
    docs.forEach(function (d) {
      const f   = d.fields || {};
      const pid = (f.productId && f.productId.stringValue) || d.name.split('/').pop();
      // Build entry with ALL Firestore fields
      const entry = { productId: pid };
      Object.keys(f).forEach(function (key) { entry[key] = fsVal(f[key]); });
      catalogAll.push(entry);
      // Only add to PRODUCT_CATALOG if isAvailable == 1
      const isAvailable = f.isAvailable && (f.isAvailable.integerValue == 1 || f.isAvailable.booleanValue === true);
      if (!isAvailable) return;
      const name = entry.name || '';
      catalog[pid] = entry;
      if (name) idMap[name] = pid;
    });
    window.PRODUCT_CATALOG     = catalog;
    window.PRODUCT_CATALOG_ALL = catalogAll;
    window.PRODUCT_ID_MAP      = idMap;
    window.getProductId = function (name) { return idMap[name] || ''; };
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
      applyData([
        { name: 'projects/maathruthva/databases/(default)/documents/Food_Products/FP01', fields: { productId: { stringValue: 'FP01' }, name: { stringValue: 'Natural Baby Food Mix' }, isAvailable: { integerValue: '1' }, isStockAvailable: { integerValue: '1' } } },
        { name: 'projects/maathruthva/databases/(default)/documents/Food_Products/FP02', fields: { productId: { stringValue: 'FP02' }, name: { stringValue: 'Growth Mix' },            isAvailable: { integerValue: '1' }, isStockAvailable: { integerValue: '1' } } },
        { name: 'projects/maathruthva/databases/(default)/documents/Food_Products/FP03', fields: { productId: { stringValue: 'FP03' }, name: { stringValue: 'Daily Millet Mix' },      isAvailable: { integerValue: '1' }, isStockAvailable: { integerValue: '0' } } },
      ]);
    });
})();