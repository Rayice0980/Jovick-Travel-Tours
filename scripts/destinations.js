const destinationFilters = document.querySelectorAll(".destination-filter");
const destinationCards = document.querySelectorAll(".article-card");

destinationFilters.forEach(function (filter) {
  filter.addEventListener("click", function () {
    const selectedCategory = filter.dataset.category;

    destinationFilters.forEach(function (button) {
      button.classList.remove("active");
    });

    filter.classList.add("active");

    destinationCards.forEach(function (card) {
      const cardCategory = card.dataset.category;

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