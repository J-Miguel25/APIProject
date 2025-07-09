let countryMap = {};

async function loadCountryMap() {
  const res = await fetch('https://aes.shenlu.me/api/v1/country');
  const data = await res.json();
  data.forEach(country => {
    countryMap[country.iso_code] = country.name;
  });
  console.log('Country map loaded:', countryMap);
}

function getCountry(item) {
  console.log('Species item:', item);
  if (item.country) return item.country;

  const code = item.country_code?.toUpperCase();
  console.log('Country code from item:', code);
  console.log('Available country codes:', Object.keys(countryMap));
  const mapped = code && countryMap[code] ? countryMap[code] : "Unknown";
  console.log('Country lookup:', code, '=>', mapped);
  return mapped;
}

function createCard(item, showImage = false) {
  const status = item.conservation_status?.toUpperCase() || "NA";
  let imageHtml = '';
  if (showImage) {
    const imgUrl = item.image ? (item.image.startsWith("http") ? item.image : `https://aes.shenlu.me${item.image}`) : "https://via.placeholder.com/80";
    imageHtml = `<img src="${imgUrl}" alt="${item.common_name}">`;
  }
  // Add data-id for click handling
  return `
    <div class="result-card" data-id="${item.id}">
      <div class="result-info">
        <p><strong>Taxonomy ID:</strong> ${item.id}</p>
        <p><strong>Common Name:</strong> ${item.common_name}</p>
        <p><strong>Scientific Name:</strong> <em>${item.scientific_name}</em></p>
      </div>
      <div class="result-image-wrapper">
        ${imageHtml}
        <span class="status-badge status-${status}">${status}</span>
      </div>
    </div>
  `;
}

// Modal logic
function showModal(item) {
  let imgHtml = '';
  if (item.image) {
    const imgUrl = item.image.startsWith("http") ? item.image : `https://aes.shenlu.me${item.image}`;
    imgHtml = `<img src="${imgUrl}" alt="${item.common_name}" style="max-width:90vw;max-height:60vh;display:block;margin:0 auto 24px;">`;
  }
  const status = item.conservation_status?.toUpperCase() || 'NA';
  document.getElementById('modalContent').innerHTML = `
    <button id="closeModalBtn" style="position:absolute;top:16px;right:24px;font-size:36px;background:none;border:none;cursor:pointer;line-height:1;color:#333;z-index:10;">&times;</button>
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:18px;">
      <h2 style="font-size:2.2rem;margin:0;line-height:1.1;">${item.common_name}</h2>
      <span class="status-badge status-${status}" style="font-size:1.3rem;height:2.2rem;display:inline-flex;align-items:center;justify-content:center;padding:0 14px;position:relative;top:-2px;">${status}</span>
    </div>
    ${imgHtml}
    <p style="font-size:1.2rem;"><strong>Taxonomy ID:</strong> ${item.id}</p>
    <p style="font-size:1.2rem;"><strong>Scientific Name:</strong> <em>${item.scientific_name}</em></p>
  `;
  document.getElementById('modalOverlay').style.display = 'flex';
  document.getElementById('closeModalBtn').onclick = hideModal;
}

function hideModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

// Attach click listeners after rendering cards
function attachCardListeners(data, isArray) {
  setTimeout(() => {
    document.querySelectorAll('.result-card').forEach(card => {
      card.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        let item;
        if (isArray) {
          item = data.find(d => String(d.id) === id);
        } else {
          item = data;
        }
        if (item) showModal(item);
      });
    });
  }, 0);
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

  let cards;
  if (Array.isArray(data)) {
    cards = data.map(item => createCard(item, false)).join("");
    container.innerHTML = cards;
    attachCardListeners(data, true);
  } else {
    cards = `<h2 style="grid-column:1/-1;">Random Species</h2>${createCard(data, true)}`;
    container.innerHTML = cards;
    attachCardListeners(data, false);
  }
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

// Add modal HTML to the page if not present
if (!document.getElementById('modalOverlay')) {
  const modalHtml = `
    <div id="modalOverlay" style="display:none;position:fixed;z-index:1000;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);align-items:center;justify-content:center;">
      <div id="modalContent" style="background:#fff;padding:48px 36px 36px 36px;border-radius:18px;max-width:700px;width:95vw;max-height:90vh;overflow:auto;position:relative;box-shadow:0 8px 32px rgba(0,0,0,0.25);">
        <!-- Modal content will be injected here -->
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}



