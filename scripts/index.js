/* =================================
   JOVICK TRAVEL & TOURS
   HOME PAGE JAVASCRIPT
   ================================= */


/* =================================
   SCROLL REVEAL
   ================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

  const revealObserver = new IntersectionObserver(
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
  document.querySelector(".hero-primary-button");


if (heroPrimaryButton) {

  heroPrimaryButton.addEventListener("click", function () {

    heroPrimaryButton.classList.add("button-clicked");

  });

}


/* =================================
   IMAGE ERROR HANDLING
   ================================= */

const homeImages =
  document.querySelectorAll("img");


homeImages.forEach(function (image) {

  image.addEventListener("error", function () {

    image.classList.add("image-error");

  });

});