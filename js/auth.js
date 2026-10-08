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

function bindPasswordToggles(form) {
  const eye = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  const eyeOff = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.7 10.7 0 0 0 4-.8"/></svg>';

  $$("[data-toggle-password]", form).forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const input = document.getElementById(toggle.getAttribute("aria-controls"));
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      toggle.setAttribute("aria-pressed", String(visible));
      toggle.setAttribute("aria-label", `${visible ? "Hide" : "Show"} password`);
      toggle.innerHTML = visible ? eyeOff : eye;
    });
  });
}
