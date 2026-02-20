let tempSelectedInterests = []; // Здесь будут лежать теги до нажатия Save
let tempSelectedCountry = "";
const AVAILABLE_INTERESTS = [
  "Travel", "Postcards", "Nature", "Art", "Books", 
  "Music", "Cooking", "Photography", "Sport", "Tech", 
  "History", "Movies", "Architecture", "Animals", "Coffee", 
  "Gardening", "Languages", "Space", "Fashion", "Gaming", 
  "Hiking", "Writing", "Painting", "Drawing", "Vintage", 
  "Cultures", "Sea", "Mountains", "Handmade", "Dances"
];

const state = {
  profile: {
    name: "@Alex",
    country: "🇫🇷",
    bio: "Detailed statistics and recent achievements...",
    avatar: null,
    interests: ["Art", "Travel"] // начальные теги
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
  
  // Отрисовка тегов под аватаром
  const tagsContainer = document.getElementById("display-tags-minimal");
  if (tagsContainer) {
    tagsContainer.innerHTML = state.profile.interests
      .map(tag => `<span class="tag-mini">${tag}</span>`)
      .join("");
  }

  // Обновляем аватарку
  const avatarEl = document.getElementById("profile-avatar");
  if (state.profile.avatar) {
      avatarEl.style.backgroundImage = `url(${state.profile.avatar})`;
      avatarEl.textContent = "";
  } else {
      avatarEl.style.backgroundImage = "none";
      const firstLetter = state.profile.name.replace('@', '')[0] || 'A';
      avatarEl.textContent = firstLetter.toUpperCase();
  }
}

// --- ЛОГИКА РЕДАКТИРОВАНИЯ ПРОФИЛЯ ---
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
  
  const flagPicker = document.getElementById("flag-picker-container");
  const flagGrid = document.getElementById("flag-grid-picker");
  const displayCountry = document.getElementById("display-country");
  let tempAvatar = null;

// 1. ГЕНЕРАЦИЯ СЕТКИ ФЛАГОВ
if (flagGrid && flagGrid.children.length === 0) {
  let allFlagsFlat = [];
  for (let continent in COUNTRIES_BY_CONTINENT) {
      allFlagsFlat = allFlagsFlat.concat(COUNTRIES_BY_CONTINENT[continent]);
  }

  allFlagsFlat.sort((a, b) => a.localeCompare(b));

  allFlagsFlat.forEach(flag => {
      const span = document.createElement("span");
      span.textContent = flag;
      span.style.cssText = "cursor: pointer; font-size: 24px; text-align: center; padding: 5px; border-radius: 4px; user-select: none; -webkit-tap-highlight-color: transparent;";
      
      const onSelect = (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // ИСПРАВЛЕНО: Записываем только во временную переменную и инпут
          tempSelectedCountry = flag; 
          inputCountry.value = flag;
          flagPicker.style.display = "none";
      };

      span.addEventListener('click', onSelect);
      flagGrid.appendChild(span);
  });
}

  // 2. ОТКРЫТИЕ СПИСКА
  const handleFlagInteraction = (e) => {
    if (editBtn.textContent === "Save Changes") {
      e.preventDefault();
      e.stopPropagation(); 
      
      const isHidden = flagPicker.style.display === "none" || flagPicker.style.display === "";
      flagPicker.style.display = isHidden ? "block" : "none";
    }
  };

  inputCountry.addEventListener("touchstart", handleFlagInteraction, { passive: false });
  inputCountry.addEventListener("click", handleFlagInteraction);

  // 3. КНОПКА EDIT / SAVE
  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
  
    if (editBtn.textContent === "Edit Profile") {
      // ВХОД В РЕЖИМ РЕДАКТИРОВАНИЯ
      inputName.value = state.profile.name;
      inputCountry.value = state.profile.country;
      inputBio.value = state.profile.bio;
      
      // ИСПРАВЛЕНО: Инициализируем временную страну при входе
      tempSelectedCountry = state.profile.country;
      tempSelectedInterests = [...state.profile.interests]; 
      tempAvatar = state.profile.avatar;
      renderEditTags();
  
      displayRow.style.display = "none";
      displayBio.style.display = "none";
      document.getElementById("display-tags-minimal").style.display = "none";
      
      editRow.style.display = "flex";
      inputBio.style.display = "block";
      avatarHint.style.display = "block";
      document.getElementById("edit-tags-wrapper").style.display = "block";
  
      editBtn.textContent = "Save Changes";
    } else {
      // СОХРАНЕНИЕ
      state.profile.name = inputName.value;
      // ИСПРАВЛЕНО: Присваиваем основному состоянию значение из временной переменной
      state.profile.country = tempSelectedCountry; 
      state.profile.bio = inputBio.value;
      state.profile.interests = [...tempSelectedInterests]; 
      state.profile.avatar = tempAvatar;
  
      updateProfileUI();
  
      displayRow.style.display = "flex";
      displayBio.style.display = "block";
      document.getElementById("display-tags-minimal").style.display = "flex"; 
      
      editRow.style.display = "none";
      inputBio.style.display = "none";
      avatarHint.style.display = "none";
      flagPicker.style.display = "none";
      document.getElementById("edit-tags-wrapper").style.display = "none";
  
      editBtn.textContent = "Edit Profile";
    }
  });
 
  // Остальное без изменений
  avatarContainer.onclick = (e) => {
    e.stopPropagation();
    if (editBtn.textContent === "Save Changes") avatarUpload.click();
  };
  avatarUpload.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { 
        tempAvatar = ev.target.result; // Сохраняем только в "черновик"
        
        // Визуально меняем кружок, чтобы юзер видел, что он выбрал, 
        // но в state.profile.avatar это еще не попало!
        const avatarEl = document.getElementById("profile-avatar");
        avatarEl.style.backgroundImage = `url(${tempAvatar})`;
        avatarEl.textContent = "";
      };
      reader.readAsDataURL(file);
    }
  };
}

// Все остальные функции оставляю без изменений, как ты и просил...
function setupExpandableBlocks() {
  const triggers = document.querySelectorAll('.expand-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const block = trigger.closest('.clickable-block');
      const isExpanded = block.classList.contains('expanded');
      document.querySelectorAll('.clickable-block').forEach(b => {
        if (b !== block) {
          b.classList.remove('expanded');
          const t = b.querySelector('.expand-trigger');
          if (t) t.textContent = "⬇️";
          if (b.id === 'profile-block') { resetProfileEditMode(); }
        }
      });
      if (!isExpanded) {
        block.classList.add('expanded');
        trigger.textContent = "⬆️";
      } else {
        block.classList.remove('expanded');
        trigger.textContent = "⬇️";
        if (block.id === 'profile-block') { resetProfileEditMode(); }
      }
    });
  });
}

function resetProfileEditMode() {
  const editBtn = document.getElementById("edit-profile-btn");
  if (editBtn && editBtn.textContent === "Save Changes") {
    editBtn.textContent = "Edit Profile";
    document.getElementById("profile-display-name-row").style.display = "flex";
    document.getElementById("display-bio").style.display = "block";
    document.getElementById("display-tags-minimal").style.display = "flex";
    document.getElementById("profile-edit-name-row").style.display = "none";
    document.getElementById("input-bio").style.display = "none";
    document.getElementById("avatar-edit-hint").style.display = "none";
    document.getElementById("flag-picker-container").style.display = "none";
    document.getElementById("edit-tags-wrapper").style.display = "none";
    tempSelectedInterests = []; 
    tempSelectedCountry = ""; // Очищаем временную страну
    updateProfileUI();
  }
}

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

function renderEditTags() {
  const container = document.getElementById("edit-tags-list");
  if (!container) return;
  container.innerHTML = AVAILABLE_INTERESTS.map(tag => {
    const isSelected = tempSelectedInterests.includes(tag);
    return `<span class="tag-selectable ${isSelected ? 'selected' : ''}">${tag}</span>`;
  }).join("");
  container.querySelectorAll('.tag-selectable').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      const tag = el.textContent;
      if (tempSelectedInterests.includes(tag)) {
        tempSelectedInterests = tempSelectedInterests.filter(t => t !== tag);
      } else if (tempSelectedInterests.length < 4) { // Изменил на 4, как договаривались ранее
        tempSelectedInterests.push(tag);
      }
      renderEditTags();
    };
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof updateProfileUI === 'function') updateProfileUI(); 
  setupProfileEditing(); 
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