Auth.require();

const wishlistList = $("#wishlist-list");

async function loadWishlist() {
  wishlistList.innerHTML = skeletons(4);
  try {
    const items = listOf(await api.get(ENDPOINTS.wishlist), "items");
    if (!items.length) {
      wishlistList.innerHTML = emptyState(
        "Your wishlist is empty",
        "Save products you would like to come back to.",
        `<a class="btn primary" href="../shop/products.html">Browse products</a>`
      );
      return;
    }
    wishlistList.innerHTML = items.map(({ id, product }) => `
      <article class="card product">
        <a class="p-img" href="../shop/product-details.html?id=${encodeURIComponent(product.id)}">
          <img loading="lazy" src="${esc(imgOf(product))}" alt="${esc(product.name)}" onerror="this.onerror=null;this.src=FALLBACK_IMG">
        </a>
        <div class="p-body">
          <a class="p-name" href="../shop/product-details.html?id=${encodeURIComponent(product.id)}">${esc(product.name)}</a>
          <div class="price"><b>${money(product.price)}</b></div>
          <button class="btn ghost" type="button" data-remove="${esc(id)}">Remove from wishlist</button>
        </div>
      </article>`).join("");
  } catch (error) {
    wishlistList.innerHTML = errorState(error.message);
  }
}

wishlistList.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;
  button.disabled = true;
  try {
    await api.delete(ENDPOINTS.wishlistItem(button.dataset.remove));
    toast("Removed from wishlist");
    await loadWishlist();
    refreshCounts();
  } catch (error) {
    button.disabled = false;
    toast(error.message, "error");
  }
});

loadWishlist();
