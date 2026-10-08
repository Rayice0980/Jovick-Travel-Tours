/* =================================
   CONTACT PAGE JAVASCRIPT
   ================================= */

const contactForm = document.getElementById("contactForm");
const contactFormMessage = document.getElementById("contactFormMessage");
const contactSubmitButton = document.getElementById("contactSubmitButton");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");
const websiteInput = document.getElementById("website");

const SUPABASE_FUNCTION_URL =
  "https://rfswkddhhtjvcdwkykwp.supabase.co/functions/v1/contact-form";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_fM3wreQX_U3MgG3n7Sv9Fw_45e3MNOk";

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const subjectError = document.getElementById("subjectError");
const messageError = document.getElementById("messageError");


/* ---------- FORM HELPERS ---------- */

function showFieldError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

function clearFieldError(input, errorElement) {
  input.classList.remove("input-error");
  errorElement.textContent = "";
}

function clearAllErrors() {
  clearFieldError(nameInput, nameError);
  clearFieldError(emailInput, emailError);
  clearFieldError(subjectInput, subjectError);
  clearFieldError(messageInput, messageError);
}

function showFormMessage(message, type) {
  contactFormMessage.textContent = message;
  contactFormMessage.className = "contact-form-message show " + type;
}


/* ---------- VALIDATION ---------- */

function validateContactForm() {
  let isValid = true;

  clearAllErrors();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput.value.trim();
  const message = messageInput.value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2) {
    showFieldError(
      nameInput,
      nameError,
      "Please enter your full name."
    );
    isValid = false;
  }

  if (!emailPattern.test(email)) {
    showFieldError(
      emailInput,
      emailError,
      "Please enter a valid email address."
    );
    isValid = false;
  }

  if (subject.length < 3) {
    showFieldError(
      subjectInput,
      subjectError,
      "Please enter a subject."
    );
    isValid = false;
  }

  if (message.length < 10) {
    showFieldError(
      messageInput,
      messageError,
      "Please enter at least 10 characters."
    );
    isValid = false;
  }

  return isValid;
}


/* ---------- CONTACT FORM ---------- */

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateContactForm()) {
      showFormMessage(
        "Please correct the highlighted fields and try again.",
        "error"
      );
      return;
    }

    contactSubmitButton.disabled = true;
    contactSubmitButton.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    showFormMessage("Sending your message...", "info");

    console.info("[Jovick contact] Submitting to Supabase:", SUPABASE_FUNCTION_URL);

    fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_PUBLISHABLE_KEY
      },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        website: websiteInput ? websiteInput.value.trim() : ""
      })
    })
      .then(async function (response) {
        console.info("[Jovick contact] Supabase HTTP status:", response.status);

        const data = await response.json().catch(function () {
          return {};
        });

        console.info("[Jovick contact] Supabase response received:", {
          httpOk: response.ok,
          functionOk: data.ok === true
        });

        if (!response.ok || !data.ok) {
          throw new Error(
            data.error || "Unable to send your message."
          );
        }

        showFormMessage(
          "Thank you! Your message has been sent successfully. We will get back to you as soon as possible.",
          "success"
        );

        contactForm.reset();
        clearAllErrors();
      })
      .catch(function (error) {
        console.error("[Jovick contact] Supabase request failed:", error);

        showFormMessage(
          "Sorry, we could not send your message right now. Please try again or contact us on WhatsApp.",
          "error"
        );
      })
      .finally(function () {
        contactSubmitButton.disabled = false;
        contactSubmitButton.innerHTML =
          '<i class="fa-solid fa-paper-plane"></i> Send Message';
      });
  });
}


/* ---------- CLEAR ERRORS WHILE TYPING ---------- */

[nameInput, emailInput, subjectInput, messageInput].forEach(function (input) {
  if (!input) {
    return;
  }

  input.addEventListener("input", function () {
    input.classList.remove("input-error");

    const errorElement = document.getElementById(
      input.id + "Error"
    );

    if (errorElement) {
      errorElement.textContent = "";
    }

    contactFormMessage.className = "contact-form-message";
    contactFormMessage.textContent = "";
  });
});


/* ---------- FAQ ACCORDION ---------- */

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function (question) {
  question.addEventListener("click", function () {
    const currentItem = question.closest(".faq-item");
    const isOpen = currentItem.classList.contains("open");

    document.querySelectorAll(".faq-item").forEach(function (item) {
      item.classList.remove("open");

      const button = item.querySelector(".faq-question");

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    });

    if (!isOpen) {
      currentItem.classList.add("open");
      question.setAttribute("aria-expanded", "true");
    }
  });
});
