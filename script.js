// --- ИНИЦИАЛИЗАЦИЯ СОСТОЯНИЯ ---
let tempSelectedInterests = []; 
let tempSelectedCountry = "";
let tempAvatar = null;

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
    // Оставляем дефолтную фразу на английском, JS сам заменит её на перевод
    bio: "Detailed statistics and recent achievements...",
    avatar: null,
    interests: ["Art", "Travel"]
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

// --- ОСНОВНЫЕ ФУНКЦИИ ИНТЕРФЕЙСА ---

function updateProfileUI() {
  document.getElementById("display-name").textContent = state.profile.name;
  document.getElementById("display-country").textContent = state.profile.country;

  // ЛОГИКА ПЕРЕВОДА БИО
  const bioElement = document.getElementById("display-bio");
  const inputBio = document.getElementById("input-bio");
  
  // Если био пустое или содержит стандартную английскую фразу
  if (!state.profile.bio || state.profile.bio.includes("Detailed statistics")) {
    const translation = getTranslation("bio_placeholder");
    bioElement.textContent = translation;
    if (inputBio) inputBio.placeholder = translation; 
  } else {
    bioElement.textContent = state.profile.bio;
  }
  
  const tagsContainer = document.getElementById("display-tags-minimal");
  if (tagsContainer) {
    tagsContainer.innerHTML = state.profile.interests
      .map(tag => {
        // Превращаем "Travel" в "interest_travel"
        const key = `interest_${tag.toLowerCase()}`;
        return `<span class="tag-mini">${getTranslation(key)}</span>`;
      })
      .join("");
  }

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
  
  // Инициализация сетки флагов
  if (flagGrid && flagGrid.children.length === 0) {
    let allFlagsFlat = [];
    for (let continent in COUNTRIES_BY_CONTINENT) {
      allFlagsFlat = allFlagsFlat.concat(COUNTRIES_BY_CONTINENT[continent]);
    }
    allFlagsFlat.sort((a, b) => a.localeCompare(b));
    allFlagsFlat.forEach(flag => {
      const span = document.createElement("span");
      span.textContent = flag;
      span.className = "flag-item";
      span.style.cssText = "cursor: pointer; font-size: 24px; padding: 5px; border-radius: 4px;";
      span.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        tempSelectedCountry = flag; 
        inputCountry.value = flag;
        flagPicker.style.display = "none";
      };
      flagGrid.appendChild(span);
    });
  }

  inputCountry.onclick = (e) => {
    if (editBtn.getAttribute('data-mode') === 'save') {
      e.stopPropagation();
      flagPicker.style.display = flagPicker.style.display === "block" ? "none" : "block";
    }
  };

  if (avatarContainer) {
    avatarContainer.onclick = (e) => {
      e.stopPropagation();
      if (editBtn.getAttribute('data-mode') === 'save') avatarUpload.click();
    };
  }

  if (avatarUpload) {
    avatarUpload.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => { 
          tempAvatar = ev.target.result;
          const avatarEl = document.getElementById("profile-avatar");
          avatarEl.style.backgroundImage = `url(${tempAvatar})`;
          avatarEl.textContent = "";
        };
        reader.readAsDataURL(file);
      }
    };
  }

  editBtn.onclick = (e) => {
    e.stopPropagation();
    const isEditing = editBtn.getAttribute('data-mode') === 'save';

    if (!isEditing) {
      // ПЕРЕХОД В РЕЖИМ РЕДАКТИРОВАНИЯ
      editBtn.setAttribute('data-mode', 'save');
      editBtn.setAttribute('data-i18n', 'save_profile');
      
      inputName.value = state.profile.name;
      inputCountry.value = state.profile.country;
      
      // Если био стандартное, очищаем поле для плейсхолдера
      if (state.profile.bio.includes("Detailed statistics")) {
        inputBio.value = ""; 
      } else {
        inputBio.value = state.profile.bio;
      }
      
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
    } else {
      // СОХРАНЕНИЕ
      editBtn.setAttribute('data-mode', 'edit');
      editBtn.setAttribute('data-i18n', 'edit_profile');
      
      state.profile.name = inputName.value;
      state.profile.country = tempSelectedCountry; 
      
      // Если пользователь ничего не ввел, возвращаем дефолтную фразу
      const newBio = inputBio.value.trim();
      state.profile.bio = newBio === "" ? "Detailed statistics and recent achievements..." : newBio;
      
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
    }
    // Принудительно обновляем переводы кнопок
    applyLanguage(localStorage.getItem('selectedLang') || 'en');
  };
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (БЕЗ ИЗМЕНЕНИЙ) ---

function getTranslation(key) {
  const lang = localStorage.getItem('selectedLang') || 'en';
  return (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;
}

function applyLanguage(lang) {
  if (!translations || !translations[lang]) return;

  // 1. Сразу сохраняем выбранный язык
  localStorage.setItem('selectedLang', lang);

  // 2. Переводим статические элементы с data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = translations[lang][key];
    
    if (translation) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translation;
      } else {
        el.textContent = translation;
      }
    }
  });

  // ВАЖНО: Обновляем динамические части профиля
  updateProfileUI();
  
  if (typeof renderTracking === 'function') renderTracking();
  renderMapSection("sent", "sent-by-continent");
  renderMapSection("received", "received-by-continent");
  renderPostcardCollection("sentPostcards", "sent-postcards-grid");
  renderPostcardCollection("receivedPostcards", "received-postcards-grid");

  localStorage.setItem('selectedLang', lang);
}

function setupExpandableBlocks() {
  const triggers = document.querySelectorAll('.expand-trigger');
  triggers.forEach(trigger => {
    trigger.onclick = (e) => {
      e.stopPropagation();
      const block = trigger.closest('.clickable-block');
      const isExpanded = block.classList.contains('expanded');
      
      document.querySelectorAll('.clickable-block').forEach(b => {
        if (b !== block) {
          b.classList.remove('expanded');
          const t = b.querySelector('.expand-trigger');
          if (t) t.textContent = "⬇️";
          if (b.id === 'profile-block') resetProfileEditMode();
        }
      });

      if (!isExpanded) {
        block.classList.add('expanded');
        trigger.textContent = "⬆️";
      } else {
        block.classList.remove('expanded');
        trigger.textContent = "⬇️";
        if (block.id === 'profile-block') resetProfileEditMode();
      }
    };
  });
}

function resetProfileEditMode() {
  const editBtn = document.getElementById("edit-profile-btn");
  if (editBtn && editBtn.getAttribute('data-mode') === 'save') {
    editBtn.setAttribute('data-mode', 'edit');
    editBtn.setAttribute('data-i18n', 'edit_profile');
    
    document.getElementById("profile-display-name-row").style.display = "flex";
    document.getElementById("display-bio").style.display = "block";
    document.getElementById("display-tags-minimal").style.display = "flex";
    document.getElementById("profile-edit-name-row").style.display = "none";
    document.getElementById("input-bio").style.display = "none";
    document.getElementById("avatar-edit-hint").style.display = "none";
    document.getElementById("flag-picker-container").style.display = "none";
    document.getElementById("edit-tags-wrapper").style.display = "none";
    
    updateProfileUI();
    applyLanguage(localStorage.getItem('selectedLang') || 'en');
  }
}

function renderTracking() {
  const list = document.getElementById("tracking-list");
  if (!list) return;
  list.innerHTML = "";
  state.tracking.forEach(item => {
    // Генерируем ключ
    const statusKey = `status_${item.status.toLowerCase().replace(' ', '_')}`;
    const translatedStatus = getTranslation(statusKey);

    const card = document.createElement("div");
    card.className = "tracking-card";
    card.innerHTML = `
      <div class="tracking-info">
        <div class="tracking-title">To ${item.to}</div>
        <div class="tracking-subtitle">${translatedStatus}</div>
      </div>
      <div class="tracking-status">${translatedStatus}</div>`; // Здесь тоже перевод
    list.appendChild(card);
  });
}

function syncAssets() {
  ["asset-postcards", "create-postcards"].forEach(id => { 
    const el = document.getElementById(id); if (el) el.textContent = state.postcards; 
  });
  ["asset-energy", "create-energy"].forEach(id => { 
    const el = document.getElementById(id); if (el) el.textContent = state.energy; 
  });
}

function renderMapSection(mode, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  
  Object.keys(COUNTRIES_BY_CONTINENT).forEach(continent => {
    const continentKey = `continent_${continent.toLowerCase().replace(' ', '_')}`;
    const flags = COUNTRIES_BY_CONTINENT[continent];
    const row = document.createElement("div");
    row.className = "continent-row";
    row.innerHTML = `
      <div class="continent-header">
        <span class="continent-name">${getTranslation(continentKey)}</span>
        <span class="continent-progress">${flags.length} ${getTranslation('countries_count')}</span>
      </div>
      <div class="flag-grid">${flags.map(f => `<div class="flag-circle">${f}</div>`).join('')}</div>`;
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
    btn.onclick = () => {
      const target = btn.dataset.target;
      screens.forEach(scr => scr.classList.toggle("screen-active", scr.dataset.screen === target));
      buttons.forEach(b => b.classList.toggle("nav-active", b === btn));
    };
  });
}

function renderPostcardCollection(type, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";
  state[type].forEach(cardData => {
    const statusKey = `status_${cardData.status.toLowerCase().replace(' ', '_')}`;
    const card = document.createElement("div");
    card.className = "postcard-card";
    card.innerHTML = `
      <div class="postcard-card-header">
        <span class="postcard-flag">${cardData.countryFlag}</span>
        <span class="postcard-destination">${cardData.to}</span>
      </div>
      <div class="postcard-meta">${getTranslation(statusKey)}</div>`;
    container.appendChild(card);
  });
}

function setupConstructorToggle() {
  const modes = document.querySelectorAll(".constructor-mode");
  const panels = document.querySelectorAll(".constructor-panel");
  modes.forEach(btn => {
    btn.onclick = () => {
      const mode = btn.dataset.mode;
      modes.forEach(b => b.classList.toggle("constructor-mode-active", b === btn));
      panels.forEach(p => p.classList.toggle("constructor-panel-hidden", p.dataset.panel !== mode));
    };
  });
}

function renderEditTags() {
  const container = document.getElementById("edit-tags-list");
  if (!container) return;
  
  container.innerHTML = AVAILABLE_INTERESTS.map(tag => {
    const isSelected = tempSelectedInterests.includes(tag);
    // Генерируем ключ для перевода
    const key = `interest_${tag.toLowerCase()}`;
    const translatedTag = getTranslation(key);
    
    // В data-tag сохраняем ОРИГИНАЛ (Travel), а показываем ПЕРЕВОД (Путешествия)
    return `<span class="tag-selectable ${isSelected ? 'selected' : ''}" data-tag="${tag}">${translatedTag}</span>`;
  }).join("");

  container.querySelectorAll('.tag-selectable').forEach(el => {
    el.onclick = (e) => {
      e.stopPropagation();
      // Берем оригинал из атрибута
      const tag = el.getAttribute('data-tag'); 
      if (tempSelectedInterests.includes(tag)) {
        tempSelectedInterests = tempSelectedInterests.filter(t => t !== tag);
      } else if (tempSelectedInterests.length < 4) {
        tempSelectedInterests.push(tag);
      }
      renderEditTags();
    };
  });
}

function setupSettingsLogic() {
  const langChips = document.querySelectorAll('.chip-select');
  langChips.forEach(chip => {
    chip.onclick = () => {
      const lang = chip.getAttribute('data-lang');
      if (lang) {
        applyLanguage(lang);
        langChips.forEach(c => c.classList.remove('chip-active'));
        chip.classList.add('chip-active');
      }
    };
  });
}

// --- ИНИЦИАЛИЗАЦИЯ ---
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem('selectedLang') || 'en';
  
  setupNavigation();
  setupSettingsLogic();
  setupProfileEditing();
  setupConstructorToggle();
  setupExpandableBlocks();

  updateProfileUI(); 
  renderTracking();
  syncAssets();
  renderMapSection("sent", "sent-by-continent");
  renderMapSection("received", "received-by-continent");
  renderLeaderboard();
  renderPostcardCollection("sentPostcards", "sent-postcards-grid");
  renderPostcardCollection("receivedPostcards", "received-postcards-grid");

  applyLanguage(savedLang);

  document.querySelectorAll('.chip-select').forEach(chip => {
    chip.classList.toggle('chip-active', chip.getAttribute('data-lang') === savedLang);
  });
});