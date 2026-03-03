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
    tracking: [],
    leaderboard: [],
    sentPostcards: [],       // Очистили!
    receivedPostcards: [],    // Очистили!
    bots: [],
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

  // Базовая функция отрисовки списков (КОТОРУЮ МЫ ПОТЕРЯЛИ)
  function renderListComponent(containerId, items, templateFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map((item, index) => templateFn(item, index)).join('');
}
  
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
// 1. УМНЫЙ ТРЕКИНГ С ТАЙМЕРАМИ (ВХОДЯЩИЕ И ИСХОДЯЩИЕ)
renderListComponent("tracking-list", state.tracking, item => {
    // Проверяем, летит ли открытка К НАМ или ОТ НАС
    const isIncoming = item.type === "incoming";
    
    // Если входящая - прячем страну. Если исходящая - показываем куда летит.
    let countryName = isIncoming ? "Mystery Postcard" : (item.toCountry || "Unknown");
    let cityName = isIncoming ? "Destination: You" : (item.toCity || "");
    let flag = isIncoming ? "🌍" : (item.flag || item.countryFlag || "");
    
    // Поддержка старых записей
    if (!isIncoming && item.to && !item.toCountry) {
        const parts = item.to.split(", ");
        countryName = parts[0];
        cityName = parts.length > 1 ? parts[1] : "";
    }

    let displayStatus = item.status;
    let timeHtml = "";

    // Логика таймера
    if (item.arrivalAt) {
        const now = new Date().getTime();
        const diffMs = item.arrivalAt - now;

        if (diffMs > 0) {
            const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
            const minsLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            
            // Разные статусы для направлений
            displayStatus = isIncoming ? "Incoming 🛬" : "In transit 🛫";
            
            // Разные цвета текста на таймере: для входящих синий, для исходящих оранжевый
            const timeColor = isIncoming ? "#2980b9" : "#d35400";
            timeHtml = `<div style="font-size:11px; font-weight:bold; color:${timeColor}; background:#fff; padding:4px 8px; border-radius:12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">${hoursLeft}h ${minsLeft}m left</div>`;
        } else {
            displayStatus = "Delivered ✅";
            item.status = "Delivered";
            timeHtml = `<div style="font-size:11px; font-weight:bold; color:#27ae60; background:#fff; padding:4px 8px; border-radius:12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">Done</div>`;
        }
    } else {
        displayStatus = isIncoming ? "Incoming 🛬" : "In transit 🛫";
        const fallbackColor = isIncoming ? "#2980b9" : "#d35400";
        timeHtml = `<div class="tracking-status" style="color:${fallbackColor}; font-weight:bold; background:#fff; padding:4px 8px; border-radius:12px; font-size:11px;">${displayStatus}</div>`;
    }

    // === ГЛАВНАЯ МАГИЯ ВИЗУАЛА ===
    // Входящие карточки будут нежно-голубыми, а исходящие - теплыми оранжевыми
    const bgStyle = isIncoming ? "background: #eaf2f8; border: 1px solid #c9e1f5;" : "background: #ffd49b; border: 1px solid #f8c27a;";
    const statusColor = isIncoming ? "#2980b9" : "#d35400";

    return `
        <div class="tracking-card" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; ${bgStyle} border-radius: 12px; margin-bottom: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <div class="tracking-info" style="display: flex; flex-direction: column; gap: 4px;">
                <div style="font-weight: bold; font-size: 14px; color: #333; display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 16px;">${flag}</span> ${countryName}
                </div>
                
                ${cityName ? `<div style="font-size: 12px; color: #555;">${cityName}</div>` : ''}
                
                <div style="font-size: 11px; font-weight: 600; color: ${statusColor}; margin-top: 2px;">
                    ${displayStatus}
                </div>
            </div>
            
            <div>
                ${timeHtml}
            </div>
        </div>`;
});

 // 2. LEADERBOARD (ДИНАМИЧЕСКИЙ ПОДСЧЕТ С БОТАМИ)
 const uniqueCountriesCount = new Set(state.sentPostcards.map(card => card.countryFlag || card.flag)).size;
    
 // Твой профиль
 const userLeaderboardEntry = { 
     name: `${state.profile.name} (You)`, 
     sent: state.sentPostcards.length, 
     countries: uniqueCountriesCount,
     isUser: true
 };

 // Смешиваем тебя и ботов, затем сортируем по количеству отправленных (от большего к меньшему)
 let combinedLeaderboard = [userLeaderboardEntry, ...state.bots];
 combinedLeaderboard.sort((a, b) => b.sent - a.sent);

 if (combinedLeaderboard.length > 0) {
     renderListComponent("leaderboard-list", combinedLeaderboard, (player, index) => {
         const rank = index + 1;
         let rankBadge = `${rank}.`;
         if (rank === 1) rankBadge = "🥇";
         if (rank === 2) rankBadge = "🥈";
         if (rank === 3) rankBadge = "🥉";

         // Выделяем твой профиль цветом, чтобы ты не потерялся среди ботов
         const bgStyle = player.isUser ? 'background: #ffebd6; border-radius: 8px; padding: 8px; border: 1px solid #f39c12;' : 'padding: 8px 0; border-bottom: 1px solid #eee;';
         const nameWeight = player.isUser ? 'font-weight: 900; color: #d35400;' : 'font-weight: 600; color: #333;';

         return `
             <li class="leaderboard-item" style="${bgStyle} display: flex; justify-content: space-between; align-items: center; list-style: none;">
                 <div style="display: flex; align-items: center; gap: 10px;">
                     <span style="font-weight: bold; color: #888; width: 24px; text-align: center; font-size: 16px;">${rankBadge}</span>
                     <span style="${nameWeight} font-size: 14px;">${player.name} ${player.flag || ''}</span>
                 </div>
                 <span class="leaderboard-stats" style="color: #e67e22; font-weight: bold; font-size: 13px;">
                     ${player.sent} <span style="font-size: 10px; color: #aaa;">SENT</span>
                 </span>
             </li>`;
     });
 }

// 3. НОВЫЕ ПРЯМОУГОЛЬНЫЕ КАРТОЧКИ (УМНЫЙ ШАБЛОН)
const cardTemplate = (card, index, isReceived) => {
    const flag = card.countryFlag || card.flag || '🌍';
    let mainText = "";
    let subText = "";

    // ЛОГИКА: Разделяем отображение для Входящих и Исходящих
    if (isReceived) {
        // Для полученных открыток показываем только Никнейм отправителя
        mainText = card.fromBot || card.senderName || "Unknown Sender";
        subText = ""; // Вторую строку (город/дубль флага) оставляем пустой
    } else {
        // Для отправленных открыток показываем Страну и Город
        const toParts = (card.to || "Unknown, Unknown").split(", ");
        mainText = toParts[0]; 
        subText = toParts.length > 1 ? toParts[1] : ""; 
    }

    // Цвет статуса: зеленый для полученных, оранжевый для отправленных
    const statusColor = isReceived ? '#2ecc71' : '#f39c12';

    return `
    <div class="postcard-card archive-card" data-index="${index}" style="padding: 0; overflow: hidden; display: flex; flex-direction: column; aspect-ratio: 3/2; height: auto; position: relative; cursor: pointer; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        ${card.frontImage 
            ? `<img src="${card.frontImage}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 1;">` 
            : `<div style="width: 100%; height: 100%; background: #eee; position: absolute; top: 0; left: 0; z-index: 1; display:flex; align-items:center; justify-content:center; color:#aaa; font-size:10px;">No Image</div>`
        }
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.85) 70%); padding: 30px 10px 10px 10px; z-index: 2; display: flex; flex-direction: column; gap: 3px; align-items: flex-start;">
            
            <span style="color: white; font-weight: bold; font-size: 13px; text-shadow: 0 1px 3px rgba(0,0,0,0.9); line-height: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">
                ${flag} ${mainText}
            </span>
            
            ${subText ? `<span style="color: #e0e0e0; font-size: 11px; text-shadow: 0 1px 2px rgba(0,0,0,0.9); line-height: 1;">${subText}</span>` : ''}
            
            <span style="color: ${statusColor}; font-size: 10px; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.9); line-height: 1; margin-top: 2px;">
                ${card.status}
            </span>
            
        </div>
    </div>`;
};
    
// Специальная функция для рендера с указанием типа (Полученные или Отправленные)
const renderArchiveList = (containerId, dataArray, isReceived = false) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    // Передаем параметр isReceived внутрь шаблона
    container.innerHTML = dataArray.map((item, i) => cardTemplate(item, i, isReceived)).join('');
};

// Вызываем отрисовку списков. Для полученных передаем true!
renderArchiveList("sent-postcards-grid", state.sentPostcards, false);
renderArchiveList("received-postcards-grid", state.receivedPostcards, true);

    // 4. СЧЕТЧИКИ АРХИВОВ
    const sentCountEl = document.getElementById("sent-count");
    if (sentCountEl) sentCountEl.textContent = state.sentPostcards ? state.sentPostcards.length : 0;

    const receivedCountEl = document.getElementById("received-count");
    if (receivedCountEl) receivedCountEl.textContent = state.receivedPostcards ? state.receivedPostcards.length : 0;

    // === 5. СЧЕТЧИК ДЛЯ TRACKING BOARD (Только активные таймеры) ===
    const trackingCountEl = document.getElementById("tracking-count");
    if (trackingCountEl) {
        const now = new Date().getTime();
        // Считаем только те открытки, у которых время прибытия еще в будущем
        const activeDeliveries = state.tracking.filter(item => {
            return item.arrivalAt && (item.arrivalAt - now > 0);
        });
        
        trackingCountEl.textContent = activeDeliveries.length;
        
        // Если активных доставок нет, можно сделать бейджик серым, а если есть - оранжевым
        if (activeDeliveries.length > 0) {
            trackingCountEl.style.background = '#e67e22'; // Оранжевый
        } else {
            trackingCountEl.style.background = '#ccc'; // Серый
        }
    }
// === 6. ОБНОВЛЯЕМ КАРТУ МИРА ===
if (typeof renderMapSections === 'function') {
    renderMapSections();
}
}
  
function renderMapSections() {
    // 1. Собираем уникальные флаги, которые мы уже отправили или получили
    const sentFlags = [...new Set(state.sentPostcards.map(card => card.countryFlag || card.flag))];
    const receivedFlags = [...new Set(state.receivedPostcards.map(card => card.countryFlag || card.flag))];

    const mapTemplate = (containerId, collectedFlags) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = Object.entries(COUNTRIES_BY_CONTINENT).map(([continent, flags]) => {
            // Считаем, сколько флагов из этого континента мы уже собрали
            const collectedInContinent = flags.filter(f => collectedFlags.includes(f)).length;
            
            return `
                <div class="continent-row" style="margin-bottom: 20px;">
                    <div class="continent-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 4px;">
                        <span class="continent-name" style="font-weight: bold; color: #333;">${continent}</span>
                        <span class="continent-progress" style="font-size: 12px; color: ${collectedInContinent > 0 ? '#e67e22' : '#888'}; font-weight: ${collectedInContinent > 0 ? 'bold' : 'normal'};">
                            ${collectedInContinent} / ${flags.length}
                        </span>
                    </div>
                    <div class="flag-grid" style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${flags.map(f => {
                            // Проверяем, есть ли текущий флаг в нашем списке собранных
                            const isCollected = collectedFlags.includes(f);
                            const flagClass = isCollected ? 'flag-circle flag-collected' : 'flag-circle flag-locked';
                            
                            return `<div class="${flagClass}" title="${f}" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: default; font-size: 18px;">${f}</div>`;
                        }).join('')}
                    </div>
                </div>`;
        }).join("");
    };
    
    // Рисуем обе карты, передавая им соответствующие списки собранных флагов
    mapTemplate("sent-by-continent", sentFlags);
    mapTemplate("received-by-continent", receivedFlags);
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
  
    // === ОБНОВЛЕННАЯ СИНХРОНИЗАЦИЯ БАЛАНСА ===
    const syncAssets = () => {
        const balanceElement = document.querySelector('.home-assets .asset-card:first-child .asset-value');
        if (balanceElement) balanceElement.textContent = state.postcards;
        
        // Используем универсальный поиск энергии (и по ID, и по классам, чтобы точно сработало)
        const energyElement = document.getElementById('energy-display') || document.querySelector('.home-assets .asset-card:nth-child(2) .asset-value');
        if (energyElement) energyElement.textContent = state.energy;
    };
    syncAssets();

    // === СИСТЕМА ЕЖЕДНЕВНЫХ НАГРАД (00:00) ===
    function checkDailyRefill() {
        // Получаем строку с сегодняшней датой (например, "Sat Feb 28 2026")
        const today = new Date().toDateString(); 
        const lastRefill = localStorage.getItem('lastRefillDate');

        // Если пользователь зашел в игру впервые — просто фиксируем дату и даем стартовый баланс
        if (!lastRefill) {
            localStorage.setItem('lastRefillDate', today);
            return;
        }

        // Если сохраненная дата не совпадает с сегодняшней (наступил новый день!)
        if (lastRefill !== today) {
            state.postcards += 1;
            state.energy += 150;
            
            // Запоминаем новую дату, чтобы не выдать награду дважды
            localStorage.setItem('lastRefillDate', today);
            
            // Обновляем цифры на главном экране
            syncAssets();

            // Показываем красивое окно с подарком
            const phoneFrame = document.querySelector('.phone-frame') || document.body;
            const overlay = document.createElement('div');
            overlay.className = 'custom-alert-overlay';
            overlay.innerHTML = `
                <div class="custom-alert-box">
                    <div style="font-size: 45px; margin-bottom: -10px;">🎁</div>
                    <div style="font-size: 18px; font-weight: bold; color: #d35400;">Daily Reward!</div>
                    <div class="custom-alert-text">
                        Welcome back! It's a new day.<br>Here is your daily refill:<br><br>
                        <b>+1 Postcard</b> ✉️<br>
                        <b>+150 Energy</b> ⚡
                    </div>
                    <button class="primary-button custom-alert-btn">Awesome!</button>
                </div>
            `;
            
            overlay.querySelector('.custom-alert-btn').onclick = () => overlay.remove();
            phoneFrame.appendChild(overlay);
        }
    }

    // Проверяем награду сразу при запуске приложения
    checkDailyRefill(); 
    
    // И проверяем каждую минуту (чтобы выдать награду ровно в 00:00, если приложение открыто)
    setInterval(checkDailyRefill, 60000);

    // === ВНУТРИИГРОВОЙ МАГАЗИН (TRAVEL SHOP) ===
    const refillBtn = document.querySelector('.home-assets .primary-button');
    if (refillBtn) {
        refillBtn.onclick = (e) => {
            e.stopPropagation(); // Чтобы блок не сворачивался при клике на кнопку
            openStoreModal();
        };
    }

    function openStoreModal() {
        const phoneFrame = document.querySelector('.phone-frame') || document.body;
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay store-overlay';

        overlay.innerHTML = `
            <div class="custom-alert-box store-modal-box">
                <div class="store-header">
                    <span>Travel Shop 🎒</span>
                    <button class="store-close" onclick="this.closest('.store-overlay').remove()">✕</button>
                </div>

                <div class="store-category">
                    <div class="store-category-title">✉️ Blank Postcards</div>
                    <div class="store-grid">
                        <div class="store-item">
                            <div class="store-item-icon">✉️</div>
                            <div class="store-item-amount">1x</div>
                            <button class="store-item-btn" onclick="buyStoreItem('postcards', 1, '$0.99')">$0.99</button>
                        </div>
                        <div class="store-item">
                            <div class="store-item-icon">✉️</div>
                            <div class="store-item-amount">5x</div>
                            <button class="store-item-btn" onclick="buyStoreItem('postcards', 5, '$3.99')">$3.99</button>
                        </div>
                        <div class="store-item">
                            <div class="store-item-icon">✉️</div>
                            <div class="store-item-amount">10x</div>
                            <button class="store-item-btn" onclick="buyStoreItem('postcards', 10, '$5.99')">$5.99</button>
                        </div>
                    </div>
                </div>

                <div class="store-category" style="margin-bottom: 0;">
                    <div class="store-category-title">⚡ Energy Packs</div>
                    <div class="store-grid">
                        <div class="store-item">
                            <div class="store-item-icon">⚡</div>
                            <div class="store-item-amount">150</div>
                            <button class="store-item-btn" onclick="buyStoreItem('energy', 150, '$1.99')">$1.99</button>
                        </div>
                        <div class="store-item">
                            <div class="store-item-icon">⚡</div>
                            <div class="store-item-amount">750</div>
                            <button class="store-item-btn" onclick="buyStoreItem('energy', 750, '$5.99')">$5.99</button>
                        </div>
                        <div class="store-item">
                            <div class="store-item-icon">⚡</div>
                            <div class="store-item-amount">1500</div>
                            <button class="store-item-btn" onclick="buyStoreItem('energy', 1500, '$9.99')">$9.99</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        phoneFrame.appendChild(overlay);
    }

    // Глобальная функция покупки (чтобы срабатывала по клику на кнопку в HTML)
    window.buyStoreItem = function(type, amount, price) {
        // 1. Закрываем окно магазина
        const overlay = document.querySelector('.store-overlay');
        if (overlay) overlay.remove();

        // 2. Добавляем купленный товар в инвентарь (в стейт)
        if (type === 'postcards') {
            state.postcards += amount;
        } else if (type === 'energy') {
            state.energy += amount;
        }

        // 3. Мгновенно обновляем интерфейс (используем уже существующую функцию)
        if (typeof syncAssets === 'function') {
            syncAssets();
        }

        // 4. Показываем красивое окно об успешной покупке
        const phoneFrame = document.querySelector('.phone-frame') || document.body;
        const successOverlay = document.createElement('div');
        successOverlay.className = 'custom-alert-overlay';
        
        const typeName = type === 'postcards' ? 'Postcards ✉️' : 'Energy ⚡';

        successOverlay.innerHTML = `
            <div class="custom-alert-box">
                <div style="font-size: 50px; margin-bottom: -15px;">🎉</div>
                <div style="font-size: 20px; font-weight: 900; color: #27ae60; margin-bottom: 5px;">Payment Successful!</div>
                <div class="custom-alert-text" style="font-size: 14px;">
                    You have successfully purchased<br>
                    <b style="font-size: 16px; color: #d35400;">${amount} ${typeName}</b><br>
                    for ${price}.
                </div>
                <button class="primary-button custom-alert-btn" onclick="this.closest('.custom-alert-overlay').remove()">Awesome!</button>
            </div>
        `;
        phoneFrame.appendChild(successOverlay);
    };

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
})