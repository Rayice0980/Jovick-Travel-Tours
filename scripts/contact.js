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

    /*
      Supabase submission will be connected here through the
      Jovick Travel & Tours Supabase Edge Function.

      The Netlify Forms submission has intentionally been removed.
    */

    showFormMessage(
      "Our contact service is being connected. Please try again shortly or contact us on WhatsApp.",
      "error"
    );
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
