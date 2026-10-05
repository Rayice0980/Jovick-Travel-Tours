

const menuButton = document.getElementById("menuButton");
const navBar = document.getElementById("navBar");
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





menuButton.addEventListener("click", function () {
  navBar.classList.toggle("show-menu");

  searchBox.classList.remove("show-search");

  if (navBar.classList.contains("show-menu")) {
    menuButton.innerHTML = "✕";
  } else {
    menuButton.innerHTML = "☰";
  }
});


const navLinks = navBar.querySelectorAll("a");

navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    navBar.classList.remove("show-menu");
    menuButton.innerHTML = "☰";
  });
});


const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(function (link) {
  const linkPage = link.getAttribute("href");

  if (linkPage === currentPage || (currentPage === "" && linkPage === "index.html")) {
    link.classList.add("active");
  }
});


const searchButton = document.getElementById("searchButton");
const searchBox = document.getElementById("searchBox");

searchButton.addEventListener("click", function () {
  searchBox.classList.toggle("show-search");

  navBar.classList.remove("show-menu");
  menuButton.innerHTML = "☰";
});


const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const searchTerm = searchInput.value.trim();

    if (searchTerm === "") {
      return;
    }

    searchResults.innerHTML = "";
    searchMessage.textContent = "";

    let found = false;

    pages.forEach(function (page) {
      fetch(page)
        .then(function (response) {
          return response.text();
        })
        .then(function (html) {
          if (html.toLowerCase().includes(searchTerm.toLowerCase())) {
            found = true;

            const result = document.createElement("a");
            result.href = page;
            

            result.textContent = pageNames[page];

            searchResults.appendChild(result);
          }
        });
    });

    setTimeout(function () {
      if (!found) {
        searchMessage.textContent = "No results found.";
      }
    }, 1000);
  }
});


searchInput.addEventListener("input", function () {
  const foundPages = new Set();
  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    searchResults.innerHTML = "";
    searchMessage.textContent = "";
    return;
  }

  searchResults.innerHTML = "";
  searchMessage.textContent = "";

  pages.forEach(function (page) {
    fetch(page)
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        if (html.toLowerCase().includes(searchTerm.toLowerCase())) {
          if (!foundPages.has(page)) {
            foundPages.add(page);

            const result = document.createElement("a");

            result.href = page;
            result.textContent = pageNames[page];

            searchResults.appendChild(result);

            result.addEventListener("click", function () {
              searchBox.classList.remove("show-search");
            });
          }
        }
      });
  });
});

document.addEventListener("click", function (event) {
  if (
    !navBar.contains(event.target) &&
    !menuButton.contains(event.target) &&
    !searchBox.contains(event.target) &&
    !searchButton.contains(event.target)
  ) {
    navBar.classList.remove("show-menu");
    searchBox.classList.remove("show-search");
    menuButton.innerHTML = "☰";
  }
});

