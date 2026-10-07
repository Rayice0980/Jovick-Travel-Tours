const viewAllToursButton =
  document.getElementById("viewAllTours");

const extraTours =
  document.getElementById("extraTours");


viewAllToursButton.addEventListener("click", function () {

  extraTours.classList.toggle("show");

  if (extraTours.classList.contains("show")) {

    viewAllToursButton.textContent = "Show Less";

  } else {

    viewAllToursButton.textContent = "View All Tours";

  }

});