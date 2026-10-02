(async () => {
  const box = $("#detail"); box.innerHTML = '<p class="muted section">Loading product...</p>';
  try {
    const res = await api.get(`${ENDPOINTS.products}/${params().id}`), p = res.data?.product || res.data || res;
    const imgs = (p.images || []).map((i) => (typeof i === "string" ? i : i.url)).filter(Boolean); if (!imgs.length) imgs.push(FALLBACK_IMG);
    const price = Number(p.price), cmp = Number(p.comparePrice), off = cmp > price ? Math.round((1 - price / cmp) * 100) : 0, out = Number(p.stock) <= 0;
    const specs = p.specifications && typeof p.specifications === "object" ? Object.entries(p.specifications) : [];
    let q = 1; document.title = `${p.name} | Gadget Hub`;
    box.innerHTML = `<div class="detail"><div class="gallery"><div class="main"><img id="mainImg" src="${esc(imgs[0])}" alt="${esc(p.name)}" onerror="this.src=FALLBACK_IMG"></div><div class="thumbs">${imgs.length > 1 ? imgs.map((u) => `<img loading="lazy" src="${esc(u)}" alt="" data-src="${esc(u)}">`).join("") : ""}</div></div>
    <div><small class="muted">${esc(typeof p.brand === "object" ? p.brand?.name : p.brand)}${p.category?.name ? " · " + esc(p.category.name) : ""}</small><h1>${esc(p.name)}</h1>
    <div class="price"><b>${money(price)}</b>${off ? `<s>${money(cmp)}</s><span class="pill sale" style="position:static">-${off}%</span>` : ""}</div>
    <p class="muted" style="margin-top:8px">${out ? "Out of stock" : `${p.stock} in stock`}${p.sku ? " · SKU " + esc(p.sku) : ""}</p><p style="margin:18px 0;max-width:60ch">${esc(p.description)}</p>
    <div class="qty"><button id="m" aria-label="Decrease">−</button><span id="q">1</span><button id="pl" aria-label="Increase">+</button></div>
    <button class="btn primary" id="add" ${out ? "disabled" : ""}>Add to cart</button> <button class="btn ghost" id="wl">Wishlist</button>
    ${specs.length ? `<table class="specs">${specs.map(([k, v]) => `<tr><td class="muted">${esc(k)}</td><td>${esc(v)}</td></tr>`).join("")}</table>` : ""}</div></div>`;
    $$(".thumbs img").forEach((t) => (t.onclick = () => ($("#mainImg").src = t.dataset.src)));
    const max = Number(p.stock) || 99;
    $("#m").onclick = () => ($("#q").textContent = q = Math.max(1, q - 1));
    $("#pl").onclick = () => ($("#q").textContent = q = Math.min(max, q + 1));
    $("#add").onclick = () => addToCart(p.id, q); $("#wl").onclick = () => addToWishlist(p.id);
  } catch (e) { box.innerHTML = errorState(e.message); }
})();
