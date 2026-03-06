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
        name: "",           // ПУСТО СТАРТ!
        country: "",        // ПУСТО СТАРТ!
        bio: "",            // ПУСТО СТАРТ!
        avatar: null,
        avatarPosX: 50, 
        avatarPosY: 50, 
        interests: []       // ПУСТО СТАРТ!
    },
    postcards: 5,
    energy: 500,
    tracking: [],
    leaderboard: [],
    sentPostcards: [],       
    receivedPostcards: [],   
    bots: [],
};

// ==========================================================================
// УМНЫЙ КОМПРЕССОР ИЗОБРАЖЕНИЙ (ЧТОБЫ НЕ ЗАБИВАТЬ ПАМЯТЬ)
// ==========================================================================
function compressImage(file, maxWidth, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Если картинка больше нужного размера - уменьшаем её пропорционально
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Сжимаем в формат JPEG с качеством 70% (визуально не отличить, а весит в 20 раз меньше!)
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            callback(compressedDataUrl);
        };
    };
}

// ==========================================================================
// СИСТЕМА ПАМЯТИ И СОХРАНЕНИЙ (LOCAL STORAGE)
// ==========================================================================
function saveState() {
    const saveToggle = document.getElementById('save-toggle');
    if (!saveToggle || !saveToggle.checked) {
        localStorage.removeItem('pj_state');
        localStorage.setItem('pj_save_enabled', 'false');
        return;
    }
    try {
        localStorage.setItem('pj_state', JSON.stringify(state));
        localStorage.setItem('pj_save_enabled', 'true');
    } catch (error) {
        console.error("ОШИБКА СОХРАНЕНИЯ: Память браузера переполнена!", error);
        if (saveToggle) saveToggle.checked = false;
        localStorage.setItem('pj_save_enabled', 'false');
        
        // === ТЕПЕРЬ ВЫЗЫВАЕТСЯ НАШЕ КРАСИВОЕ ОКНО ===
        if (typeof showCustomAlert === 'function') {
            showCustomAlert("⚠️", "Storage Full!", "Cannot save more images. Your browser memory is full.<br><br>Use <b>'Clear All Data'</b> in Settings.", "#e74c3c");
        } else {
            alert("⚠️ Local Storage is full! Auto-save disabled.");
        }
    }
}

function loadState() {
    const isSaveEnabled = localStorage.getItem('pj_save_enabled') === 'true';
    if (isSaveEnabled) {
        const savedData = localStorage.getItem('pj_state');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                Object.keys(parsed).forEach(key => {
                    state[key] = parsed[key];
                });
                console.log("💾 Progress loaded from LocalStorage!");
            } catch(e) {
                console.error("Error loading save:", e);
            }
        }
    }
}

// СРАЗУ ПОСЛЕ STATE ПЫТАЕМСЯ ЗАГРУЗИТЬ СОХРАНЕНИЯ
loadState();
  
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
let tempAvatarPosX = 50; 
let tempAvatarPosY = 50; 
  
// ==========================================================================
// 2. UI UPDATERS
// ==========================================================================

function renderListComponent(containerId, items, templateFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = items.map((item, index) => templateFn(item, index)).join('');
}

function showCustomAlert(icon, title, text, color = "#2980b9", onConfirm = null) {
    const phoneFrame = document.querySelector('.phone-frame') || document.body;
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    overlay.style.zIndex = '9999'; 
    overlay.innerHTML = `
        <div class="custom-alert-box">
            <div style="font-size: 50px; margin-bottom: -15px;">${icon}</div>
            <div style="font-size: 20px; font-weight: 900; color: ${color}; margin-bottom: 5px;">${title}</div>
            <div class="custom-alert-text" style="font-size: 14px;">
                ${text}
            </div>
            <button class="primary-button custom-alert-btn" style="background: ${color}; border-color: ${color};">OK</button>
        </div>
    `;
    
    // Находим кнопку внутри окошка и вешаем умный клик
    const btn = overlay.querySelector('.custom-alert-btn');
    btn.onclick = () => {
        overlay.remove(); // Закрываем окно
        if (onConfirm) onConfirm(); // Выполняем действие, если оно было передано!
    };
    
    phoneFrame.appendChild(overlay);
}
  
function updateProfileUI() {
    const { name, country, bio, avatar, interests } = state.profile; 
    const editBtn = document.getElementById("edit-profile-btn");
    const isEditingNow = editBtn && editBtn.getAttribute('data-mode') === 'save';
  
    // Если профиль пуст - ставим заглушки "New Traveler" и белый флаг
    document.getElementById("display-name").textContent = name || "New Traveler";
    document.getElementById("display-country").textContent = country || "🏳️";
    
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
    const currentPosX = isEditingNow ? tempAvatarPosX : state.profile.avatarPosX;
    const currentPosY = isEditingNow ? tempAvatarPosY : state.profile.avatarPosY;
  
    if (currentAvatar) {
        avatarEl.style.backgroundImage = `url(${currentAvatar})`;
        avatarEl.style.backgroundPosition = `${currentPosX}% ${currentPosY}%`; 
        avatarEl.style.backgroundSize = "cover";
        avatarEl.textContent = "";
        avatarEl.style.cursor = isEditingNow ? "move" : "default"; 
    } else {
        avatarEl.style.backgroundImage = "none";
        // Берем первую букву имени или '?' если пусто
        const firstLetter = name ? name.replace('@', '')[0] : '?';
        avatarEl.textContent = (firstLetter || '?').toUpperCase();
    }
}
  
function refreshAllLists() {
    if (typeof saveState === 'function') saveState();

    if (state.tracking && state.tracking.length > 0) {
        state.tracking.sort((a, b) => a.arrivalAt - b.arrivalAt);
    }
    renderListComponent("tracking-list", state.tracking, item => {
        const isIncoming = item.type === "incoming";
        let countryName = isIncoming ? "Mystery Postcard" : (item.toCountry || "Unknown");
        let cityName = isIncoming ? "Destination: You" : (item.toCity || "");
        let flag = isIncoming ? "🌍" : (item.flag || item.countryFlag || "");
        
        if (!isIncoming && item.to && !item.toCountry) {
            const parts = item.to.split(", ");
            countryName = parts[0];
            cityName = parts.length > 1 ? parts[1] : "";
        }

        let displayStatus = item.status;
        let timeHtml = "";

        if (item.arrivalAt) {
            const now = new Date().getTime();
            const diffMs = item.arrivalAt - now;

            if (diffMs > 0) {
                const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
                const minsLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                displayStatus = isIncoming ? "Incoming 🛬" : "In transit 🛫";
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
        
        const homeBadge = document.getElementById("home-badge");
        if (homeBadge) {
            const incomingCount = state.tracking.filter(item => item.type === "incoming").length;
            if (incomingCount > 0) {
                homeBadge.textContent = incomingCount;
                homeBadge.style.display = "block";
            } else {
                homeBadge.style.display = "none";
            }
        }

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
                <div>${timeHtml}</div>
            </div>`;
    });

/// 2. LEADERBOARD (ДИНАМИЧЕСКИЙ ПОДСЧЕТ С БОТАМИ И СТРАНАМИ)
    
    // === ЖЕЛЕЗОБЕТОННЫЙ ФИЛЬТР ОФФЛАЙН-ОТКРЫТОК ===
    const validSentPostcards = state.sentPostcards.filter(card => {
        // 1. Если стоит явная метка оффлайна
        if (card.isOffline === true) return false;
        
        // 2. Ищем слова-маркеры в адресате (приводим к нижнему регистру для надежности)
        const dest = (card.to || "").toLowerCase();
        if (dest.includes("personal") || dest.includes("collection") || dest.includes("offline") || dest === "") {
            return false;
        }
        
        return true; // Если проверки пройдены, открытка летит в рейтинг
    });

    const uniqueCountriesCount = new Set(validSentPostcards.map(card => card.countryFlag || card.flag)).size;
        
    const userLeaderboardEntry = { 
        name: `${state.profile.name || "New Traveler"} (You)`, 
        sent: validSentPostcards.length, // Используем отфильтрованный массив!
        countries: uniqueCountriesCount,
        isUser: true,
        flag: state.profile.country || "🏳️" 
    };

    const botEntries = state.bots.map(bot => {
        const realCountriesCount = bot.contactedCountries ? bot.contactedCountries.length : 0;
        return { ...bot, countries: realCountriesCount, isUser: false };
    });

    let combinedLeaderboard = [userLeaderboardEntry, ...botEntries];
    combinedLeaderboard.forEach(p => p.score = p.sent + (p.countries * 10));
    combinedLeaderboard.sort((a, b) => b.score - a.score);

    const playerIndex = combinedLeaderboard.findIndex(p => p.isUser);
    const playerRank = playerIndex + 1;
    const top10 = combinedLeaderboard.slice(0, 10);

    const listContainer = document.getElementById("leaderboard-list");
    if (listContainer) {
        let html = top10.map((player, index) => {
            const rank = index + 1;
            let rankBadge = `${rank}.`;
            if (rank === 1) rankBadge = "🥇";
            if (rank === 2) rankBadge = "🥈";
            if (rank === 3) rankBadge = "🥉";

            const bgStyle = player.isUser ? 'background: #ffebd6; border-radius: 8px; padding: 8px; border: 1px solid #f39c12;' : 'padding: 8px 0; border-bottom: 1px solid #eee;';
            const nameWeight = player.isUser ? 'font-weight: 900; color: #d35400;' : 'font-weight: 600; color: #333;';

            return `
                <li class="leaderboard-item" style="${bgStyle} display: flex; justify-content: space-between; align-items: center; list-style: none;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: bold; color: #888; width: 24px; text-align: center; font-size: 16px;">${rankBadge}</span>
                        <span style="${nameWeight} font-size: 14px;">${player.name} ${player.flag || ''}</span>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column;">
                        <span class="leaderboard-stats" style="color: #e67e22; font-weight: bold; font-size: 13px;">
                            ⭐ ${player.score} <span style="font-size: 10px; color: #aaa;">SCORE</span>
                        </span>
                        <span style="font-size: 9px; color: #aaa; margin-top: 2px;">
                            ${player.sent} sent • ${player.countries} countries
                        </span>
                    </div>
                </li>`;
        }).join('');

        if (playerRank > 10) {
            const player = combinedLeaderboard[playerIndex];
            html += `
                <li style="text-align: center; color: #aaa; font-size: 14px; margin: 4px 0; list-style: none;">•••</li>
                <li class="leaderboard-item" style="background: #ffebd6; border-radius: 8px; padding: 8px; border: 1px dashed #f39c12; display: flex; justify-content: space-between; align-items: center; list-style: none;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: bold; color: #888; width: 24px; text-align: center; font-size: 16px;">${playerRank}.</span>
                        <span style="font-weight: 900; color: #d35400; font-size: 14px;">${player.name} ${player.flag || ''}</span>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column;">
                        <span class="leaderboard-stats" style="color: #e67e22; font-weight: bold; font-size: 13px;">
                            ⭐ ${player.score} <span style="font-size: 10px; color: #aaa;">SCORE</span>
                        </span>
                        <span style="font-size: 9px; color: #aaa; margin-top: 2px;">
                            ${player.sent} sent • ${player.countries} countries
                        </span>
                    </div>
                </li>`;
        }
        listContainer.innerHTML = html;
    }

    const cardTemplate = (card, index, isReceived) => {
        const flag = card.countryFlag || card.flag || '🌍';
        let mainText = "";

        if (isReceived) {
            mainText = card.fromBot || card.senderName || "Unknown Sender";
        } else {
            mainText = (card.to || "Unknown").split(", ")[0]; 
        }

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
                <span style="color: ${statusColor}; font-size: 10px; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.9); line-height: 1; margin-top: 2px;">
                    ${card.status}
                </span>
            </div>
        </div>`;
    };
        
    const renderArchiveList = (containerId, dataArray, isReceived = false) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = dataArray.map((item, i) => cardTemplate(item, i, isReceived)).join('');
    };

    renderArchiveList("sent-postcards-grid", state.sentPostcards, false);
    renderArchiveList("received-postcards-grid", state.receivedPostcards, true);

    const sentCountEl = document.getElementById("sent-count");
    if (sentCountEl) sentCountEl.textContent = state.sentPostcards ? state.sentPostcards.length : 0;

    const receivedCountEl = document.getElementById("received-count");
    if (receivedCountEl) receivedCountEl.textContent = state.receivedPostcards ? state.receivedPostcards.length : 0;

    const trackingCountEl = document.getElementById("tracking-count");
    if (trackingCountEl) {
        const now = new Date().getTime();
        const activeDeliveries = state.tracking.filter(item => {
            return item.arrivalAt && (item.arrivalAt - now > 0);
        });
        
        trackingCountEl.textContent = activeDeliveries.length;
        if (activeDeliveries.length > 0) {
            trackingCountEl.style.background = '#e67e22'; 
        } else {
            trackingCountEl.style.background = '#ccc'; 
        }
    }

    if (typeof renderMapSections === 'function') {
        renderMapSections();
    }
}
  
function renderMapSections() {
    // === ЖЕЛЕЗОБЕТОННЫЙ ФИЛЬТР ОФФЛАЙН-ОТКРЫТОК ДЛЯ КАРТЫ ===
    const validSentPostcards = state.sentPostcards.filter(card => {
        // 1. Если стоит явная метка оффлайна
        if (card.isOffline === true) return false;
        
        // 2. Ищем слова-маркеры в адресате
        const dest = (card.to || "").toLowerCase();
        if (dest.includes("personal") || dest.includes("collection") || dest.includes("offline") || dest === "") {
            return false;
        }
        return true;
    });

    // 1. Собираем уникальные флаги, используя ОТФИЛЬТРОВАННЫЙ массив для отправленных!
    const sentFlags = [...new Set(validSentPostcards.map(card => card.countryFlag || card.flag))];
    const receivedFlags = [...new Set(state.receivedPostcards.map(card => card.countryFlag || card.flag))];

    const mapTemplate = (containerId, collectedFlags) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = Object.entries(COUNTRIES_BY_CONTINENT).map(([continent, flags]) => {
            const collectedInContinent = flags.filter(f => collectedFlags.includes(f)).length;
            const isCompleted = collectedInContinent === flags.length;
            const color = collectedInContinent > 0 ? (isCompleted ? '#27ae60' : '#e67e22') : '#888';
            
            return `
                <div class="continent-wrapper" style="margin-bottom: 8px; border: 1px solid var(--border); border-radius: 8px; overflow: hidden; background: var(--bg-element);">
                    <div class="continent-header" onclick="const body = this.nextElementSibling; const isHidden = body.style.display === 'none'; body.style.display = isHidden ? 'block' : 'none'; this.querySelector('.cont-arrow').textContent = isHidden ? '⬆️' : '⬇️';" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 15px; cursor: pointer; transition: background 0.2s;">
                        <span style="font-weight: bold; color: var(--text-main); font-size: 14px;">${continent}</span>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 13px; color: ${color}; font-weight: bold;">
                                ${collectedInContinent} / ${flags.length}
                            </span>
                            <span class="cont-arrow" style="font-size: 12px; color: var(--text-sub);">⬇️</span>
                        </div>
                    </div>
                    
                    <div class="continent-body" style="display: none; padding: 15px; border-top: 1px dashed var(--border); background: var(--bg-card);">
                        <div class="flag-grid" style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${flags.map(f => {
                                const isCollected = collectedFlags.includes(f);
                                const flagClass = isCollected ? 'flag-circle flag-collected' : 'flag-circle flag-locked';
                                const opacity = isCollected ? '1' : '0.2';
                                const filter = isCollected ? 'none' : 'grayscale(100%)';
                                return `<div class="${flagClass}" title="${f}" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: default; font-size: 20px; background: rgba(0,0,0,0.05); opacity: ${opacity}; filter: ${filter}; transition: all 0.3s ease;">${f}</div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>`;
        }).join("");
    };
    
    // Рисуем обе карты
    mapTemplate("sent-by-continent", sentFlags);
    mapTemplate("received-by-continent", receivedFlags);
}
  
// ==========================================================================
// 3. ЛОГИКА РЕДАКТИРОВАНИЯ И ВАЛИДАЦИЯ ONBOARDING'A
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
            
            // НОВОЕ: Прогоняем фото через компрессор, ужимая до 300px ширины
            compressImage(file, 300, (compressedBase64) => {
                tempAvatar = compressedBase64;
                tempAvatarPosX = 50; 
                tempAvatarPosY = 50;
                updateProfileUI(); 
            });
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
        editBtn.setAttribute('data-mode', 'save');
        editBtn.textContent = "Save Changes"; 
        
        tempSelectedCountry = state.profile.country;
        tempSelectedInterests = [...state.profile.interests];
        tempAvatar = state.profile.avatar;
        
        tempAvatarPosX = state.profile.avatarPosX || 50; 
        tempAvatarPosY = state.profile.avatarPosY || 50; 
  
        document.getElementById("input-name").value = state.profile.name;
        document.getElementById("input-country").value = state.profile.country;
        document.getElementById("input-bio").value = state.profile.bio.includes("Detailed statistics") ? "" : state.profile.bio;
        
        // Подсказка, если пустая страна
        if (!state.profile.country) {
             document.getElementById("input-country").placeholder = "🌍";
        }

        ids.forEach(id => document.getElementById(id).style.display = "none");
        editIds.forEach(id => document.getElementById(id).style.display = "flex"); 
        renderEditTags();
    } else {
        // === ЖЕСТКАЯ ПРОВЕРКА ДАННЫХ ПРИ СОХРАНЕНИИ ===
        const newName = document.getElementById("input-name").value.trim();
        const newCountry = tempSelectedCountry || document.getElementById("input-country").value;
        
        if (newName === "" || newName === "@" || newCountry === "") {
            showCustomAlert("⚠️", "Hold on!", "Please enter your <b>Nickname</b> and select your <b>Country</b> to continue!", "#d35400");
            return; // Запрещаем сохранять пустым
        }

        // Автоматически добавляем @ к нику, если юзер забыл
        state.profile.name = newName.startsWith('@') ? newName : '@' + newName;
        state.profile.country = newCountry;
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
        
        // Поздравляем новичка!
        if (!localStorage.getItem('onboarding_done')) {
            localStorage.setItem('onboarding_done', 'true');
            
            // Вызываем алерт и передаем ему команду: "Когда нажмут ОК — сверни профиль"
            showCustomAlert("🎉", "Setup Complete!", "You are ready to explore the world!", "#27ae60", () => {
                const profileBlock = document.getElementById('profile-block');
                if (profileBlock) {
                    profileBlock.classList.remove('expanded');
                    const t = profileBlock.querySelector('.expand-trigger');
                    if (t) t.textContent = "⬇️";
                }
            });
        }
    }
}
  
function cancelEditMode() {
    // ЗАПРЕЩАЕМ ОТМЕНУ, ЕСЛИ ПРОФИЛЬ ПУСТ (ONBOARDING)
    if (!state.profile.name || state.profile.name === "") {
        showCustomAlert("⚠️", "Wait!", "You must set up your Nickname and Country first!", "#d35400");
        return;
    }

    const editBtn = document.getElementById("edit-profile-btn");
    if (!editBtn || editBtn.getAttribute('data-mode') !== 'save') return;
  
    editBtn.setAttribute('data-mode', 'edit');
    editBtn.textContent = "Edit Profile"; 
    
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
  
// ==========================================================================
// ГЛАВНЫЙ БЛОК ИНИЦИАЛИЗАЦИИ
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    const screens = document.querySelectorAll(".screen");
    
    navItems.forEach(btn => {
        btn.onclick = () => {
            // === БЛОКИРУЕМ ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК ДО ЗАПОЛНЕНИЯ ПРОФИЛЯ ===
            if ((!state.profile.name || state.profile.name === "") && btn.dataset.target !== "home") {
                showCustomAlert("🔒", "Locked", "Please set up your profile first to access this section.", "#7f8c8d");
                return;
            }

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

    const saveToggle = document.getElementById('save-toggle');
    const btnClearData = document.getElementById('btn-clear-data');

    if (saveToggle) {
        saveToggle.checked = localStorage.getItem('pj_save_enabled') === 'true';
        
        saveToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                saveState(); 
                console.log("Auto-Save Enabled! 💾");
            } else {
                localStorage.removeItem('pj_state');
                localStorage.setItem('pj_save_enabled', 'false');
                console.log("Auto-Save Disabled.");
            }
        });
    }

    // === КАСТОМНОЕ ОКНО ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ ===
    if (btnClearData) {
        btnClearData.addEventListener('click', () => {
            const phoneFrame = document.querySelector('.phone-frame') || document.body;
            const overlay = document.createElement('div');
            overlay.className = 'custom-alert-overlay';
            overlay.style.zIndex = '9999';
            
            overlay.innerHTML = `
                <div class="custom-alert-box">
                    <div style="font-size: 50px; margin-bottom: -15px;">🚨</div>
                    <div style="font-size: 20px; font-weight: 900; color: #e74c3c; margin-bottom: 5px;">WARNING!</div>
                    <div class="custom-alert-text" style="font-size: 14px;">
                        Are you sure you want to delete ALL data?<br>
                        This will reset your coins, postcards, and history <b>forever</b>.
                    </div>
                    <div style="display: flex; gap: 10px; width: 100%; margin-top: 15px;">
                        <button class="secondary-button custom-cancel-btn" style="flex: 1; padding: 10px 0;">Cancel</button>
                        <button class="primary-button custom-confirm-btn" style="flex: 1; padding: 10px 0; background: #e74c3c; border-color: #c0392b; color: white;">Delete</button>
                    </div>
                </div>
            `;
            
            // Если передумал - просто закрываем окно
            overlay.querySelector('.custom-cancel-btn').onclick = () => {
                overlay.remove();
            };
            
            // Если подтвердил - стираем память и перезагружаем
            overlay.querySelector('.custom-confirm-btn').onclick = () => {
                localStorage.clear();
                location.reload();
            };
            
            phoneFrame.appendChild(overlay);
        });
    }
    
    // Инициализация отображения
    updateProfileUI();
    refreshAllLists();
    renderMapSections();
  
    const syncAssets = () => {
        const balanceElement = document.querySelector('.home-assets .asset-card:first-child .asset-value');
        if (balanceElement) balanceElement.textContent = state.postcards;
        
        const energyElement = document.getElementById('energy-display') || document.querySelector('.home-assets .asset-card:nth-child(2) .asset-value');
        if (energyElement) energyElement.textContent = state.energy;
    };
    syncAssets();

    // === ПРОВЕРКА НА НОВОГО ПОЛЬЗОВАТЕЛЯ (ONBOARDING) ===
    function checkOnboarding() {
        if (!state.profile.name || state.profile.name === "") {
            const phoneFrame = document.querySelector('.phone-frame') || document.body;
            const overlay = document.createElement('div');
            overlay.className = 'custom-alert-overlay';
            overlay.style.zIndex = '9999'; // Поверх всего
            
            overlay.innerHTML = `
                <div class="custom-alert-box">
                    <div style="font-size: 50px; margin-bottom: -10px;">👋</div>
                    <div style="font-size: 20px; font-weight: 900; color: #2980b9; margin-bottom: 5px;">Welcome!</div>
                    <div class="custom-alert-text" style="margin-bottom: 15px;">
                        Before you start your PostJourney, let's set up your profile so others know who you are!
                    </div>
                    <button class="primary-button custom-alert-btn" style="width: 100%;">Set Up Profile</button>
                </div>
            `;
            
            overlay.querySelector('.custom-alert-btn').onclick = () => {
                overlay.remove();
                
                // Раскрываем блок профиля
                const profileBlock = document.getElementById('profile-block');
                if (!profileBlock.classList.contains('expanded')) {
                    profileBlock.classList.add('expanded');
                    const t = profileBlock.querySelector('.expand-trigger');
                    if (t) t.textContent = "⬆️";
                }
                
                // Включаем режим редактирования
                toggleEditMode(true);
                
                // Фокус на вводе имени
                const nameInput = document.getElementById('input-name');
                if(nameInput) nameInput.focus();
            };
            
            phoneFrame.appendChild(overlay);
        }
    }
    
    // Запускаем окно знакомства
    checkOnboarding();

    // === СИСТЕМА ЕЖЕДНЕВНЫХ НАГРАД (00:00) ===
    function checkDailyRefill() {
        const today = new Date().toDateString(); 
        const lastRefill = localStorage.getItem('lastRefillDate');

        if (!lastRefill) {
            localStorage.setItem('lastRefillDate', today);
            return;
        }

        if (lastRefill !== today) {
            state.postcards += 1;
            state.energy += 150;
            localStorage.setItem('lastRefillDate', today);
            syncAssets();

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

    checkDailyRefill(); 
    setInterval(checkDailyRefill, 60000);

    // === ВНУТРИИГРОВОЙ МАГАЗИН (TRAVEL SHOP) ===
    const refillBtn = document.querySelector('.home-assets .primary-button');
    if (refillBtn) {
        refillBtn.onclick = (e) => {
            e.stopPropagation(); 
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

    window.buyStoreItem = function(type, amount, price) {
        const overlay = document.querySelector('.store-overlay');
        if (overlay) overlay.remove();

        if (type === 'postcards') {
            state.postcards += amount;
        } else if (type === 'energy') {
            state.energy += amount;
        }

        if (typeof syncAssets === 'function') {
            syncAssets();
        }

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
          
          if(e.type === 'mousedown') e.preventDefault(); 
      }

      function moveDrag(e) {
          if (!isDraggingAvatar) return;
          if(e.cancelable) e.preventDefault(); 
          
          const coords = getEventCoords(e);
          const deltaX = coords.x - startX;
          const deltaY = coords.y - startY;

          tempAvatarPosX -= deltaX * 0.8; 
          tempAvatarPosY -= deltaY * 0.8;

          tempAvatarPosX = Math.max(0, Math.min(100, tempAvatarPosX));
          tempAvatarPosY = Math.max(0, Math.min(100, tempAvatarPosY));

          avatarEl.style.backgroundPosition = `${tempAvatarPosX}% ${tempAvatarPosY}%`;

          startX = coords.x;
          startY = coords.y;
      }

      function endDrag() {
          isDraggingAvatar = false;
      }

      avatarEl.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', moveDrag, { passive: false });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('mouseleave', endDrag);

      avatarEl.addEventListener('touchstart', startDrag, { passive: true });
      document.addEventListener('touchmove', moveDrag, { passive: false });
      document.addEventListener('touchend', endDrag);
      document.addEventListener('touchcancel', endDrag);
  }
});