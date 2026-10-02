(async () => {
  $("#cats").innerHTML = skeletons(4); $("#featured").innerHTML = skeletons(4);
  try {
    const c = listOf(await api.get(ENDPOINTS.categories), "categories");
    $("#cats").innerHTML = c.length ? c.map((x) => `<a class="card cat-card" href="pages/shop/category.html?id=${x.id}"><span class="cat-copy"><span class="cat-kicker">Collection</span><span class="cat-name">${esc(x.name)}</span><span class="cat-action">Explore <span aria-hidden="true">&rarr;</span></span></span><span class="cat-visual" aria-hidden="true"><span class="cat-device"></span><span class="cat-device-small"></span></span></a>`).join("") : emptyState("No categories yet", "Check back soon.");
  } catch (e) { $("#cats").innerHTML = errorState(e.message); }
  try {
    const p = listOf(await api.get(ENDPOINTS.products, { query: { featured: true, limit: 8 } }), "products");
    $("#featured").innerHTML = p.length ? p.map(productCard).join("") : emptyState("No featured products yet", "Browse the full shop instead.", `<a class="btn primary" href="pages/shop/products.html">Shop all</a>`);
  } catch (e) { $("#featured").innerHTML = errorState(e.message); }
})();
