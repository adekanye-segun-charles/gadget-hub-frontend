Auth.requireAdmin(); $("#out").onclick = () => Auth.adminLogout();
(async () => {
  const s = $("#stats"); s.innerHTML = skeletons(4);
  try {
    const d = (await api.get(ENDPOINTS.adminDashboard, { admin: true })).data || {};
    // Render whatever numeric stats the backend returns (flattening one level).
    const rows = Object.entries(d).flatMap(([k, v]) => v && typeof v === "object" && !Array.isArray(v) ? Object.entries(v).map(([k2, v2]) => [`${k} ${k2}`, v2]) : [[k, v]]).filter(([, v]) => ["number", "string"].includes(typeof v));
    const label = (k) => k.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
    s.innerHTML = rows.length ? rows.map(([k, v]) => `<div class="card stat"><small>${esc(label(k))}</small><b>${/revenue|sales|amount/i.test(k) ? money(v) : esc(v)}</b></div>`).join("") : emptyState("No statistics yet", "Data will appear as customers use the store.");
  } catch (e) { if (e.status === 401 || e.status === 403) return Auth.adminLogout(); s.innerHTML = errorState(e.message); }
})();
