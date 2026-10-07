/* =================================
   JOVICK TRAVEL & TOURS
   HOME PAGE JAVASCRIPT
   ================================= */


/* =================================
   HOME PAGE LOAD
   ================================= */

document.body.classList.add("home-loaded");


/* =================================
   SCROLL REVEAL
   ================================= */

const revealElements =
  document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

  const revealObserver =
    new IntersectionObserver(
      function (entries, observer) {

        entries.forEach(function (entry) {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(function (element) {

    revealObserver.observe(element);

  });

} else {

  revealElements.forEach(function (element) {

    element.classList.add("visible");

  });

}


/* =================================
   HERO BUTTON FEEDBACK
   ================================= */

const heroPrimaryButton =
  document.querySelector(
    ".hero-primary-button"
  );


if (heroPrimaryButton) {

  heroPrimaryButton.addEventListener(
    "click",
    function () {

      heroPrimaryButton.classList.add(
        "button-clicked"
      );

    }
  );

}


/* =================================
   IMAGE ERROR HANDLING
   ================================= */

const homeImages =
  document.querySelectorAll(
    ".home-hero img, " +
    ".home-welcome img, " +
    ".home-destination-card img"
  );


homeImages.forEach(function (image) {

  image.addEventListener(
    "error",
    function () {

      image.classList.add(
        "image-error"
      );

    }
  );

});