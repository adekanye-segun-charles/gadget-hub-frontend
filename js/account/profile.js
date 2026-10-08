Auth.require();

const profileForm = $("#profile-form");

function submitWithFeedback(form, message, callback) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    try {
      await callback(Object.fromEntries(new FormData(form)));
      toast(message);
    } catch (error) {
      toast(error.message, "error");
    } finally {
      button.disabled = false;
    }
  });
}

async function loadProfile() {
  try {
    const result = await api.get(ENDPOINTS.me);
    const user = result.data;
    for (const key of ["firstName", "lastName", "email", "phone"]) {
      profileForm.elements[key].value = user[key] || "";
    }
  } catch (error) {
    toast(error.message, "error");
  }
}

submitWithFeedback(profileForm, "Profile updated", async (data) => {
  delete data.email;
  await api.put(ENDPOINTS.me, data);
});

$("#logout").addEventListener("click", () => Auth.logout());
loadProfile();
