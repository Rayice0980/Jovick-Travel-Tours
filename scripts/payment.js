const PAYMENT_FUNCTION_URL =
  "https://rfswkddhhtjvcdwkykwp.supabase.co/functions/v1/contact-form";

const PAYMENT_PUBLISHABLE_KEY =
  "sb_publishable_fM3wreQX_U3MgG3n7Sv9Fw_45e3MNOk";

const bookingSummary = document.getElementById("paymentBookingSummary");
const bankPaymentPanel = document.getElementById("bankPaymentPanel");
const cardPaymentPanel = document.getElementById("cardPaymentPanel");
const paymentPageMessage = document.getElementById("paymentPageMessage");
const paymentMadeButton = document.getElementById("paymentMadeButton");
const copyPaymentAccount = document.getElementById("copyPaymentAccount");
const paymentCopyMessage = document.getElementById("paymentCopyMessage");

let booking = null;
try {
  booking = JSON.parse(localStorage.getItem("tourBooking") || "null");
} catch (error) {
  booking = null;
}

const paymentMethod = localStorage.getItem("selectedPaymentMethod");

function money(amount) {
  return "₦" + Number(amount || 0).toLocaleString("en-NG");
}

if (!booking || !paymentMethod) {
  bookingSummary.innerHTML =
    "<p>Your booking details are not available. Please return to the tour details page and submit your booking first.</p>";
  bankPaymentPanel.hidden = true;
  cardPaymentPanel.hidden = true;
  paymentMadeButton.disabled = true;
} else {
  bookingSummary.innerHTML = [
    "<h2>Booking Summary</h2>",
    "<p><span>Tour</span><strong>" + escapeHtml(booking.tour) + "</strong></p>",
    "<p><span>Customer</span><strong>" + escapeHtml(booking.customerName) + "</strong></p>",
    "<p><span>Travel date</span><strong>" + escapeHtml(booking.travelDate) + "</strong></p>",
    "<p><span>Travelers</span><strong>" + escapeHtml(booking.numberOfTravelers) + "</strong></p>",
    "<p><span>Estimated total</span><strong>" + money(booking.totalPrice) + "</strong></p>",
    "<p><span>Payment method</span><strong>" + (paymentMethod === "bank" ? "Bank Transfer" : "Card Payment") + "</strong></p>"
  ].join("");

  bankPaymentPanel.hidden = paymentMethod !== "bank";
  cardPaymentPanel.hidden = paymentMethod !== "card";
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character];
  });
}

copyPaymentAccount.addEventListener("click", async function () {
  const accountNumber =
    document.getElementById("paymentAccountNumber").textContent.trim();
  try {
    await navigator.clipboard.writeText(accountNumber);
    paymentCopyMessage.textContent = "Account number copied.";
  } catch (error) {
    paymentCopyMessage.textContent =
      "Please copy this account number manually: " + accountNumber;
  }
});

paymentMadeButton.addEventListener("click", async function () {
  if (!booking || paymentMethod !== "bank") {
    return;
  }

  paymentMadeButton.disabled = true;
  paymentMadeButton.textContent = "Sending confirmation…";
  paymentPageMessage.textContent = "Notifying our team. Please wait.";

  const message = [
    "A customer has reported making a bank transfer for a Jovick Travel & Tours booking.",
    "",
    "PAYMENT STATUS: Customer reported payment; transfer is NOT verified.",
    "Payment method: Bank Transfer",
    "Tour: " + booking.tour,
    "Destination: " + booking.location,
    "Customer name: " + booking.customerName,
    "Customer email: " + booking.customerEmail,
    "Customer phone: " + booking.customerPhone,
    "Travel date: " + booking.travelDate,
    "Number of travelers: " + booking.numberOfTravelers,
    "Estimated booking total: " + money(booking.totalPrice),
    "",
    "Please contact the customer and verify the transfer against the bank account before marking this booking as paid."
  ].join("\n");

  try {
    const response = await fetch(PAYMENT_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": PAYMENT_PUBLISHABLE_KEY
      },
      body: JSON.stringify({
        name: booking.customerName,
        email: booking.customerEmail,
        subject: "Payment reported - verify transfer: " + booking.tour,
        message: message,
        website: ""
      })
    });

    const data = await response.json().catch(function () {
      return {};
    });

    if (!response.ok || data.ok !== true) {
      throw new Error(data.error || "Could not send payment confirmation.");
    }

    localStorage.setItem("paymentConfirmationSubmitted", "true");
    paymentPageMessage.textContent =
      "Thank you. We have received your payment notification. Your transfer is still pending verification; our team will confirm it before marking your booking as paid.";
    paymentPageMessage.className = "payment-status-message success";
    paymentMadeButton.textContent = "Payment notification sent";
  } catch (error) {
    console.error("[Jovick payment confirmation] Submission failed:", error);
    paymentPageMessage.textContent =
      "We could not send your notification. Please contact Jovick Travel & Tours directly and keep your transfer receipt.";
    paymentPageMessage.className = "payment-status-message error";
    paymentMadeButton.disabled = false;
    paymentMadeButton.textContent = "I have made a payment";
  }
});
