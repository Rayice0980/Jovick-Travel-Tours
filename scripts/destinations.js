const destinationFilters =
  document.querySelectorAll(".destination-filter");

const destinationCards =
  document.querySelectorAll(".destination-card-link");


destinationFilters.forEach(function (filter) {

  filter.addEventListener("click", function () {

    const selectedCategory =
      filter.dataset.category;


    /* Remove active from every button */

    destinationFilters.forEach(function (button) {

      button.classList.remove("active");

    });


    /* Add active to clicked button */

    filter.classList.add("active");


    /* Filter destinations */

    destinationCards.forEach(function (card) {

      const article =
        card.querySelector(".article-card");

      const cardCategory =
        article.dataset.category;


      if (
        selectedCategory === "all" ||
        cardCategory === selectedCategory
      ) {

        card.style.display = "block";

      } else {

        card.style.display = "none";

      }

    });

  });

});