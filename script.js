let countryMap = {};

async function loadCountryMap() {
  const res = await fetch('https://aes.shenlu.me/api/v1/country');
  const data = await res.json();
  data.forEach(country => {
    countryMap[country.iso_code] = country.name;
  });
}

function getCountry(item) {
  if (item.country) return item.country;

  const code = item.country_code?.toUpperCase();
  if (code && countryMap[code]) return countryMap[code];

  return "Unknown";
}

function getImageUrl(image) {
  if (!image) return "https://via.placeholder.com/80";
  return image.startsWith("http") ? image : `https://aes.shenlu.me${image}`;
}

function createCard(item) {
  const status = item.conservation_status?.toUpperCase() || "NA";
  const imgUrl = getImageUrl(item.image);
  const country = getCountry(item);

  return `
    <div class="result-card">
      <div class="result-info">
        <p><strong>Taxonomy ID:</strong> ${item.id}</p>
        <p><strong>Common Name:</strong> ${item.common_name}</p>
        <p><strong>Scientific Name:</strong> <em>${item.scientific_name}</em></p>
        <p><strong>Country:</strong> ${country}</p>
      </div>
      <div class="result-image-wrapper">
        <img src="${imgUrl}" alt="${item.common_name}">
        <span class="status-badge status-${status}">${status}</span>
      </div>
    </div>
  `;
}

async function fetchSpecies(endpoint, query = "") {
  const container = document.getElementById("resultsGrid");
  document.getElementById("results").textContent = "Loading...";
  container.innerHTML = "";

  const url = `https://aes.shenlu.me/api/v1/${endpoint}${query ? "?q=" + encodeURIComponent(query) : ""}`;
  const res = await fetch(url);
  const data = await res.json();

  document.getElementById("results").textContent = "";

  if (!data || (Array.isArray(data) && data.length === 0)) {
    document.getElementById("results").textContent = "No results found.";
    return;
  }

  const cards = Array.isArray(data)
    ? data.map(createCard).join("")
    : `<h2 style="grid-column:1/-1;">Random Species</h2>${createCard(data)}`;

  container.innerHTML = cards;
}

document.getElementById("apiForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const endpoint = document.getElementById("endpoint").value;
  const query = document.getElementById("query").value.trim();
  fetchSpecies(endpoint, query);
});

document.addEventListener("DOMContentLoaded", async () => {
  await loadCountryMap();
  fetchSpecies("species");
});
