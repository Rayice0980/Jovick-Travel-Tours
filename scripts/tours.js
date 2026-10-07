const tourButtons = document.querySelectorAll(".view-tour");

const tourDetails = document.getElementById("tourDetails");
const selectedTour = document.getElementById("selectedTour");
const tourMessage = document.getElementById("tourMessage");
const bookTourButton = document.getElementById("bookTourButton");
const bookingForm = document.getElementById("bookingForm");
const selectedTourInput = document.getElementById("selectedTourInput");
const tourBookingForm = document.getElementById("tourBookingForm");
const bookingMessage = document.getElementById("bookingMessage");
const tourDuration = document.getElementById("tourDuration");
const tourPrice = document.getElementById("tourPrice");
const selectedDuration = document.getElementById("selectedDuration");
const selectedPrice = document.getElementById("selectedPrice");
const bookingConfirmation =
  document.getElementById("bookingConfirmation");

const confirmationMessage =
  document.getElementById("confirmationMessage");

bookingConfirmation.style.display = "none";






tourButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const tourName = button.dataset.tour;
    const duration = button.dataset.duration;
    const price = button.dataset.price;

    selectedTour.textContent = tourName;

    tourDuration.textContent = "Duration: " + duration;
    tourPrice.textContent = "Price: " + price;

    tourMessage.textContent =
      "You have selected this tour. Ready to make your booking?";

    selectedTourInput.value = tourName;
    selectedDuration.value = duration;
    selectedPrice.value = price;

    tourDetails.style.display = "block";
  });
});



bookTourButton.addEventListener("click", function () {
  bookingForm.style.display = "block";
});


tourBookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const customerName = document.getElementById("customerName").value.trim();
  const customerEmail = document.getElementById("customerEmail").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const tourName = selectedTourInput.value;
  const duration = selectedDuration.value;
  const price = selectedPrice.value;

  if (customerName === "") {
    bookingMessage.textContent = "Please enter your full name.";
    return;
  }

  if (customerEmail === "") {
    bookingMessage.textContent = "Please enter your email address.";
    return;
  }

  if (customerPhone === "") {
    bookingMessage.textContent = "Please enter your phone number.";
    return;
  }

  

const booking = {
  tour: tourName,
  duration: duration,
  price: price,
  customerName: customerName,
  customerEmail: customerEmail,
  customerPhone: customerPhone
};

localStorage.setItem("tourBooking", JSON.stringify(booking));

console.log("Booking:", booking);

confirmationMessage.textContent =
  "Thank you, " +
  customerName +
  "! Your booking request for " +
  tourName +
  " (" +
  duration +
  ") at " +
  price +
  " has been received.";

tourBookingForm.style.display = "none";
bookingMessage.textContent = "";
bookingConfirmation.style.display = "block";

});


const savedBooking = localStorage.getItem("tourBooking");

if (savedBooking) {
  const booking = JSON.parse(savedBooking);

  console.log("Saved booking:", booking);
}