const pages = [
  "index.html",
  "destinations.html",
  "tours.html",
  "about.html",
  "faq.html",
  "contact.html",
  "privacy-policy.html",
  "terms.html",
  "cancellation-refunds.html"
];

const pageNames = {
  "index.html": "Home",
  "destinations.html": "Destinations",
  "tours.html": "Tours",
  "about.html": "About Us",
  "faq.html": "FAQ",
  "contact.html": "Contact",
  "privacy-policy.html": "Privacy Policy",
  "terms.html": "Terms & Conditions",
  "cancellation-refunds.html": "Cancellation & Refunds"
};

async function loadComponent(elementId, file) {
  const container = document.getElementById(elementId);

  if (!container) {
    return;
  }

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error("Unable to load " + file);
    }

    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function initializeSiteInteractions() {
  const menuButton = document.getElementById("menuButton");
  const navBar = document.getElementById("navBar");
  const searchButton = document.getElementById("searchButton");
  const searchBox = document.getElementById("searchBox");
  const searchInput = document.getElementById("searchInput");
  const searchMessage = document.getElementById("searchMessage");
  const searchResults = document.getElementById("searchResults");

  if (
    !menuButton ||
    !navBar ||
    !searchButton ||
    !searchBox ||
    !searchInput ||
    !searchMessage ||
    !searchResults
  ) {
    console.error("Shared header controls could not be initialized.");
    return;
  }

  function closeMenu() {
    navBar.classList.remove("show-menu");

    const menuIcon = menuButton.querySelector("i");

    if (menuIcon) {
      menuIcon.classList.remove("fa-xmark");
      menuIcon.classList.add("fa-bars");
    }

    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.setAttribute("aria-expanded", "false");
  }

  function closeSearch() {
    searchBox.classList.remove("show-search");
    searchButton.setAttribute("aria-label", "Open search");
  }

  function openMenu() {
    closeSearch();
    navBar.classList.add("show-menu");

    const menuIcon = menuButton.querySelector("i");

    if (menuIcon) {
      menuIcon.classList.remove("fa-bars");
      menuIcon.classList.add("fa-xmark");
    }

    menuButton.setAttribute("aria-label", "Close navigation menu");
    menuButton.setAttribute("aria-expanded", "true");
  }

  menuButton.addEventListener("click", function () {
    if (navBar.classList.contains("show-menu")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  searchButton.addEventListener("click", function () {
    closeMenu();

    const isOpen = searchBox.classList.toggle("show-search");

    searchButton.setAttribute(
      "aria-label",
      isOpen ? "Close search" : "Open search"
    );

    if (isOpen) {
      searchInput.focus();
    }
  });

  const navLinks = navBar.querySelectorAll("a");

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(function (link) {
    const linkPage = link.getAttribute("href");

    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html")
    ) {
      link.classList.add("active");
    }
  });

  function renderSearchResults(searchTerm) {
    searchResults.innerHTML = "";
    searchMessage.textContent = "";

    if (searchTerm === "") {
      return;
    }

    const requests = pages.map(function (page) {
      return Promise.all([
        fetch(page),
        fetch("header.html"),
        fetch("footer.html")
      ])
        .then(async function (responses) {
          responses.forEach(function (response) {
            if (!response.ok) {
              throw new Error("Unable to load shared search content.");
            }
          });

          const html = await responses[0].text();
          const headerHtml = await responses[1].text();
          const footerHtml = await responses[2].text();

          return {
            page: page,
            matches: (
              html + headerHtml + footerHtml
            ).toLowerCase().includes(searchTerm.toLowerCase())
          };
        })
        .catch(function () {
          return {
            page: page,
            matches: false
          };
        });
    });

    Promise.all(requests).then(function (results) {
      const matchedPages = results.filter(function (result) {
        return result.matches;
      });

      if (matchedPages.length === 0) {
        searchMessage.textContent = "No results found.";
        return;
      }

      matchedPages.forEach(function (result) {
        const link = document.createElement("a");

        link.href = result.page;
        link.textContent = pageNames[result.page];

        searchResults.appendChild(link);
      });
    });
  }

  searchInput.addEventListener("input", function () {
    renderSearchResults(searchInput.value.trim());
  });

  searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeSearch();
      searchInput.blur();
    }
  });

  document.addEventListener("click", function (event) {
    const header = document.querySelector(".page-header");

    if (header && !header.contains(event.target)) {
      closeMenu();
      closeSearch();
    }
  });
}

async function initializeSite() {
  await Promise.all([
    loadComponent("site-header", "header.html"),
    loadComponent("site-footer", "footer.html")
  ]);

  initializeSiteInteractions();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSite);
} else {
  initializeSite();
}
