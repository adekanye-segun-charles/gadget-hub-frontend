// Single place to change the API URL (e.g. for production).
const API_BASE_URL = window.GADGET_HUB_API_URL || "http://localhost:3000";
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
const SITE = { email: "support@gadgethub.ng", phone: "+234 800 000 0000", address: "Lagos, Nigeria", hours: "Mon - Sat, 8am - 7pm" };
