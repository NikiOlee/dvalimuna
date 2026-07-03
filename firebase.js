import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDrgUVX_usgZ8Z-BO6UC_FlWcpmtO5M6KI",
  authDomain: "limunada-fc35a.firebaseapp.com",
  projectId: "limunada-fc35a",
  storageBucket: "limunada-fc35a.firebasestorage.app",
  messagingSenderId: "1019927446811",
  appId: "1:1019927446811:web:0110147b4861755d13bfbe",
  measurementId: "G-P25MQEZS87",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === ЗАГРУЗКА МЕНЮ НАПИТКОВ ===
async function loadMenu() {
  const menuContainer = document.getElementById("menu-container");
  if (!menuContainer) return;

  const q = query(collection(db, "drinks"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);

  menuContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const item = doc.data();
    let promoClass = item.isAkcija ? " promo" : "";
    let akcijaBadge = item.isAkcija
      ? `<div class="action-badge">Akcija</div>`
      : "";

    let priceHTML = `<h3 class="price">${item.price} din</h3>`;
    if (item.oldPrice && item.isAkcija) {
      priceHTML = `
        <h3 class="old-price">${item.oldPrice} din</h3>
        <h3 class="new-price">${item.price} din</h3>
      `;
    }

    const cardHTML = `
      <div class="item${promoClass}">
        ${akcijaBadge}
        <h2>${item.name}</h2>
        <img src="${item.image}" />
        ${priceHTML}
        <p class="whatIn">${item.description}</p>
      </div>
    `;
    menuContainer.insertAdjacentHTML("beforeend", cardHTML);
  });
}

function watchPCBuildProgress() {
  const wishesContainer = document.getElementById("wishes-container");
  if (!wishesContainer) return;

  onSnapshot(doc(db, "goals", "pc_build"), (docSnap) => {
    if (!docSnap.exists()) return;

    const data = docSnap.data();
    let currentSaved = data.saved;

    wishesContainer.innerHTML = "";

    data.parts.forEach((part) => {
      let partProgress = 0;
      let moneyForThisPart = 0;

      if (currentSaved >= part.price) {
        partProgress = 100;
        moneyForThisPart = part.price;
        currentSaved -= part.price;
      } else if (currentSaved > 0) {
        partProgress = Math.floor((currentSaved / part.price) * 100);
        moneyForThisPart = currentSaved;
        currentSaved = 0;
      }

      const cardHTML = `
        <div class="wish-card">
          <div class="wish-title">${part.name}</div>
          <div class="progress">
  <div class="fill" style="width: ${partProgress}%">
    ${partProgress}% (${moneyForThisPart} / ${part.price} din)
  </div>
</div>
          </div>
        </div>
      `;
      wishesContainer.insertAdjacentHTML("beforeend", cardHTML);
    });
  });
}

loadMenu();
watchPCBuildProgress();
