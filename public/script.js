// Riot CDN version for champion icons
const CDN_VERSION = "15.14.1";

// Champion data with roles and image links
const champions = [
  // Top
  "Aatrox", "Singed", "Ornn", "Kled", "Yone", "Gwen", "Gragas", "Zac", "Sion", "KSante", "Mordekaiser", "DrMundo"
].map(name => ({ name, role: "top", image: `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}/img/champion/${name}.png` }))
.concat([
  // Jungle
  "Warwick", "Rammus", "Lillia", "Evelynn", "Volibear", "Hecarim", "Nunu", "Skarner", "Amumu", "Udyr", "Kayn", "Viego"
].map(name => ({ name, role: "jungle", image: `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}/img/champion/${name}.png` })))
.concat([
  // Mid
  "Akali", "Katarina", "Qiyana", "Velkoz", "Zed", "Leblanc", "Yasuo", "Zoe", "Hwei", "Viktor", "Ahri", "Azir"
].map(name => ({ name, role: "mid", image: `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}/img/champion/${name}.png` })))
.concat([
  // ADC
  "Vayne", "Caitlyn", "KogMaw", "Jhin", "Yunara", "Kaisa", "MissFortune", "Tristana", "Ezreal", "Lucian", "Zeri", "Xayah"
].map(name => ({ name, role: "bot", image: `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}/img/champion/${name}.png` })))
.concat([
  // Support
  "Yuumi", "Janna", "Senna", "Bard", "Thresh", "Nautilus", "Rakan", "Leona", "Pyke", "Rell", "Milio", "Seraphine"
].map(name => ({ name, role: "support", image: `https://ddragon.leagueoflegends.com/cdn/${CDN_VERSION}/img/champion/${name}.png` })));

// Picked Champs
let pickedChampions = new Set();
const pool = document.getElementById("championPool");

function renderChampions(filter = "all", search = "") {
  pool.innerHTML = "";

  const filtered = champions.filter(champ =>
    (filter === "all" || champ.role === filter) &&
    champ.name.toLowerCase().includes(search.toLowerCase())
  );

  filtered
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name))
  .forEach(champ => {
    if (pickedChampions.has(champ.name)) return;

    //Create Champ cards
    const card = document.createElement("div");
    card.classList.add("champ-card");
    card.draggable = true;
    card.dataset.name = champ.name;

    card.innerHTML = `
      <img src="${champ.image}" alt="${champ.name}" width="64" height="64">
      <p>${champ.name}</p>
    `;

    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", champ.image);
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    pool.appendChild(card);
  });
}
//Remove Champ from pick slots
function enableSlotDrag() {
  document.querySelectorAll(".picked-champ").forEach(img => {
    img.addEventListener("dragstart", (e) => {
      const imgSrc = e.target.src;
      const champ = champions.find(c => c.image === imgSrc);
      if (champ) {
        pickedChampions.delete(champ.name);
        e.dataTransfer.setData("text/plain", champ.image);
        e.target.parentElement.innerHTML = "";
        renderChampions(currentRole, document.getElementById("champSearch").value);
        enableSlotDrag();
      }
    });
  });
}

renderChampions();

//Pick Slot logic
const pickSlots = document.querySelectorAll(".pick-slot");

pickSlots.forEach(slot => {
  slot.addEventListener("dragover", (e) => {
    e.preventDefault();
    slot.classList.add("highlight");
  });

  slot.addEventListener("dragleave", () => {
    slot.classList.remove("highlight");
  });

  slot.addEventListener("drop", (e) => {
    e.preventDefault();
    slot.classList.remove("highlight");
    const imageUrl = e.dataTransfer.getData("text/plain");

    const champ = champions.find(c => c.image === imageUrl);
    if (!champ) return;

    if (pickedChampions.has(champ.name)) {
      alert(`${champ.name} is already picked!`);
      return;
    }

    const existingImg = slot.querySelector("img");
    if (existingImg) {
      const oldChamp = champions.find(c => c.image === existingImg.src);
      if (oldChamp) pickedChampions.delete(oldChamp.name);
    }

    pickedChampions.add(champ.name);
    slot.innerHTML = `<img src="${champ.image}" width="64" height="64" draggable="true" class="picked-champ">`;
    renderChampions(currentRole, document.getElementById("champSearch").value);
    enableSlotDrag();
  });
});

// Search and role filters
let currentRole = "all";

document.getElementById("champSearch").addEventListener("input", (e) => {
  renderChampions(currentRole, e.target.value);
});

document.querySelectorAll(".role-filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    currentRole = btn.dataset.role;
    const search = document.getElementById("champSearch").value;
    renderChampions(currentRole, search);
  });
});
