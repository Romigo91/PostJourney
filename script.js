// ==========================================================================
// 1. КОНСТАНТЫ И СОСТОЯНИЕ
// ==========================================================================
const AVAILABLE_INTERESTS = [
    "Travel", "Postcards", "Nature", "Art", "Books", "Music", "Cooking", 
    "Photography", "Sport", "Tech", "History", "Movies", "Architecture", 
    "Animals", "Coffee", "Gardening", "Languages", "Space", "Fashion", 
    "Gaming", "Hiking", "Writing", "Painting", "Drawing", "Vintage", 
    "Cultures", "Sea", "Mountains", "Handmade", "Dances"
].sort();
  
const state = {
    profile: {
        name: "",           // ПУСТО СТАРТ!
        country: "",        // ПУСТО СТАРТ!
        bio: "",            // ПУСТО СТАРТ!
        avatar: null,
        avatarPosX: 50, 
        avatarPosY: 50, 
        interests: [],       // ПУСТО СТАРТ!
        userId: ""
    },
    postcards: 5,
    energy: 500,
    tracking: [],
    leaderboard: [],
    sentPostcards: [],       
    receivedPostcards: [],   
    bots: [],
    chats: {},
};
window.state = state;

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

            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

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

loadState();

// === ГЕНЕРИРУЕМ УНИКАЛЬНЫЙ ID ДЛЯ ИГРОКА (ЕСЛИ ЕГО ЕЩЕ НЕТ) ===
if (!state.profile.userId) {
    state.profile.userId = 'PJ-' + Math.floor(1000 + Math.random() * 9000);
    if (typeof saveState === 'function') saveState();
}
  
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
    
    const btn = overlay.querySelector('.custom-alert-btn');
    btn.onclick = () => {
        overlay.remove(); 
        if (onConfirm) onConfirm(); 
    };
    
    phoneFrame.appendChild(overlay);
}

// === ВСПЛЫВАЮЩАЯ ПЛАШКА СВЕРХУ (TOAST NOTIFICATION) ===
function showToastNotification(message) {
    const phoneFrame = document.querySelector('.phone-frame') || document.body;
    
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    
    toast.style.position = 'absolute';
    toast.style.top = '10px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = '#f39c12'; 
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '20px';
    toast.style.fontSize = '12px';
    toast.style.fontWeight = 'bold';
    toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    toast.style.zIndex = '99999';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease, top 0.3s ease';
    toast.style.pointerEvents = 'none'; 
    toast.style.textAlign = 'center';
    toast.style.width = 'max-content';
    toast.style.maxWidth = '90%';
    
    toast.innerHTML = message;
    
    phoneFrame.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.top = '30px';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.top = '10px';
        setTimeout(() => toast.remove(), 300); 
    }, 3000);
}
  
function updateProfileUI() {
    if (!state.profile.name || state.profile.name === "") {
        localStorage.removeItem('onboarding_done');
    }
    const { name, country, bio, avatar, interests } = state.profile; 
    const editBtn = document.getElementById("edit-profile-btn");
    const isEditingNow = editBtn && editBtn.getAttribute('data-mode') === 'save';
  
    document.getElementById("display-name").textContent = name || "New Traveler";
    document.getElementById("display-country").textContent = country || "🏳️";
    
    const bioElement = document.getElementById("display-bio");
    const isDefaultBio = !bio || bio.includes("Detailed statistics");
    bioElement.textContent = isDefaultBio ? "Detailed statistics and recent achievements will be shown here." : bio;
  
    const tagsContainer = document.getElementById("display-tags-minimal");
    if (tagsContainer) {
        // Добавлена защита (interests || [])
        tagsContainer.innerHTML = (interests || [])
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
        const firstLetter = name ? name.replace('@', '')[0] : '?';
        avatarEl.textContent = (firstLetter || '?').toUpperCase();
    }
    
    const isProfileSetup = state.profile.name && state.profile.name !== "";
    
    const assetsBlock = document.getElementById('assets-block');
    const trackingBlock = document.getElementById('tracking-block');
    const archiveBlock = document.getElementById('archive-block');

    if (assetsBlock) {
        assetsBlock.style.display = isProfileSetup ? 'block' : 'none';
    }
    if (trackingBlock) {
        trackingBlock.style.display = isProfileSetup ? 'block' : 'none';
    }
    if (archiveBlock) {
        archiveBlock.style.display = isProfileSetup ? 'block' : 'none';
    }
}
  
function refreshAllLists() {
    if (typeof saveState === 'function') saveState();

    if (state.tracking && state.tracking.length > 0) {
        state.tracking.sort((a, b) => a.arrivalAt - b.arrivalAt);
    }
    const emptyText = document.getElementById("tracking-empty-text");
    if (emptyText) {
        emptyText.style.display = (state.tracking && state.tracking.length > 0) ? "none" : "block";
    }

    // === MICRO-UI ТРЕКИНГ ===
    renderListComponent("tracking-list", state.tracking, item => {
        const isIncoming = item.type === "incoming";
        let countryName = isIncoming ? "Mystery Card" : (item.toCountry || "Unknown");
        let flag = isIncoming ? "🌍" : (item.flag || item.countryFlag || "");
        
        if (!isIncoming && item.to && !item.toCountry) {
            const parts = item.to.split(", ");
            countryName = parts[0];
        }

        let displayStatus = isIncoming ? "Incoming" : "In transit";
        let timeHtml = "";
        let progressPercent = 0;
        let progressClass = "";

        if (item.arrivalAt && item.sentAt) {
            const now = new Date().getTime();
            const totalDuration = item.arrivalAt - item.sentAt;
            const elapsed = now - item.sentAt;
            
            if (elapsed > 0 && elapsed < totalDuration) {
                progressPercent = (elapsed / totalDuration) * 100;
            } else if (elapsed >= totalDuration) {
                progressPercent = 100;
            }

            const diffMs = item.arrivalAt - now;

            if (diffMs > 0) {
                const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
                const minsLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                timeHtml = `${hoursLeft}h ${minsLeft}m`;
            } else {
                displayStatus = "Delivered";
                item.status = "Delivered";
                timeHtml = "Done";
                progressClass = "delivered";
                progressPercent = 100;
            }
        } else {
             // Фолбэк, если нет дат
             timeHtml = "?";
             progressPercent = 50;
        }
        
        const mapBadge = document.getElementById("map-badge");
        if (mapBadge) {
            const incomingCount = state.tracking.filter(item => item.type === "incoming").length;
            if (incomingCount > 0) {
                mapBadge.textContent = incomingCount;
                mapBadge.style.display = "flex";
            } else {
                mapBadge.style.display = "none";
            }
        }

        return `
            <div class="minimal-tracking-item">
                <div class="minimal-tracking-header">
                    <span class="minimal-tracking-title">${flag} ${countryName}</span>
                    <span class="minimal-tracking-time">${timeHtml}</span>
                </div>
                <div class="minimal-progress-bg">
                    <div class="minimal-progress-fill ${progressClass}" style="width: ${progressPercent}%;"></div>
                </div>
            </div>`;
    });

    const validSentPostcards = state.sentPostcards.filter(card => {
        if (card.isOffline === true) return false;
        const dest = (card.to || "").toLowerCase();
        if (dest.includes("personal") || dest.includes("collection") || dest.includes("offline") || dest === "") {
            return false;
        }
        return true; 
    });

    const uniqueCountriesCount = new Set(validSentPostcards.map(card => card.countryFlag || card.flag)).size;
        
    const userLeaderboardEntry = { 
        name: `${state.profile.name || "New Traveler"}`, 
        sent: validSentPostcards.length, 
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

    // === MICRO-UI КОЛЛЕКЦИЯ ===
    const cardTemplate = (card, index, isReceived) => {
        const flag = card.countryFlag || card.flag || '🌍';
        const bgImg = card.frontImage ? `background-image: url(${card.frontImage});` : `background: #eee;`;
        
        return `
        <div class="compact-postcard-thumb archive-card" data-index="${index}" style="${bgImg}">
            <div class="compact-flag-badge">${flag}</div>
        </div>`;
    };
        
    const renderArchiveList = (containerId, dataArray, isReceived = false) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.className = 'compact-collection-grid';
        container.style.display = dataArray.length > 0 ? 'grid' : 'none';

        // Выводим ВСЕ карточки, без ограничений! Разворачиваем массив, чтобы новые были сверху.
        container.innerHTML = [...dataArray].reverse().map((item, i) => {
            // Поскольку мы развернули массив, нам нужно сохранить оригинальный индекс для 3D открытия
            const originalIndex = dataArray.length - 1 - i; 
            const flag = item.countryFlag || item.flag || '🌍';
            const bgImg = item.frontImage ? `background-image: url(${item.frontImage});` : `background: #eee;`;
            
            return `
            <div class="compact-postcard-thumb archive-card" data-index="${originalIndex}" style="${bgImg}">
                <div class="compact-flag-badge">${flag}</div>
            </div>`;
        }).join('');
    };

    renderArchiveList("sent-postcards-grid", state.sentPostcards, false);
    renderArchiveList("received-postcards-grid", state.receivedPostcards, true);

// === ФУНКЦИИ ДЛЯ МОДАЛЬНОЙ ГАЛЕРЕИ (УМНАЯ ФИЛЬТРАЦИЯ) ===
window.openGalleryModal = function(isReceived, filterFlag = null) {
    const modal = document.getElementById('modal-gallery');
    const grid = document.getElementById('gallery-modal-grid');
    const title = document.getElementById('gallery-modal-title');
    
    if (!modal || !grid || !title) return;

    const fullArray = isReceived ? state.receivedPostcards : state.sentPostcards;
    const mappedArray = fullArray.map((card, index) => ({ card, originalIndex: index }));

    const filteredArray = filterFlag
        ? mappedArray.filter(item => (item.card.countryFlag || item.card.flag) === filterFlag)
        : mappedArray;

    title.innerHTML = filterFlag 
        ? `${filterFlag} ${isReceived ? "Received" : "Sent"} Archive` 
        : (isReceived ? "Received 📥" : "Sent 📤");

    // 1. ЖЕЛЕЗОБЕТОННАЯ СЕТКА (отвязываем от CSS полностью)
    grid.className = ''; 
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)'; // Строго 3 колонки
    grid.style.gap = '8px';
    grid.style.alignContent = 'start'; // Чтобы одиночная открытка не растягивалась по высоте

    // 2. Рендерим карточки с ЖЕСТКИМИ стилями (пропорция 3:2)
    grid.innerHTML = filteredArray.map(item => {
        const flag = item.card.countryFlag || item.card.flag || '🌍';
        const bgImg = item.card.frontImage ? `background-image: url(${item.card.frontImage});` : `background: #eee;`;
        
        // Обрати внимание: aspect-ratio: 3/2 прописан прямо сюда!
        return `
        <div class="archive-card" data-index="${item.originalIndex}" data-is-sent="${!isReceived}" 
             style="${bgImg} background-size: cover; background-position: center; border-radius: 6px; aspect-ratio: 3/2; box-shadow: 0 2px 5px rgba(0,0,0,0.15); border: 1px solid var(--border); position: relative; cursor: pointer;">
            <div style="position: absolute; bottom: 3px; right: 3px; font-size: 11px; background: rgba(255,255,255,0.9); border-radius: 50%; padding: 2px; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${flag}</div>
        </div>`;
    }).reverse().join(''); 

    modal.style.setProperty('z-index', '9999999', 'important'); 
    modal.style.display = 'flex';
};

window.closeGalleryModal = function() {
    const modal = document.getElementById('modal-gallery');
    if (modal) modal.style.display = 'none';
};

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
  
let currentCollectionTab = 'sent'; // По умолчанию показываем отправленные

// === ЗАПУСК ИГРЫ FLAG COLLECTION ===
window.startFlagCollection = function() {
    document.getElementById('games-menu-list').style.display = 'none';
    document.getElementById('active-game-zone').style.display = 'block';

    const container = document.getElementById('game-content');
    
    // Вставляем структуру коллекции в игровую зону
    container.innerHTML = `
        <button onclick="backToGames()" class="back-link" style="background:none; border:none; color:#d35400; cursor:pointer; margin-bottom:15px; display:flex; align-items:center; gap:5px; font-weight:bold; font-size:14px; font-family:'Montserrat', sans-serif;">
            <span style="font-size: 18px;">🏷️</span> Back to Menu
        </button>
        
        <div style="text-align: left;">
            <div class="world-progress-container" style="margin-top: 5px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px; font-weight: 800; color: var(--text-main);">
                    <span>🌍 World Explorer</span>
                    <span id="world-progress-text">0 / 195</span>
                </div>
                <div class="minimal-progress-bg" style="height: 8px; border-radius: 4px;">
                    <div id="world-progress-fill" class="minimal-progress-fill" style="width: 0%; background: linear-gradient(90deg, #27ae60, #2ecc71);"></div>
                </div>
            </div>

            <div class="collection-tabs">
                <button class="col-tab active" data-tab="sent">Sent 📤</button>
                <button class="col-tab" data-tab="received">Received 📥</button>
            </div>

            <div id="continents-grid" class="continents-grid"></div>
        </div>
    `;
    
    // Запускаем функцию рендера, чтобы она заполнила этот новый HTML данными
    if (typeof renderMapSections === 'function') {
        renderMapSections();
    }
};

function renderMapSections() {
    // 1. Собираем уникальные флаги
    const validSentPostcards = state.sentPostcards.filter(card => {
        if (card.isOffline === true) return false;
        const dest = (card.to || "").toLowerCase();
        return !(dest.includes("personal") || dest.includes("collection") || dest.includes("offline") || dest === "");
    });

    const sentFlags = [...new Set(validSentPostcards.map(c => c.countryFlag || c.flag))];
    const receivedFlags = [...new Set(state.receivedPostcards.map(c => c.countryFlag || c.flag))];

    // 2. Логика переключения вкладок
    const tabs = document.querySelectorAll('.col-tab');
    tabs.forEach(tab => {
        tab.onclick = (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            currentCollectionTab = e.target.getAttribute('data-tab');
            renderContinentsGrid(); // Перерисовываем сетку при клике
        };
    });

    // 3. Функция рендера карточек (и обновления прогресс-бара World Explorer)
    function renderContinentsGrid() {
        const grid = document.getElementById('continents-grid');
        if (!grid) return;
        
        const activeFlags = currentCollectionTab === 'sent' ? sentFlags : receivedFlags;

        // === ДИНАМИЧЕСКИ ОБНОВЛЯЕМ ПРОГРЕСС-БАР WORLD EXPLORER ===
        const totalWorldFlags = 195;
        const currentWorldFlags = new Set(activeFlags).size;
        const worldPercent = (currentWorldFlags / totalWorldFlags) * 100;
        
        const worldText = document.getElementById('world-progress-text');
        const worldFill = document.getElementById('world-progress-fill');
        if (worldText) worldText.textContent = `${currentWorldFlags} / ${totalWorldFlags}`;
        if (worldFill) worldFill.style.width = `${worldPercent}%`;
        // ==========================================================

        grid.innerHTML = Object.entries(COUNTRIES_BY_CONTINENT).map(([continent, flags]) => {
            const collectedInContinent = flags.filter(f => activeFlags.includes(f)).length;
            const isCompleted = collectedInContinent === flags.length;
            const percent = (collectedInContinent / flags.length) * 100;
            
            // Раскрашиваем текст и шкалу
            const color = collectedInContinent > 0 ? (isCompleted ? '#27ae60' : '#e67e22') : '#a57a4d';
            const fillClass = isCompleted ? 'delivered' : '';

            return `
                <div class="continent-card" onclick="openFlagsModal('${continent}', '${currentCollectionTab}')">
                    <div class="cont-card-header">
                        <span>${continent}</span>
                        <span class="cont-card-stats" style="color: ${color};">${collectedInContinent} / ${flags.length}</span>
                    </div>
                    <div class="minimal-progress-bg">
                        <div class="minimal-progress-fill ${fillClass}" style="width: ${percent}%; ${isCompleted ? '' : 'background: ' + color + ';'}"></div>
                    </div>
                </div>`;
        }).join("");
    }

    // Рендерим сетку сразу при загрузке
    renderContinentsGrid();
}

// === ФУНКЦИИ МОДАЛЬНОГО ОКНА ФЛАГОВ ===
window.openFlagsModal = function(continent, tab) {
    const modal = document.getElementById('modal-flags');
    const grid = document.getElementById('modal-flags-grid');
    const title = document.getElementById('modal-flags-title');
    if (!modal || !grid || !title) return;

    // Снова собираем актуальные списки при открытии
    const validSentPostcards = state.sentPostcards.filter(c => c.isOffline !== true && c.to && !c.to.toLowerCase().includes("personal"));
    const sentFlags = [...new Set(validSentPostcards.map(c => c.countryFlag || c.flag))];
    const receivedFlags = [...new Set(state.receivedPostcards.map(c => c.countryFlag || c.flag))];
    
    const activeFlags = tab === 'sent' ? sentFlags : receivedFlags;
    const continentFlags = COUNTRIES_BY_CONTINENT[continent];

    // Ставим красивый заголовок
    title.innerHTML = `${continent} ${tab === 'sent' ? '📤' : '📥'}`;

    // ИСПРАВЛЕНИЕ: Строгая сетка Grid ровно на 5 колонок
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(5, 1fr)'; // 5 одинаковых колонок
    grid.style.gap = '12px 6px'; // Отступ: 12px по вертикали, 6px по горизонтали
    grid.style.padding = '5px 0'; // Убрали лишние боковые отступы
    grid.style.justifyItems = 'center'; // Выравниваем кружки строго по центру своих колонок

    // Рендерим кружочки флагов
    grid.innerHTML = continentFlags.map(f => {
        const isCollected = activeFlags.includes(f);
        const flagClass = isCollected ? 'flag-circle flag-collected' : 'flag-circle flag-locked';
        const opacity = isCollected ? '1' : '0.2';
        const filter = isCollected ? 'none' : 'grayscale(100%)';
        
        const isReceived = tab === 'received';
        const clickAction = isCollected ? `onclick="openGalleryModal(${isReceived}, '${f}')"` : '';

        // НОВЫЕ РАЗМЕРЫ: ширина/высота 38px, размер шрифта 20px (идеально для 5 в ряд)
        return `<div class="${flagClass}" ${clickAction} title="${f}" style="width: 38px; height: 38px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-radius: 50%; cursor: ${isCollected ? 'pointer' : 'default'}; font-size: 20px; line-height: normal; padding-top: 2px; background: rgba(0,0,0,0.05); opacity: ${opacity}; filter: ${filter}; transition: all 0.3s ease;">${f}</div>`;
    }).join('');

    modal.style.display = 'flex';
};

window.closeFlagsModal = function() {
    const modal = document.getElementById('modal-flags');
    if (modal) modal.style.display = 'none';
};
  
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
            
            compressImage(file, 300, (compressedBase64) => {
                tempAvatar = compressedBase64;
                tempAvatarPosX = 50; 
                tempAvatarPosY = 50;
                
                // СНИМАЕМ ОБВОДКУ АВАТАРА
                const avNode = document.getElementById('profile-avatar');
                if(avNode) avNode.classList.remove('needs-fill');

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
                if(inputCountry) {
                    inputCountry.value = tempSelectedCountry;
                    // СНИМАЕМ ОБВОДКУ ФЛАГА
                    inputCountry.classList.remove('needs-fill'); 
                }
                if(flagPicker) flagPicker.style.display = "none";
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

    // === 🟢 СНЯТИЕ КРАСНОЙ ОБВОДКИ ПРИ ВВОДЕ ТЕКСТА ===
    const inputNameNode = document.getElementById("input-name");
    if (inputNameNode) {
        inputNameNode.addEventListener('input', (e) => {
            if (e.target.value.trim() !== "") e.target.classList.remove('needs-fill');
            else e.target.classList.add('needs-fill');
        });
    }

    const inputBioNode = document.getElementById("input-bio");
    if (inputBioNode) {
        inputBioNode.addEventListener('input', (e) => {
            if (e.target.value.trim() !== "") e.target.classList.remove('needs-fill');
            else e.target.classList.add('needs-fill');
        });
    }
}
  
function toggleEditMode(enable) {
    const editBtn = document.getElementById("edit-profile-btn");
    const ids = ["profile-display-name-row", "display-bio", "display-tags-minimal"];
    const editIds = ["profile-edit-name-row", "input-bio", "avatar-edit-hint", "edit-tags-wrapper"];
  
    if (enable) {
        if(editBtn) {
            editBtn.setAttribute('data-mode', 'save');
            editBtn.textContent = "Save Changes"; 
        }
        
        tempSelectedCountry = state.profile.country;
        tempSelectedInterests = [...(state.profile.interests || [])];
        tempAvatar = state.profile.avatar;
        
        tempAvatarPosX = state.profile.avatarPosX || 50; 
        tempAvatarPosY = state.profile.avatarPosY || 50; 
  
        const nameNode = document.getElementById("input-name");
        if(nameNode) nameNode.value = state.profile.name || "";

        const countryNode = document.getElementById("input-country");
        if(countryNode) countryNode.value = state.profile.country || "";

        const bioNode = document.getElementById("input-bio");
        if(bioNode) {
            bioNode.value = (!state.profile.bio || state.profile.bio.includes("Detailed statistics")) ? "" : state.profile.bio;
        }
        
        if (!state.profile.country && countryNode) {
             countryNode.placeholder = "🌍";
        }

        ids.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "none"; });
        editIds.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "flex"; }); 
        renderEditTags();
    } else {
        
        // === 🔴 ЖЕСТКАЯ ПРОВЕРКА ВСЕХ ПОЛЕЙ ПРИ СОХРАНЕНИИ ===
        const nameNode = document.getElementById("input-name");
        const countryNode = document.getElementById("input-country");
        const bioNode = document.getElementById("input-bio");

        const newName = nameNode ? nameNode.value.trim() : "";
        const newCountry = tempSelectedCountry || (countryNode ? countryNode.value : "");
        const newBio = bioNode ? bioNode.value.trim() : "";
        
        const isNameEmpty = newName === "" || newName === "@";
        const isCountryEmpty = newCountry === "";
        const isBioEmpty = newBio === "" || newBio.includes("Detailed statistics");
        const isAvatarEmpty = !tempAvatar;
        const isInterestsInvalid = tempSelectedInterests.length !== 3;

        if (isNameEmpty || isCountryEmpty || isBioEmpty || isAvatarEmpty || isInterestsInvalid) {
            
            if (isNameEmpty && nameNode) nameNode.classList.add('needs-fill');
            if (isCountryEmpty && countryNode) countryNode.classList.add('needs-fill');
            if (isBioEmpty && bioNode) bioNode.classList.add('needs-fill');
            
            const avNode = document.getElementById('profile-avatar');
            if (isAvatarEmpty && avNode) avNode.classList.add('needs-fill');
            
            const hintText = document.getElementById('tags-hint-text');
            if (isInterestsInvalid && hintText) {
                hintText.style.color = '#e74c3c';
                setTimeout(() => hintText.style.color = '#8b6b4b', 2000);
            }

            showToastNotification("⚠️ Fill all fields!");
            return; 
        }

        // Автоматически добавляем @ к нику, если юзер забыл
        state.profile.name = newName.startsWith('@') ? newName : '@' + newName;
        state.profile.country = newCountry;
        state.profile.avatarPosX = tempAvatarPosX;
        state.profile.avatarPosY = tempAvatarPosY;
        
        state.profile.bio = newBio === "" ? "Detailed statistics and recent achievements..." : newBio;
        state.profile.interests = [...tempSelectedInterests];
        state.profile.avatar = tempAvatar;
  
        if(editBtn) {
            editBtn.setAttribute('data-mode', 'edit');
            editBtn.textContent = "Edit Profile"; 
        }
        
        ids.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "flex"; });
        editIds.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "none"; });
        
        const picker = document.getElementById("flag-picker-container");
        if(picker) picker.style.display = "none";
  
        updateProfileUI(); 
        
        // === ЛОГИКА СВОРАЧИВАНИЯ ПРОФИЛЯ ===
        const profileBlock = document.getElementById('profile-block');
        const collapseProfile = () => {
            if (profileBlock) {
                profileBlock.classList.remove('expanded');
                const t = profileBlock.querySelector('.expand-trigger');
                if (t) t.textContent = "⬇️";
            }
        };

        // Поздравляем новичка 
        if (!localStorage.getItem('onboarding_done')) {
            localStorage.setItem('onboarding_done', 'true');
            showCustomAlert("🎉", "Setup Complete!", "You are ready to explore the world!", "#27ae60", () => {
                collapseProfile();
            });
        } else {
            collapseProfile();
        }
    }
}
  
function cancelEditMode() {
    // ЗАПРЕЩАЕМ ОТМЕНУ, ЕСЛИ ПРОФИЛЬ ПУСТ
    if (!state.profile.name || state.profile.name === "") {
        showToastNotification("⚠️ Wait! Set up your profile first!");
        return;
    }

    const editBtn = document.getElementById("edit-profile-btn");
    if (!editBtn || editBtn.getAttribute('data-mode') !== 'save') return;
  
    editBtn.setAttribute('data-mode', 'edit');
    editBtn.textContent = "Edit Profile"; 
    
    const ids = ["profile-display-name-row", "display-bio", "display-tags-minimal"];
    const editIds = ["profile-edit-name-row", "input-bio", "avatar-edit-hint", "edit-tags-wrapper"];
  
    ids.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "flex"; });
    editIds.forEach(id => { const el = document.getElementById(id); if(el) el.style.display = "none"; });
    
    const picker = document.getElementById("flag-picker-container");
    if(picker) picker.style.display = "none";
  
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
            } else if (tempSelectedInterests.length < 3) { 
                tempSelectedInterests.push(tag);
            }
            renderEditTags();
            
            // ПРОВЕРКА И КРАШЕНИЕ ПОДСКАЗКИ
            const hintText = document.getElementById('tags-hint-text');
            if (hintText) {
                if (tempSelectedInterests.length === 3) {
                    hintText.style.color = '#8b6b4b'; 
                } else {
                    hintText.style.color = '#e74c3c'; 
                }
            }
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
            if ((!state.profile.name || state.profile.name === "") && btn.dataset.target !== "home") {
                showToastNotification("✍️ Set up your profile to send postcards!");
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
                
                // === МАГИЯ: АВТОМАТИЧЕСКАЯ ПОДТЯЖКА ЭКРАНА ===
                // Страница сама плавно приподнимет блок, чтобы он встал по центру над меню
                setTimeout(() => {
                    block.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
  
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
            
            overlay.querySelector('.custom-cancel-btn').onclick = () => {
                overlay.remove();
            };
            
            overlay.querySelector('.custom-confirm-btn').onclick = () => {
                localStorage.clear();
                location.reload();
            };
            
            phoneFrame.appendChild(overlay);
        });
    }
    
    updateProfileUI();
    refreshAllLists();
    renderMapSections();
  
    window.syncAssets = function() {
        // Находим элементы по ID
        const balanceElement = document.getElementById('postcard-display');
        const energyElement = document.getElementById('energy-display');
        
        // Если элементы есть на странице — обновляем их из глобального состояния state
        if (balanceElement) balanceElement.textContent = state.postcards;
        if (energyElement) energyElement.textContent = state.energy;
        
        // Также обновляем счетчики в Архиве (для красоты)
        const sentCountEl = document.getElementById("sent-count");
        if (sentCountEl) sentCountEl.textContent = state.sentPostcards.length;
    };

    // === ФУНКЦИИ ДЛЯ НОВЫХ ОКОН COLLECTION И TRACKING ===
window.openCollectionModal = function() {
    document.getElementById('modal-collection').style.display = 'flex';
};
window.closeCollectionModal = function() {
    document.getElementById('modal-collection').style.display = 'none';
};
window.openTrackingModal = function() {
    document.getElementById('modal-tracking').style.display = 'flex';
};
window.closeTrackingModal = function() {
    document.getElementById('modal-tracking').style.display = 'none';
};
    
    // Вызываем её один раз сразу, чтобы цифры подтянулись при загрузке
    window.syncAssets();

    function checkOnboarding() {
        if (!state.profile.name || state.profile.name === "") {
            const phoneFrame = document.querySelector('.phone-frame') || document.body;
            const overlay = document.createElement('div');
            overlay.className = 'custom-alert-overlay';
            overlay.style.zIndex = '9999'; 
            
            // === ДОБАВИЛИ КНОПКУ AUTO-FILL В HTML ===
            overlay.innerHTML = `
                <div class="custom-alert-box">
                    <div style="font-size: 50px; margin-bottom: -10px;">👋</div>
                    <div style="font-size: 20px; font-weight: 900; color: #2980b9; margin-bottom: 5px;">Welcome!</div>
                    <div class="custom-alert-text" style="margin-bottom: 15px;">
                        Before you start your PostJourney, let's set up your profile so others know who you are!
                    </div>
                    <button class="primary-button custom-alert-btn" style="width: 100%; margin-bottom: 8px;">Set Up Profile</button>
                    <button class="secondary-button dev-autofill-btn" style="width: 100%; padding: 8px; font-size: 12px; background: transparent; border: 1px dashed #ccc; color: #888;">🪄 Auto-fill (Dev)</button>
                </div>
            `;
            
            // 1. СТАНДАРТНАЯ ЛОГИКА (Если юзер сам хочет заполнить)
            overlay.querySelector('.custom-alert-btn').onclick = () => {
                overlay.remove();
                
                const profileBlock = document.getElementById('profile-block');
                if (profileBlock && !profileBlock.classList.contains('expanded')) {
                    profileBlock.classList.add('expanded');
                    const t = profileBlock.querySelector('.expand-trigger');
                    if (t) t.textContent = "⬆️";
                }
                
                toggleEditMode(true);
                
                // Включаем красную подсветку
                const av = document.getElementById('profile-avatar'); if(av) av.classList.add('needs-fill');
                const inName = document.getElementById('input-name'); if(inName) inName.classList.add('needs-fill');
                const inC = document.getElementById('input-country'); if(inC) inC.classList.add('needs-fill');
                const inBio = document.getElementById('input-bio'); if(inBio) inBio.classList.add('needs-fill');
                
                const hintText = document.getElementById('tags-hint-text');
                if (hintText) hintText.style.color = '#e74c3c'; 

                const nameInput = document.getElementById('input-name');
                if(nameInput) nameInput.focus();
            };

            // 2. === МАГИЯ: ЛОГИКА АВТОЗАПОЛНЕНИЯ (Для тебя) ===
            const devBtn = overlay.querySelector('.dev-autofill-btn');
            if (devBtn) {
                devBtn.onclick = () => {
                    // Закидываем фейковые данные
                    window.state.profile.name = "@DevTester";
                    window.state.profile.country = "🇵🇱"; 
                    window.state.profile.bio = "Just a developer testing the app! 💻";
                    window.state.profile.avatar = null; // Оставим null, чтобы была буква "D" на фоне
                    window.state.profile.interests = ["Tech", "Coffee", "Gaming"];
                    
                    overlay.remove(); // Закрываем окно
                    
                    // Помечаем, что онбординг пройден
                    localStorage.setItem('onboarding_done', 'true');
                    
                    // Обновляем визуал и сохраняем!
                    if (typeof window.updateProfileUI === 'function') window.updateProfileUI();
                    if (typeof window.saveState === 'function') window.saveState();
                    
                    showToastNotification("🪄 Magic! Profile Auto-filled.");
                };
            }
            
            phoneFrame.appendChild(overlay);
        }
    }
    
    checkOnboarding();

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

    const refillBtn = document.querySelector('#assets-block .primary-button');
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
  
  function updateDaysInApp() {
      let installDate = localStorage.getItem('install_date');
      
      if (!installDate) {
          installDate = new Date().getTime();
          localStorage.setItem('install_date', installDate);
      }
      
      const now = new Date().getTime();
      const diffTime = Math.abs(now - installDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      
      const badge = document.getElementById('days-in-app-badge');
      if (badge) {
          badge.textContent = `DAY ${diffDays}`;
      }
  }

  updateDaysInApp();
});

window.syncAssets = function() {
    const balanceElement = document.getElementById('postcard-display');
    const energyElement = document.getElementById('energy-display');
    
    if (balanceElement) balanceElement.textContent = state.postcards;
    if (energyElement) energyElement.textContent = state.energy;
    
    const sentCountEl = document.getElementById("sent-count");
    if (sentCountEl) sentCountEl.textContent = state.sentPostcards.length;
};
