const f = $("#f"), isReg = !!f.elements.confirm, requestedNext = params().next;
bindPasswordToggles(f);

if (isReg) {
  const password = f.elements.password;
  const strength = $(".password-strength", f);
  const strengthLabel = $(".password-strength-label", f);
  const strengthNames = ["", "Very weak", "Weak", "Fair", "Good", "Strong"];
  password.addEventListener("input", () => {
    const value = password.value;
    const checks = [
      value.length >= 8,
      value.length >= 12,
      /[a-z]/.test(value) && /[A-Z]/.test(value),
      /\d/.test(value),
      /[^A-Za-z0-9]/.test(value),
    ];
    const score = checks.filter(Boolean).length;
    const name = value ? strengthNames[score] : "";
    strength.dataset.strength = String(score);
    strength.setAttribute("aria-valuenow", String(score));
    strength.setAttribute("aria-valuetext", name || "No password entered");
    strengthLabel.textContent = name
      ? `Password strength: ${name}`
      : "Use at least 8 characters for a stronger password.";
  });
}
let next = `${ROOT}index.html`;
if (requestedNext) {
  try {
    const target = new URL(requestedNext, location.origin);
    if (target.origin === location.origin) {
      next = `${target.pathname}${target.search}${target.hash}`;
    }
  } catch {
    next = `${ROOT}index.html`;
  }
}
bindAuthForm(f, async (v) => {
  if (isReg) {
    if (v.password !== v.confirm) throw new ApiError("Passwords do not match.", 400);
    delete v.confirm; await api.post(ENDPOINTS.register, v, { auth: false });
    toast("Account created. Please log in."); setTimeout(() => (location.href = "login.html"), 900); return;
  }
  const r = await api.post(ENDPOINTS.login, v, { auth: false });
  const token = r.data?.token;
  if (typeof token !== "string" || !token) {
    throw new ApiError("Login completed without a session token. Please try again.", 502);
  }
  localStorage.setItem(TOKEN_KEY, token); location.href = next;
});
