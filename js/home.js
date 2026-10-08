function renderDealShowcase(products) {
  const showcase = $("#deal-products");
  const withImages = products.filter((product) => imgOf(product) !== FALLBACK_IMG).slice(0, 3);
  if (!withImages.length) {
    showcase.innerHTML = `<div class="deal-empty">Fresh finds are on their way.<br><span>Explore the full collection.</span></div>`;
  } else {
    showcase.innerHTML = withImages.map((product, index) => `
      <a class="deal-product deal-product-${index + 1}" href="pages/shop/product-details.html?id=${encodeURIComponent(product.id)}" aria-label="View ${esc(product.name)}">
        <img src="${esc(imgOf(product))}" alt="${esc(product.name)}" loading="lazy" onerror="this.onerror=null;this.src=FALLBACK_IMG">
        <span>${esc(product.name)}</span>
      </a>`).join("");
  }

  const brands = [...new Set(products.map((product) => (
    typeof product.brand === "string" ? product.brand.trim()
      : product.brand?.name?.trim()
  )).filter(Boolean))].slice(0, 5);
  $("#store-brands").innerHTML = brands.length
    ? `<span>IN THE STORE</span>${brands.map((brand) => `<b>${esc(brand)}</b>`).join("")}`
    : "";
}

async function loadHomeCategories() {
  const rail = $("#cats");
  rail.innerHTML = `<div class="category-loading" role="status">Loading categories...</div>`;
  try {
    const categories = listOf(await api.get(ENDPOINTS.categories), "categories");
    rail.innerHTML = categories.length
      ? categories.slice(0, 10).map(categoryCard).join("")
      : emptyState("New collections coming soon", "Browse all products while we add more categories.", `<a class="btn ghost" href="pages/shop/products.html">Browse products</a>`);
  } catch (error) {
    rail.innerHTML = errorState(error.message);
  }
}

async function loadHomeProducts() {
  const productGrid = $("#featured");
  productGrid.innerHTML = skeletons(4);
  try {
    let products = listOf(
      await api.get(ENDPOINTS.products, { query: { isFeatured: true, limit: 8 } }),
      "products"
    );
    if (!products.length) {
      products = listOf(
        await api.get(ENDPOINTS.products, { query: { limit: 8 } }),
        "products"
      );
    }

    productGrid.innerHTML = products.length
      ? products.slice(0, 8).map(productCard).join("")
      : emptyState("New gadgets coming soon", "There are no products to show just yet.", `<a class="btn ghost" href="pages/shop/products.html">Browse the shop</a>`);
    renderDealShowcase(products);
  } catch (error) {
    productGrid.innerHTML = errorState(error.message);
    renderDealShowcase([]);
  }
}

loadHomeCategories();
loadHomeProducts();
