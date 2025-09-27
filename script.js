const shoeListContainer = document.getElementById("shoeListContainer");
const favoriteShoesContainer = document.getElementById("favoriteShoesContainer");
const searchInput = document.getElementById("search");

let allShoes = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function fetchShoes() {
  fetch("http://localhost:3000/shoes")
    .then(res => res.json())
    .then(data => {
      allShoes = data;
      updateDisplay();
    })
    .catch(error => console.error("Failed to fetch shoes:", error));
}

function renderShoes(data, container) {
  container.innerHTML = "";
  data.forEach((shoe) => {
    const card = document.createElement("div");
    card.className = "shoe-card";
    if (favorites.includes(shoe.id)) card.classList.add("favorite-glow");

    card.innerHTML = `
      <img src="${shoe.image}" alt="${shoe.brand} ${shoe.model}">
      <h3>${shoe.brand}</h3>
      <p>${shoe.model}</p>
      <div class="expanded-info">
        <p><strong>Color:</strong> ${shoe.color}</p>
        <p><strong>Price:</strong> ${shoe.price}</p>
      </div>
    `;

    // Expand/Collapse on click
    card.addEventListener("click", () => {
      card.classList.toggle("expanded");
    });

    // Favorite on double-click
    card.addEventListener("dblclick", (e) => {
      e.preventDefault();
      toggleFavorite(shoe.id);
    });

    container.appendChild(card);
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  updateDisplay();
}

function updateDisplay() {
  const filtered = allShoes.filter(shoe =>
    (shoe.brand + " " + shoe.model).toLowerCase().includes(searchInput.value.toLowerCase())
  );

  const favShoes = filtered.filter(shoe => favorites.includes(shoe.id));
  const normalShoes = filtered.filter(shoe => !favorites.includes(shoe.id));

  renderShoes(favShoes, favoriteShoesContainer);
  renderShoes(normalShoes, shoeListContainer);
}

searchInput.addEventListener("input", updateDisplay);

// Theme toggle logic
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Load theme and shoes on page load
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }
  fetchShoes();
});
