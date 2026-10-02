const logoSvg = `<svg width="30" height="32" viewBox="0 0 30 32" aria-hidden="true"><path d="M5 9h20l2 20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#7c3aed"/><path d="M10 9V7a5 5 0 0 1 10 0v2" fill="none" stroke="#a855f7" stroke-width="2.5"/><path d="M17 14l-6 8h4l-1 5 6-8h-4z" fill="#fff"/></svg>`;
const icon = {
  user: '<path d="M20 21a8 8 0 0 0-16 0M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/>',
  heart: '<path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"/>',
  cart: '<path d="M3 4h2l2.5 11h10L20 7H6.5"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  truck: '<path d="M2 6h11v10H2zM13 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'
};
icon.mail='<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>';
icon.phone='<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>';
icon.pin='<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>';
icon.lock='<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>';
icon.clock='<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>';
const svg = (n) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon[n]}</svg>`;

const brandHtml = () => `<a class="brand" href="${ROOT}index.html">${logoSvg}<span><b>GADGET<em>HUB</em></b><small>Smart. Useful. Everyday.</small></span></a>`;
function renderNavbar() {
  const el = $("#navbar"); if (!el) return;
  const here = location.pathname, link = (href, t) => `<a href="${ROOT}${href}" class="${here.endsWith(href) ? "active" : ""}">${t}</a>`;
  el.innerHTML = `<header class="nav"><div class="container nav-in">
    ${brandHtml()}
    <button class="nav-toggle" aria-label="Menu" aria-expanded="false">☰</button>
    <nav class="nav-links" id="navLinks">${link("index.html", "Home")}${link("pages/shop/products.html", "Shop")}${link("index.html#categories", "Categories")}${link("pages/account/wishlist.html", "Wishlist")}</nav>
    <form class="nav-search" id="navSearch" role="search">${svg("search")}<input name="search" type="search" placeholder="Search gadgets, accessories, tech & more..." aria-label="Search products"></form>
    <div class="nav-actions">
      <a href="${ROOT}${Auth.isLoggedIn() ? "pages/account/profile.html" : "pages/auth/login.html"}" aria-label="Account">${svg("user")}</a>
      <a href="${ROOT}pages/account/wishlist.html" aria-label="Wishlist" class="badge-wrap">${svg("heart")}<span class="count" id="wishCount">0</span></a>
      <a href="${ROOT}pages/account/cart.html" aria-label="Cart" class="badge-wrap">${svg("cart")}<span class="count" id="cartCount">0</span></a>
    </div></div></header>`;
  $(".nav-toggle").onclick = (e) => { const o = $("#navLinks").classList.toggle("open"); e.target.setAttribute("aria-expanded", o); };
  $("#navSearch").onsubmit = (e) => { e.preventDefault(); location.href = `${ROOT}pages/shop/products.html?search=${encodeURIComponent(e.target.search.value)}`; };
  if (Auth.isLoggedIn()) refreshCounts();
}
async function refreshCounts() {
  try { $("#cartCount").textContent = listOf(await api.get(ENDPOINTS.cart), "items").reduce((n, i) => n + (i.quantity || 1), 0); } catch {}
  try { $("#wishCount").textContent = listOf(await api.get(ENDPOINTS.wishlist), "items").length; } catch {}
}
function renderFooter() {
  const el = $("#footer"); if (!el) return;
  const a = (h, t) => `<a href="${ROOT}${h}">${t}</a>`, row = (i, t) => `<li>${svg(i)}<span>${t}</span></li>`;
  const perk = (i, t, s) => `<div class="perk">${svg(i)}<div><b>${t}</b><small>${s}</small></div></div>`;
  el.innerHTML = `<footer class="footer">
    <div class="container perks">${perk("truck", "Fast delivery", "Nationwide shipping")}${perk("shield", "Secure payments", "Protected by Paystack")}${perk("refresh", "Easy returns", "Hassle-free process")}${perk("headset", "Customer support", "Here when you need us")}</div>
    <div class="container foot-grid">
      <div class="foot-brand">${brandHtml()}<p>Genuine phones, laptops, audio and smart accessories, delivered to your door across Nigeria.</p></div>
      <div><h4>Explore</h4>${a("index.html", "Home")}${a("pages/shop/products.html", "Shop")}${a("index.html#categories", "Categories")}${a("pages/account/wishlist.html", "Wishlist")}${a("pages/account/cart.html", "Cart")}</div>
      <div><h4>My account</h4>${a("pages/auth/login.html", "Log in")}${a("pages/auth/register.html", "Create an account")}${a("pages/account/cart.html", "My cart")}</div>
      <div><h4>Contact us</h4><ul class="contact">${row("mail", `<a href="mailto:${SITE.email}">${SITE.email}</a>`)}${row("phone", `<a href="tel:${SITE.phone.replace(/\s/g, "")}">${SITE.phone}</a>`)}${row("pin", esc(SITE.address))}${row("clock", esc(SITE.hours))}</ul></div>
    </div>
    <div class="foot-bottom"><div class="container"><span>© ${new Date().getFullYear()} Gadget Hub. All rights reserved.</span><span class="secure">${svg("lock")} Secure checkout with Paystack</span></div></div></footer>`;
}
function toast(msg, type = "success") {
  let box = $("#toasts"); if (!box) { box = document.createElement("div"); box.id = "toasts"; box.setAttribute("aria-live", "polite"); document.body.append(box); }
  const t = document.createElement("div"); t.className = `toast ${type}`; t.textContent = msg; box.append(t);
  setTimeout(() => t.remove(), 4000);
}
function confirmDialog({ title, text, confirmLabel = "Delete" }) {
  return new Promise((resolve) => {
    const m = document.createElement("div"); m.className = "modal";
    m.innerHTML = `<div class="modal-box" role="dialog" aria-modal="true"><h3>${esc(title)}</h3><p>${esc(text || "This action cannot be undone.")}</p><div class="row"><button class="btn ghost" data-v="0">Cancel</button><button class="btn danger" data-v="1">${esc(confirmLabel)}</button></div></div>`;
    m.onclick = (e) => { const v = e.target.dataset?.v; if (v != null || e.target === m) { m.remove(); resolve(v === "1"); } };
    document.body.append(m); m.querySelector("button").focus();
  });
}
const skeletons = (n = 8) => Array.from({ length: n }, () => '<div class="card skeleton"><div class="sk-img"></div><div class="sk-line"></div><div class="sk-line short"></div></div>').join("");
const emptyState = (title, text, cta = "") => `<div class="empty"><h3>${title}</h3><p>${text}</p>${cta}</div>`;
const errorState = (msg) => `<div class="empty"><h3>Couldn't load this</h3><p>${esc(msg)}</p><button class="btn ghost" onclick="location.reload()">Try again</button></div>`;

function productCard(p) {
  const price = Number(p.price), cmp = Number(p.comparePrice), off = cmp > price ? Math.round((1 - price / cmp) * 100) : 0;
  const out = p.stock != null && Number(p.stock) <= 0;
  const brand = typeof p.brand === "object" ? p.brand?.name : p.brand;
  const href = `${ROOT}pages/shop/product-details.html?id=${p.id}`;
  return `<article class="card product">
    <a class="p-img" href="${href}"><img loading="lazy" src="${esc(imgOf(p))}" alt="${esc(p.name)}" onerror="this.onerror=null;this.src=FALLBACK_IMG">${off ? `<span class="pill sale">-${off}%</span>` : ""}</a>
    <button class="wish" data-wish="${p.id}" aria-label="Add to wishlist">${svg("heart")}</button>
    <div class="p-body"><small class="muted">${esc(brand || "")}</small>
      <a class="p-name" href="${href}">${esc(p.name)}</a>
      <div class="price"><b>${money(price)}</b>${off ? `<s>${money(cmp)}</s>` : ""}</div>
      ${out ? '<span class="pill out">Out of stock</span>' : ""}
      <button class="btn primary sm" data-cart="${p.id}" ${out ? "disabled" : ""}>Add to cart</button></div></article>`;
}
async function addToCart(id, quantity = 1) {
  if (!Auth.isLoggedIn()) return Auth.require();
  try { await api.post(ENDPOINTS.cart, { productId: id, quantity }); toast("Product added to cart"); refreshCounts(); }
  catch (e) { toast(e.message || "Unable to add product to cart.", "error"); }
}
async function addToWishlist(id) {
  if (!Auth.isLoggedIn()) return Auth.require();
  try { await api.post(ENDPOINTS.wishlist, { productId: id }); toast("Added to wishlist"); refreshCounts(); }
  catch (e) { toast(e.message || "Unable to update wishlist.", "error"); }
}
document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-cart]"), w = e.target.closest("[data-wish]");
  if (c) addToCart(c.dataset.cart); if (w) addToWishlist(w.dataset.wish);
});
document.addEventListener("DOMContentLoaded", () => { renderNavbar(); renderFooter(); });
