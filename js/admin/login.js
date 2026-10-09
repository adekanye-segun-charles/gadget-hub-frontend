const loginForm = $("#f");
bindPasswordToggles(loginForm);
bindAuthForm(loginForm, async (v) => {
  const r = await api.post(ENDPOINTS.login, v, { auth: false });
  const role = r.data.user?.role; if (role && role !== "ADMIN") throw new ApiError("You do not have permission to perform this action.", 403);
  localStorage.setItem(ADMIN_TOKEN_KEY, r.data.token); location.href = "dashboard.html";
});
