const f = $("#f"), isReg = !!f.elements.confirm, next = params().next;
bindAuthForm(f, async (v) => {
  if (isReg) {
    if (v.password !== v.confirm) throw new ApiError("Passwords do not match.", 400);
    delete v.confirm; await api.post(ENDPOINTS.register, v, { auth: false });
    toast("Account created. Please log in."); setTimeout(() => (location.href = "login.html"), 900); return;
  }
  const r = await api.post(ENDPOINTS.login, v, { auth: false });
  localStorage.setItem(TOKEN_KEY, r.data.token); location.href = next || `${ROOT}index.html`;
});
