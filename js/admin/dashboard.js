Auth.requireAdmin();

const adminRoot = "/api/admin";
const $admin = (selector) => document.querySelector(selector);
const adminMessage = $admin("#admin-message");
const productForm = $admin("#product-form");
const categoryForm = $admin("#category-form");
const couponForm = $admin("#coupon-form");

$admin("#out").addEventListener("click", () => Auth.adminLogout());
$admin("#refresh-dashboard").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  try {
    await loadDashboard();
    toast("Dashboard refreshed");
  } finally {
    button.disabled = false;
  }
});
$admin("#search-products").addEventListener("click", loadProducts);
$admin("#product-search").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    loadProducts();
  }
});
$admin("#cancel-product-edit").addEventListener("click", resetProductForm);

function adminRequest(method, path, body, query) {
  const options = { admin: true };
  if (query) options.query = query;
  if (method === "GET") return api.get(`${adminRoot}${path}`, options);
  if (method === "POST") return api.post(`${adminRoot}${path}`, body, options);
  if (method === "PUT") return api.put(`${adminRoot}${path}`, body, options);
  if (method === "PATCH") return api.patch(`${adminRoot}${path}`, body, options);
  return api.delete(`${adminRoot}${path}`, { ...options, body });
}

function dataOf(result) {
  return result?.data ?? result;
}

function showAdminError(error) {
  if (error.status === 401 || error.status === 403) {
    Auth.adminLogout();
    return;
  }
  adminMessage.textContent = error.message || "The request failed.";
  adminMessage.classList.add("is-error");
}

function clearAdminMessage() {
  adminMessage.textContent = "";
  adminMessage.classList.remove("is-error");
}

function setTableMessage(id, message, columns) {
  $admin(`#${id}`).innerHTML = `<tr><td colspan="${columns}">${esc(message)}</td></tr>`;
}

function pageItems(result, key) {
  const data = dataOf(result);
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.[key]) ? data[key] : [];
}

function slugify(value) {
  return value.normalize("NFKD").toLowerCase()
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderStats(data) {
  const cards = [
    ["Products", data.products?.total ?? 0, `${data.products?.active ?? 0} active · ${data.products?.lowStock ?? 0} low stock`],
    ["Categories", data.categories?.total ?? 0, "Store catalog"],
    ["Orders", data.orders?.total ?? 0, `${data.orders?.pending ?? 0} awaiting fulfilment`],
    ["Customers", data.users?.customers ?? 0, `${data.users?.active ?? 0} active accounts`],
    ["Revenue", money(data.revenue?.total ?? 0), "Successful payments"],
    ["Reviews", data.reviews?.total ?? 0, `${data.reviews?.pendingApproval ?? 0} awaiting approval`]
  ];
  $admin("#stats").innerHTML = cards.map(([title, value, note]) =>
    `<article class="card stat"><small>${esc(title)}</small><b>${esc(value)}</b><span class="muted">${esc(note)}</span></article>`
  ).join("");
}

async function loadOverview() {
  try {
    const result = await adminRequest("GET", "/dashboard");
    renderStats(dataOf(result));
  } catch (error) {
    $admin("#stats").innerHTML = errorState(error.message);
    showAdminError(error);
  }
}

async function loadCategories() {
  try {
    const result = await adminRequest("GET", "/categories", null, { limit: 100 });
    const categories = pageItems(result, "categories");
    const categorySelect = productForm.elements.categoryId;
    const selected = categorySelect.value;
    categorySelect.innerHTML = `<option value="">Choose a category</option>${categories.map((category) =>
      `<option value="${esc(category.id)}">${esc(category.name)}</option>`
    ).join("")}`;
    if (categories.some((category) => category.id === selected)) categorySelect.value = selected;

    $admin("#category-rows").innerHTML = categories.length ? categories.map((category) => `
      <tr>
        <td>${category.image ? `<img class="admin-category-thumbnail" src="${esc(category.image)}" alt="${esc(category.name)}" loading="lazy">` : `<span class="muted">No image</span>`}</td>
        <td><strong>${esc(category.name)}</strong><small>${esc(category.slug)}</small></td>
        <td>${Number(category._count?.products ?? 0)}</td>
        <td><span class="admin-badge ${category.isActive ? "is-active" : ""}">${category.isActive ? "Active" : "Inactive"}</span></td>
        <td class="admin-actions">
          <label class="admin-category-upload">Upload image<input type="file" accept="image/jpeg,image/png,image/webp" data-category-upload="${esc(category.id)}" aria-label="Upload image for ${esc(category.name)}"></label>
          <button class="btn sm ghost" type="button" data-action="edit-category" data-id="${esc(category.id)}" data-name="${esc(category.name)}" data-slug="${esc(category.slug)}">Edit</button>
          <button class="btn sm ghost" type="button" data-action="toggle-category" data-id="${esc(category.id)}" data-active="${category.isActive}">${category.isActive ? "Deactivate" : "Activate"}</button>
          <button class="btn sm danger" type="button" data-action="delete-category" data-id="${esc(category.id)}">Delete</button>
        </td>
      </tr>`).join("") : `<tr><td colspan="5">No categories yet. Add a category before creating products.</td></tr>`;
  } catch (error) {
    setTableMessage("category-rows", error.message, 5);
    showAdminError(error);
  }
}

async function loadProducts() {
  setTableMessage("product-rows", "Loading products...", 7);
  try {
    const result = await adminRequest("GET", "/products", null, {
      limit: 100,
      search: $admin("#product-search").value.trim()
    });
    const products = pageItems(result, "products");
    $admin("#product-rows").innerHTML = products.length ? products.map((product) => `
      <tr>
        <td><strong>${esc(product.name)}</strong><small>SKU: ${esc(product.sku)}</small>${product.isFeatured ? `<small class="admin-featured">Featured</small>` : ""}</td>
        <td>${esc(product.category?.name || "—")}</td>
        <td>${money(product.price)}</td>
        <td>${Number(product.stock)}</td>
        <td>${Number(product.images?.length || 0)}</td>
        <td><span class="admin-badge ${product.isActive ? "is-active" : ""}">${product.isActive ? "Active" : "Inactive"}</span></td>
        <td class="admin-actions">
          <button class="btn sm ghost" type="button" data-action="edit-product" data-id="${esc(product.id)}">Edit</button>
          <button class="btn sm ghost" type="button" data-action="toggle-product" data-id="${esc(product.id)}" data-active="${product.isActive}">${product.isActive ? "Deactivate" : "Activate"}</button>
          <button class="btn sm danger" type="button" data-action="delete-product" data-id="${esc(product.id)}">Delete</button>
        </td>
      </tr>`).join("") : `<tr><td colspan="7">No products found.</td></tr>`;
  } catch (error) {
    setTableMessage("product-rows", error.message, 7);
    showAdminError(error);
  }
}

function resetProductForm() {
  productForm.reset();
  productForm.elements.id.value = "";
  productForm.elements.stock.value = "0";
  productForm.querySelector("#product-form-title").textContent = "Add a product";
  productForm.querySelector('[type="submit"]').textContent = "Save product";
  $admin("#cancel-product-edit").hidden = true;
  $admin("#product-images").innerHTML = "";
  $admin("#product-images").hidden = true;
}

function renderProductImages(images = []) {
  const box = $admin("#product-images");
  box.hidden = images.length === 0;
  box.innerHTML = images.length ? `<h4>Product images</h4><div class="admin-image-list">${images.map((image) => `
    <div class="admin-image-card">
      <img src="${esc(image.url)}" alt="">
      <span>${image.isPrimary ? "Primary image" : "Product image"}</span>
      <div class="admin-actions">
        ${image.isPrimary ? "" : `<button class="btn sm ghost" type="button" data-action="primary-image" data-id="${esc(productForm.elements.id.value)}" data-image-id="${esc(image.id)}">Make primary</button>`}
        ${image.publicId ? `<button class="btn sm danger" type="button" data-action="delete-image" data-public-id="${esc(image.publicId)}">Delete image</button>` : ""}
      </div>
    </div>`).join("")}</div>` : "";
}

productForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!productForm.reportValidity()) return;
  clearAdminMessage();
  const formData = new FormData(productForm);
  const id = formData.get("id");
  const name = String(formData.get("name")).trim();
  const body = {
    name,
    slug: slugify(name),
    description: String(formData.get("description")).trim(),
    price: Number(formData.get("price")),
    comparePrice: formData.get("comparePrice") ? Number(formData.get("comparePrice")) : null,
    stock: Number(formData.get("stock")),
    sku: String(formData.get("sku")).trim().toUpperCase(),
    brand: String(formData.get("brand")).trim() || null,
    categoryId: String(formData.get("categoryId")),
    isFeatured: productForm.elements.isFeatured.checked
  };
  const button = productForm.querySelector('[type="submit"]');
  button.disabled = true;
  try {
    const result = await adminRequest(id ? "PUT" : "POST", id ? `/products/${encodeURIComponent(id)}` : "/products", body);
    const savedProduct = dataOf(result);
    const productId = id || savedProduct.id;
    const imageFile = formData.get("image");
    resetProductForm();
    await Promise.all([loadProducts(), loadOverview()]);
    if (imageFile?.size) {
      if (!productId) throw new Error("Product saved, but its ID was not returned so the image could not be uploaded.");
      if (imageFile.size > 5 * 1024 * 1024) throw new Error("Product saved, but the image exceeds the 5 MB limit.");
      const upload = new FormData();
      upload.append("image", imageFile);
      try {
        await api.post(`${adminRoot}/uploads/products/${encodeURIComponent(productId)}/image`, upload, { admin: true });
      } catch (error) {
        throw new Error(`Product saved, but the image could not be uploaded: ${error.message}`);
      }
      await loadProducts();
    }
    toast(id ? "Product updated" : "Product added");
  } catch (error) {
    showAdminError(error);
  } finally {
    button.disabled = false;
  }
});

categoryForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!categoryForm.reportValidity()) return;
  const values = new FormData(categoryForm);
  const name = String(values.get("name")).trim();
  const imageFile = values.get("image");
  if (imageFile?.size && !["image/jpeg", "image/png", "image/webp"].includes(imageFile.type)) {
    showAdminError(new Error("Choose a JPEG, PNG, or WebP category image."));
    return;
  }
  if (imageFile?.size > 5 * 1024 * 1024) {
    showAdminError(new Error("Category image must be 5 MB or smaller."));
    return;
  }
  const button = categoryForm.querySelector('[type="submit"]');
  button.disabled = true;
  clearAdminMessage();
  let categoryCreated = false;
  try {
    const result = await adminRequest("POST", "/categories", {
      name,
      slug: slugify(name),
      description: String(values.get("description")).trim() || null
    });
    const category = dataOf(result);
    categoryCreated = true;
    categoryForm.reset();
    if (imageFile?.size) {
      if (!category.id) throw new Error("Category was created, but the server did not return its ID, so its image could not be uploaded.");
      try {
        await uploadCategoryImage(category.id, imageFile);
      } catch (error) {
        throw new Error(`Category was created, but its image could not be uploaded: ${error.message}`);
      }
    }
    toast("Category added");
    await Promise.all([loadCategories(), loadOverview()]);
  } catch (error) {
    if (categoryCreated) await Promise.all([loadCategories(), loadOverview()]);
    showAdminError(error);
  } finally {
    button.disabled = false;
  }
});

async function uploadCategoryImage(categoryId, file) {
  if (!file || !file.size) throw new Error("Choose an image file to upload.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Choose a JPEG, PNG, or WebP image.");
  }
  if (file.size > 5 * 1024 * 1024) throw new Error("Category image must be 5 MB or smaller.");
  const upload = new FormData();
  upload.append("image", file);
  return api.post(`${adminRoot}/uploads/categories/${encodeURIComponent(categoryId)}/image`, upload, { admin: true });
}

$admin("#category-rows").addEventListener("change", async (event) => {
  const input = event.target.closest("[data-category-upload]");
  const file = input?.files?.[0];
  if (!input || !file) return;
  input.disabled = true;
  clearAdminMessage();
  try {
    await uploadCategoryImage(input.dataset.categoryUpload, file);
    await loadCategories();
    toast("Category image updated");
  } catch (error) {
    showAdminError(error);
    input.value = "";
  } finally {
    input.disabled = false;
  }
});

async function loadOrders() {
  try {
    const result = await adminRequest("GET", "/orders", null, { limit: 100 });
    const orders = pageItems(result, "orders");
    $admin("#order-rows").innerHTML = orders.length ? orders.map((order) => `
      <tr>
        <td><strong>${esc(order.orderNumber || order.id)}</strong><small>${esc(fmtDate(order.createdAt))}</small></td>
        <td>${esc([order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") || order.user?.email || "—")}<small>${esc(order.user?.email || "")}</small></td>
        <td>${esc(fmtDate(order.createdAt))}</td>
        <td>${money(order.totalAmount)}</td>
        <td><span class="admin-badge">${esc(order.paymentStatus || "—")}</span></td>
        <td><select class="admin-status-select" data-order-status="${esc(order.id)}" aria-label="Order status">${( {
          PENDING: ["PENDING", "PROCESSING", "CANCELLED"],
          PROCESSING: ["PROCESSING", "SHIPPED", "CANCELLED"],
          SHIPPED: ["SHIPPED", "DELIVERED"],
          DELIVERED: ["DELIVERED"],
          CANCELLED: ["CANCELLED"]
        }[order.status] || [order.status]).map((status) => `<option value="${status}" ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
      </tr>`).join("") : `<tr><td colspan="6">No orders yet.</td></tr>`;
  } catch (error) {
    setTableMessage("order-rows", error.message, 6);
    showAdminError(error);
  }
}

$admin("#order-rows").addEventListener("change", async (event) => {
  const select = event.target.closest("[data-order-status]");
  if (!select) return;
  select.disabled = true;
  clearAdminMessage();
  try {
    await adminRequest("PATCH", `/orders/${encodeURIComponent(select.dataset.orderStatus)}/status`, { status: select.value });
    toast("Order status updated");
    loadOverview();
  } catch (error) {
    showAdminError(error);
    await loadOrders();
  } finally {
    select.disabled = false;
  }
});

async function loadCustomers() {
  try {
    const result = await adminRequest("GET", "/users", null, { limit: 100 });
    const customers = pageItems(result, "users").filter((user) => user.role === "CUSTOMER");
    $admin("#customer-rows").innerHTML = customers.length ? customers.map((user) => `
      <tr>
        <td>${esc(`${user.firstName} ${user.lastName}`.trim())}</td>
        <td>${esc(user.email)}</td>
        <td>${Number(user._count?.orders ?? 0)}</td>
        <td><span class="admin-badge ${user.isActive ? "is-active" : ""}">${user.isActive ? "Active" : "Inactive"}</span></td>
        <td><button class="btn sm ghost" type="button" data-action="toggle-customer" data-id="${esc(user.id)}" data-active="${user.isActive}">${user.isActive ? "Deactivate" : "Activate"}</button></td>
      </tr>`).join("") : `<tr><td colspan="5">No customer accounts yet.</td></tr>`;
  } catch (error) {
    setTableMessage("customer-rows", error.message, 5);
    showAdminError(error);
  }
}

async function loadCoupons() {
  try {
    const result = await adminRequest("GET", "/coupons", null, { limit: 100 });
    const coupons = pageItems(result, "coupons");
    $admin("#coupon-rows").innerHTML = coupons.length ? coupons.map((coupon) => `
      <tr>
        <td><strong>${esc(coupon.code)}</strong></td>
        <td>${coupon.discountType === "PERCENTAGE" ? `${esc(coupon.discountValue)}%` : money(coupon.discountValue)}</td>
        <td>${Number(coupon.usedCount ?? coupon._count?.usages ?? 0)}${coupon.maximumUses ? ` / ${Number(coupon.maximumUses)}` : ""}</td>
        <td><span class="admin-badge ${coupon.isActive ? "is-active" : ""}">${coupon.isActive ? "Active" : "Inactive"}</span></td>
        <td class="admin-actions"><button class="btn sm ghost" type="button" data-action="toggle-coupon" data-id="${esc(coupon.id)}" data-active="${coupon.isActive}">${coupon.isActive ? "Deactivate" : "Activate"}</button><button class="btn sm danger" type="button" data-action="delete-coupon" data-id="${esc(coupon.id)}">Delete</button></td>
      </tr>`).join("") : `<tr><td colspan="5">No coupons created.</td></tr>`;
  } catch (error) {
    setTableMessage("coupon-rows", error.message, 5);
    showAdminError(error);
  }
}

couponForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!couponForm.reportValidity()) return;
  const values = new FormData(couponForm);
  const button = couponForm.querySelector('[type="submit"]');
  button.disabled = true;
  clearAdminMessage();
  try {
    await adminRequest("POST", "/coupons", {
      code: String(values.get("code")).trim().toUpperCase(),
      discountType: values.get("discountType"),
      discountValue: Number(values.get("discountValue")),
      minimumAmount: Number(values.get("minimumAmount"))
    });
    couponForm.reset();
    couponForm.elements.minimumAmount.value = "0";
    toast("Coupon created");
    await Promise.all([loadCoupons(), loadOverview()]);
  } catch (error) {
    showAdminError(error);
  } finally {
    button.disabled = false;
  }
});

async function loadReviews() {
  try {
    const result = await adminRequest("GET", "/reviews", null, { limit: 100 });
    const reviews = pageItems(result, "reviews");
    $admin("#review-rows").innerHTML = reviews.length ? reviews.map((review) => `
      <tr>
        <td>${esc(review.product?.name || "—")}</td>
        <td>${esc([review.user?.firstName, review.user?.lastName].filter(Boolean).join(" ") || "—")}</td>
        <td>${Number(review.rating)} / 5</td>
        <td class="admin-review-text">${esc(review.comment || "")}</td>
        <td><span class="admin-badge ${review.isApproved ? "is-active" : ""}">${review.isApproved ? "Approved" : "Pending"}</span></td>
        <td class="admin-actions"><button class="btn sm ghost" type="button" data-action="toggle-review" data-id="${esc(review.id)}" data-approved="${review.isApproved}">${review.isApproved ? "Unapprove" : "Approve"}</button><button class="btn sm danger" type="button" data-action="delete-review" data-id="${esc(review.id)}">Delete</button></td>
      </tr>`).join("") : `<tr><td colspan="6">No reviews yet.</td></tr>`;
  } catch (error) {
    setTableMessage("review-rows", error.message, 6);
    showAdminError(error);
  }
}

async function loadPayments() {
  try {
    const result = await adminRequest("GET", "/payments", null, { limit: 100 });
    const payments = pageItems(result, "payments");
    $admin("#payment-rows").innerHTML = payments.length ? payments.map((payment) => `
      <tr>
        <td><strong>${esc(payment.reference)}</strong></td>
        <td>${esc(payment.order?.orderNumber || payment.orderId || "—")}</td>
        <td>${money(payment.amount)}</td>
        <td>${esc(payment.gateway || "—")}</td>
        <td><span class="admin-badge">${esc(payment.status || "—")}</span></td>
        <td>${esc(fmtDate(payment.createdAt))}</td>
      </tr>`).join("") : `<tr><td colspan="6">No payments yet.</td></tr>`;
  } catch (error) {
    setTableMessage("payment-rows", error.message, 6);
    showAdminError(error);
  }
}

async function handleAdminAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  clearAdminMessage();

  try {
    if (action === "edit-product") {
      const result = await adminRequest("GET", `/products/${encodeURIComponent(id)}`);
      const product = dataOf(result);
      for (const key of ["id", "name", "sku", "categoryId", "brand", "price", "comparePrice", "stock", "description"]) {
        productForm.elements[key].value = product[key] ?? "";
      }
      productForm.elements.isFeatured.checked = Boolean(product.isFeatured);
      productForm.querySelector("#product-form-title").textContent = "Edit product";
      productForm.querySelector('[type="submit"]').textContent = "Update product";
      $admin("#cancel-product-edit").hidden = false;
      renderProductImages(product.images || []);
      productForm.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    if (action === "primary-image") {
      await adminRequest("PATCH", `/uploads/products/${encodeURIComponent(id)}/image/${encodeURIComponent(button.dataset.imageId)}/primary`);
      const result = await adminRequest("GET", `/products/${encodeURIComponent(id)}`);
      renderProductImages(dataOf(result).images || []);
      await loadProducts();
      toast("Primary product image updated");
      return;
    }

    if (action === "delete-image") {
      const confirmed = await confirmDialog({
        title: "Delete product image?",
        text: "This removes the image from the product gallery.",
        confirmLabel: "Delete image"
      });
      if (!confirmed) return;
      await adminRequest("DELETE", "/uploads/image", { publicId: button.dataset.publicId });
      const productId = productForm.elements.id.value;
      if (productId) {
        const result = await adminRequest("GET", `/products/${encodeURIComponent(productId)}`);
        renderProductImages(dataOf(result).images || []);
        await loadProducts();
      }
      toast("Product image deleted");
      return;
    }

    if (action === "edit-category") {
      const currentName = button.dataset.name;
      const name = window.prompt("Update category name:", currentName);
      if (name === null) return;
      const trimmed = name.trim();
      if (trimmed.length < 2) throw new Error("Category name must have at least 2 characters.");
      await adminRequest("PUT", `/categories/${encodeURIComponent(id)}`, {
        name: trimmed,
        slug: slugify(trimmed)
      });
      toast("Category updated");
      await Promise.all([loadCategories(), loadOverview()]);
      return;
    }

    if (action === "toggle-product") {
      await adminRequest("PATCH", `/products/${encodeURIComponent(id)}/status`, { isActive: button.dataset.active !== "true" });
      toast("Product status updated");
      await Promise.all([loadProducts(), loadOverview()]);
      return;
    }
    if (action === "toggle-category") {
      await adminRequest("PATCH", `/categories/${encodeURIComponent(id)}/status`, { isActive: button.dataset.active !== "true" });
      toast("Category status updated");
      await Promise.all([loadCategories(), loadOverview()]);
      return;
    }
    if (action === "toggle-customer") {
      await adminRequest("PATCH", `/users/${encodeURIComponent(id)}/status`, { isActive: button.dataset.active !== "true" });
      toast("Customer status updated");
      await loadCustomers();
      return;
    }
    if (action === "toggle-coupon") {
      await adminRequest("PATCH", `/coupons/${encodeURIComponent(id)}/status`, { isActive: button.dataset.active !== "true" });
      toast("Coupon status updated");
      await loadCoupons();
      return;
    }
    if (action === "toggle-review") {
      await adminRequest("PATCH", `/reviews/${encodeURIComponent(id)}/approval`, { isApproved: button.dataset.approved !== "true" });
      toast("Review approval updated");
      await Promise.all([loadReviews(), loadOverview()]);
      return;
    }

    const confirmed = await confirmDialog({
      title: action === "delete-product" ? "Delete product?" : action === "delete-category" ? "Delete category?" : action === "delete-coupon" ? "Delete coupon?" : "Delete review?",
      text: "This action cannot be undone. If a product has order history, deactivate it instead.",
      confirmLabel: "Delete"
    });
    if (!confirmed) return;

    const resource = {
      "delete-product": "products",
      "delete-category": "categories",
      "delete-coupon": "coupons",
      "delete-review": "reviews"
    }[action];
    await adminRequest("DELETE", `/${resource}/${encodeURIComponent(id)}`);
    toast("Item deleted");
    await Promise.all([loadProducts(), loadCategories(), loadCoupons(), loadReviews(), loadOverview()]);
  } catch (error) {
    showAdminError(error);
  }
}

for (const id of ["product-rows", "category-rows", "customer-rows", "coupon-rows", "review-rows", "product-images"]) {
  $admin(`#${id}`).addEventListener("click", handleAdminAction);
}

async function loadDashboard() {
  clearAdminMessage();
  await Promise.all([
    loadOverview(),
    loadCategories(),
    loadProducts(),
    loadOrders(),
    loadCustomers(),
    loadCoupons(),
    loadReviews(),
    loadPayments()
  ]);
}

loadDashboard();
