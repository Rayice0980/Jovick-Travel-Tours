const menuButton = document.getElementById("menuButton");
const navBar = document.getElementById("navBar");
const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const searchMessage = document.getElementById("searchMessage");
const searchResults = document.getElementById("searchResults");

const pages = [
  "index.html",
  "destinations.html",
  "tours.html",
  "contact.html"
];

const pageNames = {
  "index.html": "Home",
  "destinations.html": "Destinations",
  "tours.html": "Tours",
  "contact.html": "Contact"
};

function closeMenu() {
  navBar.classList.remove("show-menu");

  const menuIcon = menuButton.querySelector("i");

  if (menuIcon) {
    menuIcon.classList.remove("fa-xmark");
    menuIcon.classList.add("fa-bars");
  }

  menuButton.setAttribute("aria-label", "Open navigation menu");
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
    return fetch(page)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Unable to load " + page);
        }

        return response.text();
      })
      .then(function (html) {
        return {
          page: page,
          matches: html.toLowerCase().includes(searchTerm.toLowerCase())
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
