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
        city: "Paris",
        bio: "Detailed statistics and recent achievements...",
        avatar: null,
        avatarPosX: 50, // НОВОЕ: Позиция по горизонтали
        avatarPosY: 50, // НОВОЕ: Позиция по вертикали
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
  
  let tempSelectedInterests = [];
  let tempSelectedCountry = "";
  let tempAvatar = null;
  let tempAvatarPosX = 50; // НОВОЕ
  let tempAvatarPosY = 50; // НОВОЕ
  
  // ==========================================================================
  // 2. UI UPDATERS
  // ==========================================================================
  
  function updateProfileUI() {
    const { name, country, city, bio, avatar, interests } = state.profile; 
    const editBtn = document.getElementById("edit-profile-btn");
    const isEditingNow = editBtn && editBtn.getAttribute('data-mode') === 'save';
  
    document.getElementById("display-name").textContent = name;
    document.getElementById("display-country").textContent = country;

    const displayCity = document.getElementById("display-city");
    if (displayCity) {
        displayCity.textContent = city;
    }
  
    const bioElement = document.getElementById("display-bio");
    const isDefaultBio = !bio || bio.includes("Detailed statistics");
    bioElement.textContent = isDefaultBio ? "Detailed statistics and recent achievements will be shown here." : bio;
  
    const tagsContainer = document.getElementById("display-tags-minimal");
    if (tagsContainer) {
        tagsContainer.innerHTML = interests
            .map(tag => `<span class="tag-mini">${tag}</span>`)
            .join("");
    }
  
    const avatarEl = document.getElementById("profile-avatar");
    const currentAvatar = isEditingNow ? tempAvatar : avatar;
    // Берем временные координаты, если редактируем, или сохраненные, если просто смотрим
    const currentPosX = isEditingNow ? tempAvatarPosX : state.profile.avatarPosX;
    const currentPosY = isEditingNow ? tempAvatarPosY : state.profile.avatarPosY;
  
    if (currentAvatar) {
        avatarEl.style.backgroundImage = `url(${currentAvatar})`;
        avatarEl.style.backgroundPosition = `${currentPosX}% ${currentPosY}%`; // Применяем координаты
        avatarEl.style.backgroundSize = "cover";
        avatarEl.textContent = "";
        avatarEl.style.cursor = isEditingNow ? "move" : "default"; // Меняем курсор
    } else {
        avatarEl.style.backgroundImage = "none";
        avatarEl.textContent = (name.replace('@', '')[0] || 'A').toUpperCase();
    }
  }
  
  function refreshAllLists() {
    renderListComponent("tracking-list", state.tracking, item => {
        return `
            <div class="tracking-card">
                <div class="tracking-info">
                    <div class="tracking-title">To ${item.to}</div>
                    <div class="tracking-subtitle">${item.status}</div>
                </div>
                <div class="tracking-status">${item.status}</div>
            </div>`;
    });
  
    renderListComponent("leaderboard-list", state.leaderboard, player => {
      return `
          <li class="leaderboard-item">
              <span class="leaderboard-name">${player.name}</span>
              <span class="leaderboard-stats">${player.sent} sent • ${player.countries} countries</span>
          </li>`;
    });
  
    const cardTemplate = card => `
        <div class="postcard-card">
            <div class="postcard-card-header">
                <span class="postcard-flag">${card.countryFlag}</span>
                <span class="postcard-destination">${card.to}</span>
            </div>
            <div class="postcard-meta">${card.status}</div>
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
            return `
                <div class="continent-row">
                    <div class="continent-header">
                        <span class="continent-name">${continent}</span>
                        <span class="continent-progress">${flags.length} countries</span>
                    </div>
                    <div class="flag-grid">${flags.map(f => `<div class="flag-circle">${f}</div>`).join('')}</div>
                </div>`;
        }).join("");
    };
    mapTemplate("sent-by-continent");
    mapTemplate("received-by-continent");
  }
  
  
  // ==========================================================================
  // 3. ЛОГИКА РЕДАКТИРОВАНИЯ
  // ==========================================================================
  
  function setupProfileEditing() {
    const editBtn = document.getElementById("edit-profile-btn"); 
    const flagGrid = document.getElementById("flag-grid-picker");
    const inputCountry = document.getElementById("input-country");
    const flagPicker = document.getElementById("flag-picker-container");
    const avatarIcon = document.getElementById("avatar-edit-hint");
    const avatarUpload = document.getElementById("avatar-upload");
  
    if (avatarIcon && avatarUpload) {
        avatarIcon.onclick = (e) => {
            e.stopPropagation();
            if (editBtn && editBtn.getAttribute('data-mode') === 'save') {
                avatarUpload.click();
            }
        };
    }
  
    if (avatarUpload) {
        avatarUpload.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                tempAvatar = ev.target.result;
                tempAvatarPosX = 50; // Сбрасываем центр при загрузке нового фото
                tempAvatarPosY = 50;
                updateProfileUI(); 
            };
            reader.readAsDataURL(file);
        };
    }
  
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
        editBtn.textContent = "Save Changes"; 
        
        tempSelectedCountry = state.profile.country;
        tempSelectedInterests = [...state.profile.interests];
        tempAvatar = state.profile.avatar;
        
        // НОВОЕ: Загружаем координаты для перетаскивания
        tempAvatarPosX = state.profile.avatarPosX || 50; 
        tempAvatarPosY = state.profile.avatarPosY || 50; 
  
        document.getElementById("input-name").value = state.profile.name;
        document.getElementById("input-country").value = state.profile.country;
        document.getElementById("input-city").value = state.profile.city || ""; 
        document.getElementById("input-bio").value = state.profile.bio.includes("Detailed statistics") ? "" : state.profile.bio;
        
        ids.forEach(id => document.getElementById(id).style.display = "none");
        editIds.forEach(id => document.getElementById(id).style.display = "flex"); 
        renderEditTags();
    } else {
        // СОХРАНЕНИЕ
        state.profile.name = document.getElementById("input-name").value;
        state.profile.country = tempSelectedCountry;
        state.profile.city = document.getElementById("input-city").value.trim(); 
        
        // НОВОЕ: Сохраняем сдвинутые координаты в память
        state.profile.avatarPosX = tempAvatarPosX;
        state.profile.avatarPosY = tempAvatarPosY;
        
        const newBio = document.getElementById("input-bio").value.trim();
        state.profile.bio = newBio === "" ? "Detailed statistics and recent achievements..." : newBio;
        state.profile.interests = [...tempSelectedInterests];
        state.profile.avatar = tempAvatar;
  
        editBtn.setAttribute('data-mode', 'edit');
        editBtn.textContent = "Edit Profile"; 
        
        ids.forEach(id => document.getElementById(id).style.display = "flex");
        editIds.forEach(id => document.getElementById(id).style.display = "none");
        document.getElementById("flag-picker-container").style.display = "none";
  
        updateProfileUI(); 
    }
  }
  
  function cancelEditMode() {
    const editBtn = document.getElementById("edit-profile-btn");
    if (!editBtn || editBtn.getAttribute('data-mode') !== 'save') return;
  
    editBtn.setAttribute('data-mode', 'edit');
    editBtn.textContent = "Edit Profile"; // Возвращаем текст
    
    const ids = ["profile-display-name-row", "display-bio", "display-tags-minimal"];
    const editIds = ["profile-edit-name-row", "input-bio", "avatar-edit-hint", "edit-tags-wrapper"];
  
    ids.forEach(id => document.getElementById(id).style.display = "flex");
    editIds.forEach(id => document.getElementById(id).style.display = "none");
    document.getElementById("flag-picker-container").style.display = "none";
  
    updateProfileUI();
  }
  
  function renderEditTags() {
    const container = document.getElementById("edit-tags-list");
    if (!container) return;
    
    container.innerHTML = AVAILABLE_INTERESTS.map(tag => {
        const isSelected = tempSelectedInterests.includes(tag);
        return `<span class="tag-selectable ${isSelected ? 'selected' : ''}" data-tag="${tag}">
          ${tag}
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
  // 4. СИСТЕМНЫЕ ФУНКЦИИ
  // ==========================================================================
  
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
    const navItems = document.querySelectorAll(".nav-item");
    const screens = document.querySelectorAll(".screen");
    
    navItems.forEach(btn => {
        btn.onclick = () => {
            const target = btn.dataset.target;
            screens.forEach(scr => scr.classList.toggle("screen-active", scr.dataset.screen === target));
            navItems.forEach(b => b.classList.toggle("nav-active", b === btn));
        };
    });

    

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
    
    // Инициализация отображения
    updateProfileUI();
    refreshAllLists();
    renderMapSections();
  
    const syncAssets = () => {
        document.querySelectorAll('[id*="postcards"]').forEach(el => el.textContent = state.postcards);
        document.querySelectorAll('[id*="energy"]').forEach(el => el.textContent = state.energy);
    };
    syncAssets();

  // ЛОГИКА ПЕРЕТАСКИВАНИЯ АВАТАРКИ
  const avatarEl = document.getElementById("profile-avatar");
  let isDraggingAvatar = false;
  let startX = 0, startY = 0;

  // === САМОЕ ВАЖНОЕ: Убиваем системный Drag-and-Drop ===
  if(avatarEl) {
      avatarEl.ondragstart = () => false;

      function getEventCoords(e) {
          if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
          return { x: e.clientX, y: e.clientY };
      }

      function startDrag(e) {
          const editBtn = document.getElementById("edit-profile-btn");
          const isEditingNow = editBtn && editBtn.getAttribute('data-mode') === 'save';
          if (!isEditingNow || !tempAvatar) return;
          
          isDraggingAvatar = true;
          const coords = getEventCoords(e);
          startX = coords.x;
          startY = coords.y;
          
          // Блокируем стандартное выделение мышью
          if(e.type === 'mousedown') e.preventDefault(); 
      }

      function moveDrag(e) {
          if (!isDraggingAvatar) return;
          
          // Не даем экрану дергаться при перетаскивании
          if(e.cancelable) e.preventDefault(); 
          
          const coords = getEventCoords(e);
          const deltaX = coords.x - startX;
          const deltaY = coords.y - startY;

          tempAvatarPosX -= deltaX * 0.8; // Скорость сдвига
          tempAvatarPosY -= deltaY * 0.8;

          // Ограничиваем сдвиг от 0 до 100%
          tempAvatarPosX = Math.max(0, Math.min(100, tempAvatarPosX));
          tempAvatarPosY = Math.max(0, Math.min(100, tempAvatarPosY));

          avatarEl.style.backgroundPosition = `${tempAvatarPosX}% ${tempAvatarPosY}%`;

          startX = coords.x;
          startY = coords.y;
      }

      function endDrag() {
          isDraggingAvatar = false;
      }

      // Слушатели для мыши
      avatarEl.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', moveDrag, { passive: false });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('mouseleave', endDrag);

      // Слушатели для тачскрина
      avatarEl.addEventListener('touchstart', startDrag, { passive: true });
      document.addEventListener('touchmove', moveDrag, { passive: false });
      document.addEventListener('touchend', endDrag);
      document.addEventListener('touchcancel', endDrag);
  }
});