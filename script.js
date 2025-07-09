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

async function fetchSpecies(endpoint) {
  const container = document.getElementById("resultsGrid");
  document.getElementById("results").textContent = "Loading...";
  container.innerHTML = "";

  const url = `https://aes.shenlu.me/api/v1/${endpoint}`;
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

async function fetchSpeciesCount() {
  try {
      const response = await fetch('https://aes.shenlu.me/api/v1/speciescount');
      const data = await response.json();
      document.getElementById('speciesCount').textContent = data.count !== undefined ? data.count : 'N/A';
  } catch (err) {
      document.getElementById('speciesCount').textContent = 'Error fetching count';
  }
}

async function fetchCountryCount() {
    try {
        const response = await fetch('https://aes.shenlu.me/api/v1/countrycount');
        const data = await response.json();
        document.getElementById('countryCount').textContent = data.count !== undefined ? data.count : 'N/A';
    } catch (err) {
        document.getElementById('countryCount').textContent = 'Error fetching count';
    }
  }

document.getElementById("apiForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const endpoint = document.getElementById("endpoint").value;
  fetchSpecies(endpoint);
});

document.addEventListener("DOMContentLoaded", async () => {
  // Fetch all api data 
  await loadCountryMap();
  fetchSpecies("species");
  fetchSpeciesCount();
  fetchCountryCount();
});



