const logoSvg = `<svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true"><rect x="1" y="1" width="32" height="32" rx="9" fill="#ff6a00"/><path d="M18.8 5.5 9.3 18h6.2l-.9 10.5L25 15.8h-6.3l.1-10.3Z" fill="white"/></svg>`;
const icon = {
  user: '<path d="M20 21a8 8 0 0 0-16 0M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/>',
  heart: '<path d="M12 21s-8-5.3-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.7-8 11-8 11z"/>',
  cart: '<path d="M3 4h2l2.5 11h10L20 7H6.5"/><circle cx="9" cy="19.5" r="1.4"/><circle cx="17" cy="19.5" r="1.4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  plane: '<path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
  facebook: '<path d="M15 21v-8h3l.5-4H15V7c0-1.2.4-2 2-2h2V1.4c-.7-.1-1.8-.2-3.2-.2C12.6 1.2 11 3 11 6.4V9H8v4h3v8h4Z"/>',
  truck: '<path d="M2 6h11v10H2zM13 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.5"/><circle cx="16.5" cy="17.5" r="1.5"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>',
  headset: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  smartphone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>',
  laptop: '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M2 20h20l-2-4H4l-2 4Z"/>',
  tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/>',
  watch: '<rect x="7" y="7" width="10" height="10" rx="3"/><path d="M9 2h6l1 5H8l1-5Zm0 20h6l1-5H8l1 5Z"/>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4" height="7" rx="2"/><rect x="17" y="13" width="4" height="7" rx="2"/>',
  camera: '<path d="M3 8h4l2-3h6l2 3h4v12H3z"/><circle cx="12" cy="14" r="4"/>',
  gaming: '<path d="M6 9h12a4 4 0 0 1 3.8 5l-1 4a2 2 0 0 1-3.2 1.1L14 16h-4l-3.6 3.1A2 2 0 0 1 3.2 18l-1-4A4 4 0 0 1 6 9Z"/><path d="M7 12v4m-2-2h4m7-1h.01M18 15h.01"/>',
  accessory: '<path d="M12 3 3 8l9 5 9-5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  charger: '<path d="M8 3v6m8-6v6M6 9h12v3a6 6 0 0 1-12 0V9Zm6 9v3"/>',
};
const svg = (n) => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon[n]}</svg>`;

const brandHtml = (inverse = false) => `<a class="brand${inverse ? " brand-inverse" : ""}" href="${ROOT}index.html">${logoSvg}<span><b>GADGET <em>HUB</em></b><small>TECH FOR EVERY DAY</small></span></a>`;
function renderNavbar() {
  const el = $("#navbar"); if (!el) return;
  const home = `${ROOT}index.html`;
  if (!el.matches(".site-header")) {
  const links = [
    ["index.html", "Home", "home"],
    ["pages/shop/products.html", "Shop", "shop"],
    [`index.html#categories`, "Categories", "categories"],
    [`index.html#about`, "About us", "about"],
    [`index.html#contact`, "Contact", "contact"]
  ];
  const currentPath = location.pathname;
  const navLinks = links.map(([href, label, key]) => {
    const active = key === "home" ? currentPath.endsWith("/index.html") || currentPath.endsWith("/") : key === "shop" && currentPath.endsWith("/products.html");
    return `<a href="${ROOT}${href}"${active ? ' class="active"' : ""}>${label}</a>`;
  }).join("");
  const social = (name, label) => SITE.social?.[name] ? `<a href="${esc(SITE.social[name])}" aria-label="${label} Gadget Hub" target="_blank" rel="noopener noreferrer">${svg(name)}</a>` : "";
  el.innerHTML = `<header class="site-header">
    <div class="topbar"><div class="container topbar-inner"><span class="topbar-location">${svg("pin")}<span>${esc(SITE.address)}</span></span><span class="topbar-shipping">${svg("truck")}Free shipping on orders over ₦50,000</span><div class="topbar-contact"><a href="tel:${SITE.phone.replace(/\s/g, "")}">${svg("phone")}${esc(SITE.phone)}</a><span class="topbar-social">${social("instagram", "Instagram")}${social("facebook", "Facebook")}</span></div></div></div>
    <div class="nav"><div class="container nav-in">
      ${brandHtml()}
      <button class="nav-toggle" type="button" aria-label="Open navigation menu" aria-controls="navLinks" aria-expanded="false">${svg("menu")}</button>
      <nav class="nav-links" id="navLinks" aria-label="Main navigation">${navLinks}</nav>
      <div class="nav-actions">
        <button class="nav-icon nav-search-toggle" type="button" aria-label="Search products" aria-expanded="false" aria-controls="navSearch">${svg("search")}</button>
        <a class="nav-icon" href="${ROOT}${Auth.isLoggedIn() ? "pages/account/profile.html" : "pages/auth/login.html"}" aria-label="My account">${svg("user")}</a>
        <a class="nav-icon badge-wrap" href="${ROOT}pages/account/wishlist.html" aria-label="Wishlist">${svg("heart")}<span class="count" id="wishCount">0</span></a>
        <a class="nav-icon badge-wrap cart-link" href="${ROOT}pages/account/cart.html" aria-label="Shopping cart">${svg("cart")}<span class="count" id="cartCount">0</span></a>
      </div>
      <form class="nav-search" id="navSearch" role="search" hidden><label class="sr-only" for="nav-search-input">Search products</label>${svg("search")}<input id="nav-search-input" name="search" type="search" placeholder="Search gadgets and accessories"><button type="submit">Search</button></form>
    </div></div>
  </header>`;
  }
  const address = $("#topbar-address", el);
  if (address) address.textContent = SITE.address;
  const phone = $("#topbar-phone", el);
  if (phone) {
    phone.href = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;
    const phoneLabel = $("#topbar-phone-label", phone);
    if (phoneLabel) phoneLabel.textContent = SITE.phone;
  }
  const accountLink = $('.nav-icon[aria-label="My account"]', el);
  if (accountLink) accountLink.href = `${ROOT}${Auth.isLoggedIn() ? "pages/account/profile.html" : "pages/auth/login.html"}`;
  const menuButton = $(".nav-toggle", el);
  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(expanded));
    menuButton.setAttribute("aria-label", expanded ? "Close navigation menu" : "Open navigation menu");
    menuButton.innerHTML = expanded ? svg("close") : svg("menu");
    $("#navLinks", el).classList.toggle("open", expanded);
  });
  $("#navLinks", el).addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    $("#navLinks", el).classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.innerHTML = svg("menu");
  });
  const searchToggle = $(".nav-search-toggle", el);
  searchToggle.addEventListener("click", () => {
    const search = $("#navSearch", el);
    const expanded = searchToggle.getAttribute("aria-expanded") !== "true";
    searchToggle.setAttribute("aria-expanded", String(expanded));
    search.hidden = !expanded;
    if (expanded) $("#nav-search-input", el).focus();
  });
  $("#navSearch", el).addEventListener("submit", (event) => {
    event.preventDefault();
    const query = event.currentTarget.search.value.trim();
    if (query) location.href = `${ROOT}pages/shop/products.html?search=${encodeURIComponent(query)}`;
  });
  if (Auth.isLoggedIn()) refreshCounts();
}
async function refreshCounts() {
  try { $("#cartCount").textContent = listOf(await api.get(ENDPOINTS.cart), "items").reduce((n, i) => n + (i.quantity || 1), 0); } catch {}
  try { $("#wishCount").textContent = listOf(await api.get(ENDPOINTS.wishlist), "items").length; } catch {}
}
function renderFooter() {
  const el = $("#footer"); if (!el) return;
  const home = `${ROOT}index.html`;
  const a = (href, label) => `<a href="${href}">${label}</a>`;
  const footerSocial = (name, label) => SITE.social?.[name]
    ? `<a href="${esc(SITE.social[name])}" aria-label="${label}" target="_blank" rel="noopener noreferrer">${svg(name)}</a>`
    : "";
  el.innerHTML = `<footer class="footer">
    <div class="container perks">${[
      ["truck", "Delivery across Nigeria", "Reliable nationwide delivery"],
      ["shield", "Secure checkout", "Protected Paystack payments"],
      ["refresh", "Shopping made easy", "Friendly support when you need it"],
      ["headset", "Here to help", "Talk to our Gadget Hub team"]
    ].map(([name, title, description]) => `<div class="perk"><span class="perk-icon">${svg(name)}</span><span><b>${title}</b><small>${description}</small></span></div>`).join("")}</div>
    <div class="container foot-grid">
      <div class="foot-brand">${brandHtml(true)}<p>Your one-stop destination for premium gadgets, electronics, and smart tech for every day.</p><div class="footer-social">${footerSocial("instagram", "Instagram")}${footerSocial("facebook", "Facebook")}</div></div>
      <div class="foot-column"><h3>Quick links</h3>${a(home, "Home")}${a(`${ROOT}pages/shop/products.html`, "Shop")}${a(`${home}#categories`, "Categories")}${a(`${home}#about`, "About us")}${a(`${home}#contact`, "Contact")}</div>
      <div class="foot-column"><h3>Customer service</h3>${a(`${ROOT}pages/account/profile.html`, "My account")}${a(`${ROOT}pages/account/cart.html`, "My cart")}</div>
      <div class="foot-column"><h3>Popular brands</h3><span>Apple</span><span>Samsung</span><span>Google</span></div>
      <div class="foot-column foot-contact" id="contact"><h3>Contact us</h3><span>${svg("pin")}${esc(SITE.address)}</span><a href="tel:${SITE.phone.replace(/\s/g, "")}">${svg("phone")}${esc(SITE.phone)}</a><a href="mailto:${SITE.email}">${svg("mail")}${esc(SITE.email)}</a><small>${esc(SITE.hours)}</small></div>
    </div>
    <div class="foot-bottom"><div class="container"><span>© ${new Date().getFullYear()} Gadget Hub. All rights reserved.</span><span class="secure">${svg("lock")} Secure checkout powered by Paystack</span></div></div>
  </footer>`;
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
  const href = `${ROOT}pages/shop/product-details.html?id=${encodeURIComponent(p.id)}`;
  const rating = Number(p.averageRating ?? p.rating ?? 0);
  const reviews = Number(p.reviewCount ?? p._count?.reviews ?? p.reviews?.length ?? 0);
  return `<article class="card product">
    <a class="p-img" href="${href}"><img loading="lazy" src="${esc(imgOf(p))}" alt="${esc(p.name)}" onerror="this.onerror=null;this.src=FALLBACK_IMG">${off ? `<span class="pill sale">-${off}%</span>` : ""}</a>
    <button class="wish" data-wish="${p.id}" aria-label="Add to wishlist">${svg("heart")}</button>
    <div class="p-body"><small class="product-brand">${esc(brand || p.category?.name || "Gadget Hub pick")}</small>
      <a class="p-name" href="${href}">${esc(p.name)}</a>
      ${rating > 0 ? `<div class="product-rating" aria-label="${rating.toFixed(1)} out of 5 stars"><span aria-hidden="true">★</span> ${rating.toFixed(1)} <small>(${reviews})</small></div>` : ""}
      <div class="price"><b>${money(price)}</b>${off ? `<s>${money(cmp)}</s>` : ""}</div>
      ${out ? '<span class="pill out">Out of stock</span>' : ""}
      <button class="btn primary sm" data-cart="${esc(p.id)}" aria-label="Add ${esc(p.name)} to cart" ${out ? "disabled" : ""}>Add to cart ${svg("cart")}</button></div></article>`;
}
function categoryCard(category) {
  const name = String(category.name || "Gadgets");
  const image = typeof category.image === "string" ? category.image : category.image?.url;
  const visual = image
    ? `<img loading="lazy" src="${esc(image)}" alt="${esc(name)}">`
    : "";
  return `<a class="category-card" href="pages/shop/products.html?categoryId=${encodeURIComponent(category.id)}">
    <span class="category-visual">${visual}</span>
    <span class="category-name">${esc(name)}</span>
  </a>`;
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
