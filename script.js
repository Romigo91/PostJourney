const state = {
  // Добавили данные профиля в состояние
  profile: {
      name: "@Alex",
      country: "🇫🇷",
      bio: "Detailed statistics and recent achievements will be shown here. You can also edit your status.", // ЗАПЯТАЯ ДОБАВЛЕНА
      avatar: null
  },
  
  postcards: 5,
  energy: 500,
  tracking: [
    { to: "Japan", status: "In transit" },
    { to: "Brazil", status: "Delivered" },
    { to: "Germany", status: "Preparing" }
  ],
  leaderboard: [
    { name: "@Alex_Travels", sent: 110, countries: 45 },
    { name: "@PostcardLover", sent: 80, countries: 30 },
    { name: "@WorldWalker", sent: 60, countries: 25 }
  ],
  sentPostcards: [
    { countryFlag: "🇯🇵", to: "Japan, Tokyo", status: "In transit" },
    { countryFlag: "🇧🇷", to: "Brazil, Rio", status: "Delivered" },
    { countryFlag: "🇩🇪", to: "Germany, Berlin", status: "In transit" }
  ],
  receivedPostcards: [
    { countryFlag: "🇫🇮", to: "Finland, Helsinki", status: "Received" },
    { countryFlag: "🇵🇹", to: "Portugal, Porto", status: "Registered" }
  ]
};

const COUNTRIES_BY_CONTINENT = {
  "Africa": ["🇩🇿","🇦🇴","🇧🇯","🇧🇼","🇧🇫","🇧🇮","🇨🇻","🇨🇲","🇨🇫","🇹🇩","🇰🇲","🇨🇩","🇨🇬","🇩🇯","🇪🇬","🇬🇶","🇪🇷","🇸🇿","🇪🇹","🇬🇦","🇬🇲","🇬🇭","🇬🇳","🇬🇼","🇨🇮","🇰🇪","🇱🇸","🇱🇷","🇱🇾","🇲🇬","🇲🇼","🇲🇱","🇲🇷","🇲🇺","🇲🇦","🇲🇿","🇳🇦","🇳🇪","🇳🇬","🇷🇼","🇸🇹","🇸🇳","🇸🇨","🇸🇱","🇸🇴","🇿🇦","🇸🇸","🇸🇩","🇹🇿","🇹🇬","🇹🇳","🇺🇬","🇿🇲","🇿🇼"],
  "Asia": ["🇦🇫","🇦🇲","🇦🇿","🇧🇭","🇧🇩","🇧🇹","🇧🇳","🇰🇭","🇨🇳","🇨🇾","🇬🇪","🇮🇳","🇮🇩","🇮🇷","🇮🇶","🇮🇱","🇯🇵","🇯🇴","🇰🇿","🇰🇼","🇰🇬","🇱🇦","🇱🇧","🇲🇾","🇲🇻","🇲🇳","🇲🇲","🇳🇵","🇰🇵","🇴🇲","🇵🇰","🇵🇸","🇵🇭","🇶🇦","🇸🇦","🇸🇬","🇰🇷","🇱🇰","🇸🇾","🇹🇼","🇹🇯","🇹🇭","🇹🇱","🇹🇷","🇹🇲","🇦🇪","🇺🇿","🇻🇳","🇾🇪"],
  "Europe": ["🇦🇱","🇦🇩","🇦🇹","🇧🇾","🇧🇪","🇧🇦","🇧🇬","🇭🇷","🇨🇿","🇩🇰","🇪🇪","🇫🇮","🇫🇷","🇩🇪","🇬🇷","🇭🇺","🇮🇸","🇮🇪","🇮🇹","🇽🇰","🇱🇻","🇱🇮","🇱🇹","🇱🇺","🇲🇹","🇲🇩","🇲🇨","🇲🇪","🇳🇱","🇲🇰","🇳🇴","🇵🇱","🇵🇹","🇷🇴","🇷🇺","🇸🇲","🇷🇸","🇸🇰","🇸🇮","🇪🇸","🇸🇪","🇨🇭","🇺🇦","🇬🇧","🇻🇦"],
  "North America": ["🇦🇬","🇧🇸","🇧🇧","🇧🇿","🇨🇦","🇨🇷","🇨🇺","🇩🇲","🇩🇴","🇸🇻","🇬🇩","🇬🇹","🇭🇹","🇭🇳","🇯🇲","🇲🇽","🇳🇮","🇵🇦","🇰🇳","🇱🇨","🇻🇨","🇹🇹","🇺🇸"],
  "South America": ["🇦🇷","🇧🇴","🇧🇷","🇨🇱","🇨🇴","🇪🇨","🇬🇾","🇵🇾","🇵🇪","🇸🇷","🇺🇾","🇻🇪"],
  "Oceania": ["🇦🇺","🇫🇯","🇰🇮","🇲🇭","🇫🇲","🇳🇷","🇳🇿","🇵🇼","🇵🇬","🇼🇸","🇸🇧","🇹🇴","🇹🇻","🇻🇺"]
};

// Обновление текста профиля на экране
function updateProfileUI() {
  document.getElementById("display-name").textContent = state.profile.name;
  document.getElementById("display-country").textContent = state.profile.country;
  document.getElementById("display-bio").textContent = state.profile.bio;
  
  // Меняем букву в кружочке на первую букву имени
  const avatarEl = document.getElementById("profile-avatar");
  
  // Если загружено фото — показываем его
  if (state.profile.avatar) {
      avatarEl.style.backgroundImage = `url(${state.profile.avatar})`;
      avatarEl.textContent = ""; // Убираем букву
  } else {
      // Иначе показываем букву
      avatarEl.style.backgroundImage = "none";
      const firstLetter = state.profile.name.replace('@', '')[0] || 'A';
      avatarEl.textContent = firstLetter.toUpperCase();
  }
}

// Логика кнопки Edit Profile
function setupProfileEditing() {
  const editBtn = document.getElementById("edit-profile-btn");
  const displayRow = document.getElementById("profile-display-name-row");
  const displayBio = document.getElementById("display-bio");
  const editRow = document.getElementById("profile-edit-name-row");
  const inputName = document.getElementById("input-name");
  const inputCountry = document.getElementById("input-country");
  const inputBio = document.getElementById("input-bio");
  const avatarHint = document.getElementById("avatar-edit-hint");
  const avatarUpload = document.getElementById("avatar-upload");
  const avatarContainer = document.querySelector(".avatar-container");

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    if (editBtn.textContent === "Edit Profile") {
      // Режим редактирования ВКЛ
      inputName.value = state.profile.name;
      inputCountry.value = state.profile.country;
      inputBio.value = state.profile.bio;

      displayRow.style.display = "none";
      displayBio.style.display = "none";
      editRow.style.display = "flex";
      inputBio.style.display = "block";
      avatarHint.style.display = "block";

      editBtn.textContent = "Save Changes";
    } else {
      // Режим редактирования ВЫКЛ (Сохранение)
      state.profile.name = inputName.value;
      state.profile.country = inputCountry.value;
      state.profile.bio = inputBio.value;

      updateProfileUI();

      displayRow.style.display = "flex";
      displayBio.style.display = "block";
      editRow.style.display = "none";
      inputBio.style.display = "none";
      avatarHint.style.display = "none";

      editBtn.textContent = "Edit Profile";
    }
  });

  // Загрузка фото
  avatarContainer.addEventListener("click", (e) => {
    e.stopPropagation();
    if (editBtn.textContent === "Save Changes") {
      avatarUpload.click();
    }
  });

  avatarUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        state.profile.avatar = event.target.result;
        updateProfileUI();
      };
      reader.readAsDataURL(file);
    }
  });
}

// --- Остальные твои функции отрисовки (без изменений) ---
function renderTracking() {
  const list = document.getElementById("tracking-list");
  if (!list) return;
  list.innerHTML = "";
  state.tracking.forEach(item => {
    const card = document.createElement("div");
    card.className = "tracking-card";
    card.innerHTML = `<div class="tracking-info"><div class="tracking-title">To ${item.to}</div><div class="tracking-subtitle">${item.status === "Delivered" ? "Delivered" : "In Transit"}</div></div><div class="tracking-status">${item.status}</div>`;
    list.appendChild(card);
  });
}

function syncAssets() {
  const postcardIds = ["asset-postcards", "create-postcards"];
  postcardIds.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = state.postcards; });
  const energyIds = ["asset-energy", "create-energy"];
  energyIds.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = state.energy; });
}

function renderMapSection(mode, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  Object.keys(COUNTRIES_BY_CONTINENT).forEach(continent => {
    const flags = COUNTRIES_BY_CONTINENT[continent];
    const row = document.createElement("div");
    row.className = "continent-row";
    row.innerHTML = `<div class="continent-header"><span class="continent-name">${continent}</span><span class="continent-progress">${flags.length} countries</span></div><div class="flag-grid">${flags.map(f => `<div class="flag-circle">${f}</div>`).join('')}</div>`;
    container.appendChild(row);
  });
}

function renderLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  if (!list) return;
  list.innerHTML = "";
  state.leaderboard.forEach(player => {
    const li = document.createElement("li");
    li.className = "leaderboard-item";
    li.innerHTML = `<span class="leaderboard-name">${player.name}</span><span class="leaderboard-stats">${player.sent} sent • ${player.countries} countries</span>`;
    list.appendChild(li);
  });
}

function setupNavigation() {
  const buttons = document.querySelectorAll(".nav-item");
  const screens = document.querySelectorAll(".screen");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      screens.forEach(scr => scr.classList.toggle("screen-active", scr.dataset.screen === target));
      buttons.forEach(b => b.classList.toggle("nav-active", b === btn));
    });
  });
}

function renderPostcardCollection(type, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  state[type].forEach(cardData => {
    const card = document.createElement("div");
    card.className = "postcard-card";
    card.innerHTML = `<div class="postcard-card-header"><span class="postcard-flag">${cardData.countryFlag}</span><span class="postcard-destination">${cardData.to}</span></div><div class="postcard-meta">${cardData.status}</div>`;
    container.appendChild(card);
  });
}

function setupConstructorToggle() {
  const modes = document.querySelectorAll(".constructor-mode");
  const panels = document.querySelectorAll(".constructor-panel");
  modes.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      modes.forEach(b => b.classList.toggle("constructor-mode-active", b === btn));
      panels.forEach(p => p.classList.toggle("constructor-panel-hidden", p.dataset.panel !== mode));
    });
  });
}

function setupExpandableBlocks() {
  const homeScreen = document.getElementById('home-screen');
  const triggers = document.querySelectorAll('.expand-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const block = trigger.closest('.clickable-block');
      const isExpanded = block.classList.contains('expanded');
      document.querySelectorAll('.clickable-block').forEach(b => {
        b.classList.remove('expanded');
        const t = b.querySelector('.expand-trigger');
        if (t) t.textContent = "⬇️";
      });
      if (!isExpanded) {
        block.classList.add('expanded');
        trigger.textContent = "⬆️";
        homeScreen.classList.add('has-expanded');
      } else {
        homeScreen.classList.remove('has-expanded');
      }
    });
  });
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  updateProfileUI(); // Рисуем начальный профиль
  setupProfileEditing(); // Включаем кнопку редактирования
  
  renderTracking();
  syncAssets();
  setupNavigation();
  renderMapSection("sent", "sent-by-continent");
  renderMapSection("received", "received-by-continent");
  renderLeaderboard();
  renderPostcardCollection("sentPostcards", "sent-postcards-grid");
  renderPostcardCollection("receivedPostcards", "received-postcards-grid");
  setupConstructorToggle();
  setupExpandableBlocks();
});