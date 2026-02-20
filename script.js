// ==========================================================================
// 1. КОНСТАНТЫ И СОСТОЯНИЕ
// ==========================================================================
const AVAILABLE_INTERESTS = [
  "Travel", "Postcards", "Nature", "Art", "Books", "Music", "Cooking", 
  "Photography", "Sport", "Tech", "History", "Movies", "Architecture", 
  "Animals", "Coffee", "Gardening", "Languages", "Space", "Fashion", 
  "Gaming", "Hiking", "Writing", "Painting", "Drawing", "Vintage", 
  "Cultures", "Sea", "Mountains", "Handmade", "Dances"
];

const state = {
  profile: {
      name: "@Alex",
      country: "🇫🇷",
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
  "Asia": ["🇦🇫","🇦🇲","🇦🇿","🇧🇭","🇧🇩","🇧🇹","🇧🇳","🇰🇭","🇨🇳","🇨🇾","🇬🇪","🇮🇳","🇮🇩","🇮🇷","🇮 عراق","🇮🇱","🇯🇵","🇯🇴","🇰🇿","🇰🇼","🇰🇬","🇱🇦","🇱🇧","🇲🇾","🇲🇻","🇲🇳","🇲🇲","🇳🇵","🇰🇵","🇴🇲","🇵🇰","🇵🇸","🇵🇭","🇶🇦","🇸🇦","🇸🇬","🇰🇷","🇱🇰","🇸🇾","🇹🇼","🇹🇯","🇹🇭","🇹🇱","🇹🇷","🇹🇲","🇦🇪","🇺🇿","🇻🇳","🇾🇪"],
  "Europe": ["🇦🇱","🇦🇩","🇦🇹","🇧🇾","🇧🇪","🇧🇦","🇧🇬","🇭🇷","🇨🇿","🇩🇰","🇪🇪","🇫🇮","🇫🇷","🇩🇪","🇬🇷","🇭🇺","🇮🇸","🇮🇪","🇮🇹","🇽🇰","🇱🇻","🇱🇮","🇱🇹","🇱🇺","🇲🇹","🇲🇩","🇲🇨","🇲🇪","🇳🇱","🇲🇰","🇳🇴","🇵🇱","🇵🇹","🇷🇴","🇷🇺","🇸🇲","🇷🇸","🇸🇰","🇸🇮","🇪🇸","🇸🇪","🇨🇭","🇺🇦","🇬🇧","🇻🇦"],
  "North America": ["🇦🇬","🇧🇸","🇧🇧","🇧🇿","🇨🇦","🇨🇷","🇨🇺","🇩🇲","🇩🇴","🇸🇻","🇬🇩","🇬🇹","🇭🇹","🇭🇳","🇯🇲","🇲🇽","🇳🇮","🇵🇦","🇰🇳","🇱🇨","🇻🇨","🇹🇹","🇺🇸"],
  "South America": ["🇦🇷","🇧🇴","🇧🇷","🇨🇱","🇨🇴","🇪🇨","🇬🇾","🇵🇾","🇵🇪","🇸🇷","🇺🇾","🇻🇪"],
  "Oceania": ["🇦🇺","🇫🇯","🇰🇮","🇲🇭","🇫🇲","🇳🇷","🇳🇿","🇵🇼","🇵🇬","🇼🇸","🇸🇧","🇹🇴","🇹🇻","🇻🇺"]
};

let tempSelectedInterests = [];
let tempSelectedCountry = "";
let tempAvatar = null;

// ==========================================================================
// 2. ВСПОМОГАТЕЛЬНЫЕ УТИЛИТЫ
// ==========================================================================
const getTranslation = (key) => {
  const lang = localStorage.getItem('selectedLang') || 'en';
  return (translations[lang] && translations[lang][key]) ? translations[lang][key] : key;
};

const formatStatusKey = (status) => `status_${status.toLowerCase().replace(/\s/g, '_')}`;

// ==========================================================================
// 3. UI UPDATERS
// ==========================================================================

function updateProfileUI() {
  const { name, country, bio, avatar, interests } = state.profile;
  const editBtn = document.getElementById("edit-profile-btn");
  const isEditingNow = editBtn && editBtn.getAttribute('data-mode') === 'save';

  document.getElementById("display-name").textContent = name;
  document.getElementById("display-country").textContent = country;

  const bioElement = document.getElementById("display-bio");
  const isDefaultBio = !bio || bio.includes("Detailed statistics");
  bioElement.textContent = isDefaultBio ? getTranslation("bio_placeholder") : bio;

  const tagsContainer = document.getElementById("display-tags-minimal");
  if (tagsContainer) {
      tagsContainer.innerHTML = interests
          .map(tag => `<span class="tag-mini">${getTranslation(`interest_${tag.toLowerCase()}`)}</span>`)
          .join("");
  }

  const avatarEl = document.getElementById("profile-avatar");
  const currentAvatar = isEditingNow ? tempAvatar : avatar;

  if (currentAvatar) {
      avatarEl.style.backgroundImage = `url(${currentAvatar})`;
      avatarEl.textContent = "";
  } else {
      avatarEl.style.backgroundImage = "none";
      avatarEl.textContent = (name.replace('@', '')[0] || 'A').toUpperCase();
  }
}

function refreshAllLists() {
  renderListComponent("tracking-list", state.tracking, item => {
      const statusText = getTranslation(formatStatusKey(item.status));
      return `
          <div class="tracking-card">
              <div class="tracking-info">
                  <div class="tracking-title">To ${item.to}</div>
                  <div class="tracking-subtitle">${statusText}</div>
              </div>
              <div class="tracking-status">${statusText}</div>
          </div>`;
  });

  renderListComponent("leaderboard-list", state.leaderboard, player => {
    const sentText = getTranslation('stats_sent');
    const countriesText = getTranslation('stats_countries');
    return `
        <li class="leaderboard-item">
            <span class="leaderboard-name">${player.name}</span>
            <span class="leaderboard-stats">${player.sent} ${sentText} • ${player.countries} ${countriesText}</span>
        </li>`;
  });

  const cardTemplate = card => `
      <div class="postcard-card">
          <div class="postcard-card-header">
              <span class="postcard-flag">${card.countryFlag}</span>
              <span class="postcard-destination">${card.to}</span>
          </div>
          <div class="postcard-meta">${getTranslation(formatStatusKey(card.status))}</div>
      </div>`;
  
  renderListComponent("sent-postcards-grid", state.sentPostcards, cardTemplate);
  renderListComponent("received-postcards-grid", state.receivedPostcards, cardTemplate);
}

function renderListComponent(containerId, data, templateFn) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = data.map(templateFn).join("");
}

function renderMapSections() {
  const mapTemplate = (containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = Object.entries(COUNTRIES_BY_CONTINENT).map(([continent, flags]) => {
          const key = `continent_${continent.toLowerCase().replace(/\s/g, '_')}`;
          return `
              <div class="continent-row">
                  <div class="continent-header">
                      <span class="continent-name">${getTranslation(key)}</span>
                      <span class="continent-progress">${flags.length} ${getTranslation('countries_count')}</span>
                  </div>
                  <div class="flag-grid">${flags.map(f => `<div class="flag-circle">${f}</div>`).join('')}</div>
              </div>`;
      }).join("");
  };
  mapTemplate("sent-by-continent");
  mapTemplate("received-by-continent");
}

// ==========================================================================
// 4. ЛОГИКА РЕДАКТИРОВАНИЯ
// ==========================================================================

function setupProfileEditing() {
  const editBtn = document.getElementById("edit-profile-btn"); 
  const flagGrid = document.getElementById("flag-grid-picker");
  const inputCountry = document.getElementById("input-country");
  const flagPicker = document.getElementById("flag-picker-container");
  const avatarIcon = document.getElementById("avatar-edit-hint");
  const avatarUpload = document.getElementById("avatar-upload");

  // Клик по иконке фотоаппарата
  if (avatarIcon && avatarUpload) {
      avatarIcon.onclick = (e) => {
          e.stopPropagation();
          if (editBtn && editBtn.getAttribute('data-mode') === 'save') {
              avatarUpload.click();
          }
      };
  }

  // Загрузка фото (превью)
  if (avatarUpload) {
    avatarUpload.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            tempAvatar = ev.target.result;
            updateProfileUI(); 
        };
        reader.readAsDataURL(file);
    };
  }

  // Настройка выбора флага
  if (flagGrid && flagGrid.children.length === 0) {
      const allFlags = Object.values(COUNTRIES_BY_CONTINENT).flat().sort((a, b) => a.localeCompare(b));
      flagGrid.innerHTML = allFlags.map(flag => `<span class="flag-item" style="cursor:pointer;font-size:24px;padding:5px;">${flag}</span>`).join("");
      
      flagGrid.querySelectorAll('.flag-item').forEach(el => {
          el.onclick = (e) => {
              e.stopPropagation();
              tempSelectedCountry = el.textContent;
              inputCountry.value = tempSelectedCountry;
              flagPicker.style.display = "none";
          };
      });
  }

  if (inputCountry && flagPicker) {
      inputCountry.onclick = (e) => {
          e.stopPropagation();
          flagPicker.style.display = flagPicker.style.display === "block" ? "none" : "block";
      };
  }

  if (editBtn) {
    editBtn.onclick = () => {
        const isEditingNow = editBtn.getAttribute('data-mode') === 'save';
        toggleEditMode(!isEditingNow);
    };
  }
}

function toggleEditMode(enable) {
  const editBtn = document.getElementById("edit-profile-btn");
  const ids = ["profile-display-name-row", "display-bio", "display-tags-minimal"];
  const editIds = ["profile-edit-name-row", "input-bio", "avatar-edit-hint", "edit-tags-wrapper"];

  if (enable) {
      // ПЕРЕХОД В РЕЖИМ РЕДАКТИРОВАНИЯ
      editBtn.setAttribute('data-mode', 'save');
      
      tempSelectedCountry = state.profile.country;
      tempSelectedInterests = [...state.profile.interests];
      tempAvatar = state.profile.avatar;

      document.getElementById("input-name").value = state.profile.name;
      document.getElementById("input-country").value = state.profile.country;
      document.getElementById("input-bio").value = state.profile.bio.includes("Detailed statistics") ? "" : state.profile.bio;
      
      ids.forEach(id => document.getElementById(id).style.display = "none");
      editIds.forEach(id => document.getElementById(id).style.display = "block");
      renderEditTags();
  } else {
      // СОХРАНЕНИЕ
      state.profile.name = document.getElementById("input-name").value;
      state.profile.country = tempSelectedCountry;
      const newBio = document.getElementById("input-bio").value.trim();
      state.profile.bio = newBio === "" ? "Detailed statistics and recent achievements..." : newBio;
      state.profile.interests = [...tempSelectedInterests];
      state.profile.avatar = tempAvatar;

      editBtn.setAttribute('data-mode', 'edit');
      
      ids.forEach(id => document.getElementById(id).style.display = "flex");
      editIds.forEach(id => document.getElementById(id).style.display = "none");
      document.getElementById("flag-picker-container").style.display = "none";
  }

  applyLanguage(localStorage.getItem('selectedLang') || 'en');
}

function cancelEditMode() {
  const editBtn = document.getElementById("edit-profile-btn");
  if (!editBtn || editBtn.getAttribute('data-mode') !== 'save') return;

  // Сброс без сохранения
  editBtn.setAttribute('data-mode', 'edit');
  
  const ids = ["profile-display-name-row", "display-bio", "display-tags-minimal"];
  const editIds = ["profile-edit-name-row", "input-bio", "avatar-edit-hint", "edit-tags-wrapper"];

  ids.forEach(id => document.getElementById(id).style.display = "flex");
  editIds.forEach(id => document.getElementById(id).style.display = "none");
  document.getElementById("flag-picker-container").style.display = "none";

  updateProfileUI();
  applyLanguage(localStorage.getItem('selectedLang') || 'en');
}

function renderEditTags() {
  const container = document.getElementById("edit-tags-list");
  if (!container) return;
  
  container.innerHTML = AVAILABLE_INTERESTS.map(tag => {
      const isSelected = tempSelectedInterests.includes(tag);
      return `<span class="tag-selectable ${isSelected ? 'selected' : ''}" data-tag="${tag}">
        ${getTranslation(`interest_${tag.toLowerCase()}`)}
      </span>`;
  }).join("");

  container.querySelectorAll('.tag-selectable').forEach(el => {
      el.onclick = () => {
          const tag = el.dataset.tag;
          if (tempSelectedInterests.includes(tag)) {
              tempSelectedInterests = tempSelectedInterests.filter(t => t !== tag);
          } else if (tempSelectedInterests.length < 4) {
              tempSelectedInterests.push(tag);
          }
          renderEditTags();
      };
  });
}

// ==========================================================================
// 5. СИСТЕМНЫЕ ФУНКЦИИ
// ==========================================================================

function applyLanguage(lang) {
  if (!translations || !translations[lang]) return;
  localStorage.setItem('selectedLang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      
      // Динамический перевод кнопки
      if (key === 'edit_profile') {
          const mode = el.getAttribute('data-mode');
          const finalKey = (mode === 'save') ? 'save_profile' : 'edit_profile';
          el.textContent = translations[lang][finalKey] || translations[lang][key];
          return;
      }

      const translation = translations[lang][key];
      if (translation) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
              el.placeholder = translation;
          } else {
              el.textContent = translation;
          }
      }
  });

  updateProfileUI();
  refreshAllLists();
  renderMapSections();
}

function setupTheme() {
  const themeToggle = document.querySelector('.switch input[type="checkbox"]');
  const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      if (themeToggle) themeToggle.checked = (theme === 'dark');
  };
  if (themeToggle) {
      themeToggle.onchange = () => applyTheme(themeToggle.checked ? 'dark' : 'light');
  }
  applyTheme(localStorage.getItem('theme') || 'light');
}

document.addEventListener("DOMContentLoaded", () => {
  // Навигация
  const navItems = document.querySelectorAll(".nav-item");
  const screens = document.querySelectorAll(".screen");
  navItems.forEach(btn => {
      btn.onclick = () => {
          const target = btn.dataset.target;
          screens.forEach(scr => scr.classList.toggle("screen-active", scr.dataset.screen === target));
          navItems.forEach(b => b.classList.toggle("nav-active", b === btn));
      };
  });

  // Аккордеоны
  document.querySelectorAll('.expand-trigger').forEach(trigger => {
    trigger.onclick = (e) => {
        e.stopPropagation();
        const block = trigger.closest('.clickable-block');
        const isExpanding = !block.classList.contains('expanded');
        
        document.querySelectorAll('.clickable-block').forEach(b => {
            b.classList.remove('expanded');
            const t = b.querySelector('.expand-trigger');
            if (t) t.textContent = "⬇️";
        });

        if (isExpanding) {
            block.classList.add('expanded');
            trigger.textContent = "⬆️";
        } else {
            if (block.id === 'profile-block') cancelEditMode(); 
        }
    };
  });

  setupTheme();
  setupProfileEditing();

  // Языковые чипы
  const langChips = document.querySelectorAll('.chip-select');
  langChips.forEach(chip => {
      chip.onclick = () => {
          const lang = chip.getAttribute('data-lang');
          applyLanguage(lang);
          langChips.forEach(c => c.classList.remove('chip-active'));
          chip.classList.add('chip-active');
      };
  });

  const savedLang = localStorage.getItem('selectedLang') || 'en';
  applyLanguage(savedLang);
  document.querySelectorAll('.chip-select').forEach(chip => {
      chip.classList.toggle('chip-active', chip.getAttribute('data-lang') === savedLang);
  });

  // Синхронизация ассетов
  const syncAssets = () => {
      document.querySelectorAll('[id*="postcards"]').forEach(el => el.textContent = state.postcards);
      document.querySelectorAll('[id*="energy"]').forEach(el => el.textContent = state.energy);
  };
  syncAssets();
});