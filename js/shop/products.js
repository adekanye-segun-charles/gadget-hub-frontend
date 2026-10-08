(async () => {
  const list = $("#list"), p0 = params();
  $("#q").value = p0.search || "";
  try {
    listOf(await api.get(ENDPOINTS.categories), "categories").forEach((c) => $("#cat").insertAdjacentHTML("beforeend", `<option value="${c.id}">${esc(c.name)}</option>`));
  } catch (error) {
    list.innerHTML = errorState(error.message);
    return;
  }
  if (p0.categoryId) $("#cat").value = p0.categoryId;
  async function load() {
    list.innerHTML = skeletons(8);
    try {
      const items = listOf(await api.get(ENDPOINTS.products, { query: { search: $("#q").value, categoryId: $("#cat").value, minPrice: $("#min").value, maxPrice: $("#max").value } }), "products");
      list.innerHTML = items.length ? items.map(productCard).join("") : emptyState("No products found", "Try a different search or clear your filters.");
    } catch (e) { list.innerHTML = errorState(e.message); }
  }
  const d = debounce(load);
  ["q", "min", "max"].forEach((i) => $("#" + i).addEventListener("input", d));
  $("#cat").addEventListener("change", load);
  load();
})();
