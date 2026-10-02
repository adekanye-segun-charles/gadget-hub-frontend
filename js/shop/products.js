(async () => {
  const list = $("#list"), p0 = params();
  $("#q").value = p0.search || "";
  try { listOf(await api.get(ENDPOINTS.categories), "categories").forEach((c) => $("#cat").insertAdjacentHTML("beforeend", `<option value="${c.id}">${esc(c.name)}</option>`)); } catch {}
  if (p0.category) $("#cat").value = p0.category;
  async function load() {
    list.innerHTML = skeletons(8);
    try {
      const items = listOf(await api.get(ENDPOINTS.products, { query: { search: $("#q").value, category: $("#cat").value, minPrice: $("#min").value, maxPrice: $("#max").value } }), "products");
      list.innerHTML = items.length ? items.map(productCard).join("") : emptyState("No products found", "Try a different search or clear your filters.");
    } catch (e) { list.innerHTML = errorState(e.message); }
  }
  const d = debounce(load);
  ["q", "min", "max"].forEach((i) => $("#" + i).addEventListener("input", d));
  $("#cat").addEventListener("change", load);
  load();
})();
