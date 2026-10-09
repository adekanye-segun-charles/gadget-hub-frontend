// Override with window.GADGET_HUB_API_URL when needed; use the hosted API by default.
const API_BASE_URL = window.GADGET_HUB_API_URL || "https://gadget-hub-backend-cqy7.onrender.com";
// Routes whose exact shape lives in your backend: adjust here if yours differ.
const ENDPOINTS = {
  login: "/api/auth/login", register: "/api/auth/register", me: "/api/users/me",
  forgotPassword: "/api/auth/forgot-password", resetPassword: "/api/auth/reset-password",
  categories: "/api/categories", products: "/api/products",
  cart: "/api/cart", cartItem: (id) => `/api/cart/${id}`,
  wishlist: "/api/wishlist", wishlistItem: (id) => `/api/wishlist/${id}`,
  addresses: "/api/addresses", orders: "/api/orders",
  initializePayment: "/api/payments/initialize",
  verifyPayment: (reference) => `/api/payments/verify/${encodeURIComponent(reference)}`,
  adminDashboard: "/api/admin/dashboard"
};
const TOKEN_KEY = "gadgetHubToken", ADMIN_TOKEN_KEY = "gadgetHubAdminToken";
// Contact details shown in the footer. Replace with your real details.
const SITE = { email: "adekanyeseguncharles@gmail.com", phone: "+234 9128327370", address: "Ilorin, Nigeria", hours: "Mon - Sat, 8am - 10pm" };
