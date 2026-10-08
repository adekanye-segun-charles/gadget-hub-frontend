Auth.require();
const box = $("#cart");
async function load() {
  box.innerHTML = '<p class="muted">Loading cart...</p>';
  try {
    const res = await api.get(ENDPOINTS.cart), d = res.data ?? res, items = listOf(res, "items");
    if (!items.length) return (box.innerHTML = emptyState("Your cart is empty", "Start shopping to add products to your cart.", `<a class="btn primary" href="../shop/products.html">Continue shopping</a>`));
    // Totals come from the backend when it provides them.
    const sub = d.subtotal ?? d.total ?? items.reduce((n, i) => n + Number(i.product?.price ?? i.price) * i.quantity, 0);
    box.innerHTML = items.map((i) => { const p = i.product || i; return `<div class="cart-row"><img src="${esc(imgOf(p))}" alt="" onerror="this.src=FALLBACK_IMG"><div><a href="../shop/product-details.html?id=${p.id}">${esc(p.name)}</a><div class="muted">${money(p.price)}</div></div>
      <div class="qty" style="margin:0"><button data-d="-1" data-id="${i.id}" data-q="${i.quantity}">−</button><span>${i.quantity}</span><button data-d="1" data-id="${i.id}" data-q="${i.quantity}">+</button></div><b>${money(Number(p.price) * i.quantity)}</b><button class="linkbtn" data-rm="${i.id}">Remove</button></div>`; }).join("") +
      `<div class="card summary"><div class="total"><span>Subtotal</span><span>${money(sub)}</span></div><p class="muted">Shipping and discounts are calculated at checkout.</p><a class="btn primary" style="width:100%;margin-top:12px" href="checkout.html">Proceed to checkout</a></div>`;
  } catch (e) { box.innerHTML = errorState(e.message); }
}
box.addEventListener("click", async (e) => {
  const rm = e.target.dataset.rm, id = e.target.dataset.id;
  try {
    if (rm) { await api.delete(ENDPOINTS.cartItem(rm)); toast("Item removed"); }
    else if (id) await api.put(ENDPOINTS.cartItem(id), { quantity: Math.max(1, Number(e.target.dataset.q) + Number(e.target.dataset.d)) });
    else return;
    load(); refreshCounts();
  } catch (err) { toast(err.message, "error"); }
});
document.addEventListener("DOMContentLoaded", load);
