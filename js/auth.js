const Auth = {
  token: () => localStorage.getItem(TOKEN_KEY),
  adminToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),
  isLoggedIn() { return !!this.token(); },
  require() { if (!this.isLoggedIn()) location.href = `${ROOT}pages/auth/login.html?next=${encodeURIComponent(location.pathname + location.search)}`; },
  requireAdmin() { if (!this.adminToken()) location.href = `${ROOT}pages/admin/login.html`; },
  logout() { localStorage.removeItem(TOKEN_KEY); location.href = `${ROOT}pages/auth/login.html`; },
  adminLogout() { localStorage.removeItem(ADMIN_TOKEN_KEY); location.href = `${ROOT}pages/admin/login.html`; }
};
function bindAuthForm(form, onSubmit) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]"), label = btn.textContent;
    $$(".field-error", form).forEach((n) => (n.textContent = ""));
    btn.disabled = true; btn.textContent = "Please wait...";
    try { await onSubmit(Object.fromEntries(new FormData(form))); }
    catch (err) {
      toast(err.message || "Something went wrong. Please try again.", "error");
      (Array.isArray(err.errors) ? err.errors : []).forEach((x) => {
        const el = form.querySelector(`[data-error="${x.field || x.path || x.param}"]`);
        if (el) el.textContent = x.message || x.msg;
      });
    } finally { btn.disabled = false; btn.textContent = label; }
  });
}
