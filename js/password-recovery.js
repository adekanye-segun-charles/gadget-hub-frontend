const forgotForm = $("#forgot-password-form");
const resetForm = $("#reset-password-form");

if (forgotForm) {
  forgotForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!forgotForm.reportValidity()) return;

    const button = forgotForm.querySelector('[type="submit"]');
    const status = $("#forgot-status");
    button.disabled = true;
    status.textContent = "";
    status.classList.remove("is-error");
    try {
      await api.post(ENDPOINTS.forgotPassword, {
        email: forgotForm.elements.email.value.trim(),
      }, { auth: false });
      status.textContent = "If an account exists for that email, a password reset link has been sent.";
      forgotForm.reset();
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("is-error");
    } finally {
      button.disabled = false;
    }
  });
}

if (resetForm) {
  bindPasswordToggles(resetForm);
  const token = new URLSearchParams(location.search).get("token") || "";
  const status = $("#reset-status");
  const submit = resetForm.querySelector('[type="submit"]');
  resetForm.elements.token.value = token;

  if (!/^[a-f\d]{64}$/i.test(token)) {
    status.textContent = "This password reset link is invalid. Request a new one.";
    status.classList.add("is-error");
    submit.disabled = true;
  }

  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!resetForm.reportValidity()) return;

    if (resetForm.elements.newPassword.value !== resetForm.elements.confirmPassword.value) {
      status.textContent = "Passwords do not match.";
      status.classList.add("is-error");
      resetForm.elements.confirmPassword.focus();
      return;
    }

    submit.disabled = true;
    status.textContent = "";
    status.classList.remove("is-error");
    try {
      await api.post(ENDPOINTS.resetPassword, {
        token,
        newPassword: resetForm.elements.newPassword.value,
        confirmPassword: resetForm.elements.confirmPassword.value,
      }, { auth: false });
      status.textContent = "Password reset successfully. Redirecting to login...";
      resetForm.reset();
      setTimeout(() => { location.href = "login.html"; }, 1600);
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("is-error");
      submit.disabled = false;
    }
  });
}
