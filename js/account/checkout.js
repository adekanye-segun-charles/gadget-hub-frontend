Auth.require();

const form = $("#checkout-form");
const statusBox = $("#checkout-status");
const submitButton = $("#checkout-submit");
const itemsBox = $("#checkout-items");
const pendingOrderKey = "gadgetHubPendingOrderId";
let pendingOrderId = sessionStorage.getItem(pendingOrderKey);
let cartIsEmpty = false;

function setCheckoutStatus(message) {
  statusBox.textContent = message;
}

async function verifyReturnPayment() {
  const query = params();
  const reference = query.reference || query.trxref;
  if (!reference) return;

  submitButton.disabled = true;
  setCheckoutStatus("Confirming your payment...");
  try {
    const result = await api.get(ENDPOINTS.verifyPayment(reference));
    if (!result.success) {
      setCheckoutStatus(result.message || "Payment was not completed. You can retry from this page.");
      submitButton.disabled = !pendingOrderId;
      return;
    }
    sessionStorage.removeItem(pendingOrderKey);
    pendingOrderId = null;
    setCheckoutStatus(`Payment confirmed. Order ${result.order?.orderNumber || ""} is being processed.`);
  } catch (error) {
    setCheckoutStatus(`We could not confirm your payment: ${error.message}. Please retry or contact support before paying again.`);
    submitButton.disabled = !pendingOrderId;
  }
}

async function loadCart() {
  try {
    const result = await api.get(ENDPOINTS.cart);
    const data = result.data ?? result;
    const items = listOf(result, "items");
    cartIsEmpty = items.length === 0;
    itemsBox.innerHTML = items.length
      ? items.map((item) => {
          const product = item.product || item;
          return `<div class="checkout-item"><span>${esc(product.name)} × ${Number(item.quantity || 1)}</span><strong>${money(Number(product.price) * Number(item.quantity || 1))}</strong></div>`;
        }).join("")
      : emptyState("Your cart is empty", "Add products before starting a new order.", `<a class="btn ghost" href="../shop/products.html">Browse products</a>`);
    const subtotal = data.subtotal ?? data.total ?? items.reduce(
      (sum, item) => sum + Number(item.product?.price ?? item.price) * Number(item.quantity || 1),
      0
    );
    $("#checkout-total").textContent = money(subtotal);
    submitButton.disabled = cartIsEmpty && !pendingOrderId;
    if (pendingOrderId && cartIsEmpty) {
      submitButton.textContent = "Retry payment for pending order";
      setCheckoutStatus("You have an unpaid order. You can retry its payment without creating a duplicate order.");
    }
  } catch (error) {
    itemsBox.innerHTML = errorState(error.message);
    submitButton.disabled = true;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  const originalLabel = submitButton.textContent;
  submitButton.textContent = "Preparing secure payment...";
  setCheckoutStatus("");

  try {
    if (!pendingOrderId) {
      if (cartIsEmpty) throw new Error("Your cart is empty.");
      const addressResult = await api.post(
        ENDPOINTS.addresses,
        Object.fromEntries(new FormData(form))
      );
      const addressId = addressResult.data?.id;
      if (!addressId) throw new Error("The delivery address could not be saved.");

      const orderResult = await api.post(ENDPOINTS.orders, { addressId });
      pendingOrderId = orderResult.data?.id;
      if (!pendingOrderId) throw new Error("The order was created without an order ID.");
      sessionStorage.setItem(pendingOrderKey, pendingOrderId);
    }

    const paymentResult = await api.post(ENDPOINTS.initializePayment, {
      orderId: pendingOrderId
    });
    const payment = paymentResult.data;
    if (!payment?.authorizationUrl) {
      throw new Error("Your order is saved, but the payment provider did not return a payment link. Retry shortly.");
    }
    location.assign(payment.authorizationUrl);
  } catch (error) {
    if (pendingOrderId) await loadCart();
    setCheckoutStatus(error.message || "Checkout could not be completed. Please try again.");
    submitButton.disabled = false;
    submitButton.textContent = pendingOrderId ? "Retry payment for pending order" : originalLabel;
  }
});

(async () => {
  await loadCart();
  await verifyReturnPayment();
})();
