Auth.require();
const box = $("#cart");
const recommendationsBox = $("#cart-recommendations");

async function load() {
  box.innerHTML = '<p class="muted">Loading cart...</p>';
  try {
    const res = await api.get(ENDPOINTS.cart), d = res.data ?? res, items = listOf(res, "items");
    if (!items.length) {
      box.innerHTML = emptyState("Your cart is empty", "Start shopping to add products to your cart.", `<a class="btn primary" href="../shop/products.html">Browse the shop</a>`);
      return;
    }
    // Totals come from the backend when it provides them.
    const sub = d.subtotal ?? d.total ?? items.reduce((n, i) => n + Number(i.product?.price ?? i.price) * i.quantity, 0);
    box.innerHTML = `<div class="cart-content"><div class="cart-items-panel">${items.map((i) => { const p = i.product || i; return `<div class="cart-row"><img src="${esc(imgOf(p))}" alt="${esc(p.name)}" onerror="this.onerror=null;this.src=FALLBACK_IMG"><div class="cart-product-info"><a href="../shop/product-details.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a><div class="muted">${money(p.price)} each</div></div>
      <div class="qty"><button type="button" aria-label="Decrease quantity" data-d="-1" data-id="${esc(i.id)}" data-q="${Number(i.quantity)}">−</button><span>${Number(i.quantity)}</span><button type="button" aria-label="Increase quantity" data-d="1" data-id="${esc(i.id)}" data-q="${Number(i.quantity)}">+</button></div><b class="cart-line-total">${money(Number(p.price) * i.quantity)}</b><button class="linkbtn cart-remove" type="button" data-rm="${esc(i.id)}">Remove</button></div>`; }).join("")}</div>
      <aside class="card summary cart-order-summary"><span class="cart-summary-label">ORDER TOTAL</span><div class="total"><span>Subtotal</span><strong>${money(sub)}</strong></div><p class="muted">Shipping and discounts are calculated at checkout.</p><a class="btn primary cart-checkout-button" href="checkout.html">Proceed to checkout <span aria-hidden="true">→</span></a><a class="cart-back-link" href="../shop/products.html">Continue shopping</a></aside></div>`;
  } catch (e) { box.innerHTML = errorState(e.message); }
}

async function loadRecommendations() {
  if (!recommendationsBox) return;
  recommendationsBox.innerHTML = skeletons(4);
  try {
    const [productsResult, cartResult] = await Promise.all([
      api.get(ENDPOINTS.products, { query: { limit: 12 } }),
      api.get(ENDPOINTS.cart)
    ]);
    const cartItems = listOf(cartResult, "items");
    const cartProductIds = new Set(cartItems.map((item) => String(item.product?.id ?? item.productId ?? item.id)));
    const products = listOf(productsResult, "products")
      .filter((product) => !cartProductIds.has(String(product.id)) && Number(product.stock ?? 1) > 0)
      .slice(0, 8);
    recommendationsBox.innerHTML = products.length
      ? products.map(productCard).join("")
      : emptyState("You’ve seen everything", "There are no more available products to recommend right now.", `<a class="btn ghost" href="../shop/products.html">Browse all products</a>`);
  } catch (error) {
    recommendationsBox.innerHTML = errorState(error.message);
  }
}

box.addEventListener("click", async (e) => {
  const action = e.target.closest("[data-rm], [data-id]");
  const rm = action?.dataset.rm, id = action?.dataset.id;
  try {
    if (rm) { await api.delete(ENDPOINTS.cartItem(rm)); toast("Item removed"); }
    else if (id && action.dataset.d) await api.put(ENDPOINTS.cartItem(id), { quantity: Math.max(1, Number(action.dataset.q) + Number(action.dataset.d)) });
    else return;
    await load();
    await loadRecommendations();
    refreshCounts();
  } catch (err) { toast(err.message, "error"); }
});
document.addEventListener("DOMContentLoaded", () => {
  load();
  loadRecommendations();
});
