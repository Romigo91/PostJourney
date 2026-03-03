// ==========================================================================
// СИСТЕМА ИСКУССТВЕННОГО ИНТЕЛЛЕКТА (БОТЫ)
// ==========================================================================

const BOT_SETTINGS = {
    ACTIVITY_INTERVAL: 15000, // Боты "думают" каждые 15 секунд
    CHANCE_TO_SEND: 0.15,     // 15% шанс отправки
    MAX_INCOMING: 3           // ВАЖНО: Максимальное количество открыток, которые могут лететь к тебе одновременно
};

// 1. ГЛАВНЫЙ ЦИКЛ ЖИЗНИ БОТОВ
function simulateBotActivity() {
    if (!state.bots || state.bots.length === 0) return;

    let uiNeedsUpdate = false;

    // Симуляция активности для Leaderboard
    state.bots.forEach(bot => {
        if (Math.random() < 0.10) {
            bot.sent += 1;
            uiNeedsUpdate = true;
        }
    });

    // Считаем, сколько открыток уже летит к тебе прямо сейчас
    const activeIncoming = state.tracking ? state.tracking.filter(item => item.type === "incoming").length : 0;

    // Отправка открытки ТЕБЕ (только если не превышен лимит)
    if (activeIncoming < BOT_SETTINGS.MAX_INCOMING && Math.random() < BOT_SETTINGS.CHANCE_TO_SEND) {
        const randomBot = state.bots[Math.floor(Math.random() * state.bots.length)];
        
        // === НОВАЯ ГЕОГРАФИЯ (12 - 72 часа) ===
        const distanceKm = Math.floor(Math.random() * (15000 - 500 + 1)) + 500;
        const minHours = 12;
        const maxHours = 72;
        const maxEarthDistance = 20000; 
        
        let baseDeliveryHours = minHours + (distanceKm / maxEarthDistance) * (maxHours - minHours);
        if (baseDeliveryHours > maxHours) baseDeliveryHours = maxHours;
        if (baseDeliveryHours < minHours) baseDeliveryHours = minHours;

        const deliveryHours = Math.floor(baseDeliveryHours);
        const randomMinutes = Math.floor(Math.random() * 60);

        const now = new Date().getTime();
        // Переводим часы и минуты в миллисекунды
        const arrivalTime = now + (deliveryHours * 60 * 60 * 1000) + (randomMinutes * 60 * 1000);

        state.tracking.unshift({
            type: "incoming",
            fromBot: randomBot.name,
            flag: randomBot.flag,
            countryName: randomBot.countryName,
            sentAt: now,
            arrivalAt: arrivalTime,
            status: "In transit ✈️"
        });

        randomBot.sent += 1;
        uiNeedsUpdate = true;
        
        showMysteryIncomingModal();
    }

    if (uiNeedsUpdate && typeof refreshAllLists === 'function') {
        refreshAllLists();
    }
}

// 2. ПРОВЕРКА ДОСТАВКИ
function checkBotDeliveries() {
    if (!state.tracking || state.tracking.length === 0) return;
    
    const now = new Date().getTime();
    let uiNeedsUpdate = false;
    
    for (let i = state.tracking.length - 1; i >= 0; i--) {
        const item = state.tracking[i];
        
        if (item.type === "incoming" && item.arrivalAt && now >= item.arrivalAt) {
            
            state.receivedPostcards.unshift({
                countryFlag: item.flag,
                fromBot: item.fromBot,
                senderName: item.fromBot,
                senderCity: item.countryName || "Capital",
                to: item.fromBot + ", " + item.flag, 
                status: "Delivered",
                frontImage: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80&random=${Math.random()}`,
                message: `Hello friend!\n\nI'm sending you warm greetings from my country! Hope you enjoy this postcard.\n\nBest wishes,\n${item.fromBot}`,
                stampType: "emoji",
                stampData: "💌"
            });
            
            state.tracking.splice(i, 1);
            uiNeedsUpdate = true;
            
            showDeliveryModal(item.fromBot, item.flag);
        }
    }
    
    if (uiNeedsUpdate && typeof refreshAllLists === 'function') {
        refreshAllLists();
    }
}

// ==========================================================================
// 3. НОВЫЕ КРАСИВЫЕ МОДАЛЬНЫЕ ОКНА
// ==========================================================================
function showMysteryIncomingModal() {
    const phoneFrame = document.querySelector('.phone-frame') || document.body;
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';

    overlay.innerHTML = `
        <div class="custom-alert-box">
            <div style="font-size: 50px; margin-bottom: -15px;">✈️</div>
            <div style="font-size: 20px; font-weight: 900; color: #2980b9; margin-bottom: 5px;">Incoming Mail!</div>
            <div class="custom-alert-text" style="font-size: 14px;">
                Someone from across the world just sent you a mystery postcard!<br>
                <br>
                <span style="color: #7f8c8d; font-size: 12px;">Track it on your Home screen.</span>
            </div>
            <button class="primary-button custom-alert-btn" style="background: #2980b9; border-color: #2980b9;" onclick="this.closest('.custom-alert-overlay').remove()">Awesome!</button>
        </div>
    `;
    phoneFrame.appendChild(overlay);
}

function showDeliveryModal(botName, flag) {
    const phoneFrame = document.querySelector('.phone-frame') || document.body;
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';

    overlay.innerHTML = `
        <div class="custom-alert-box">
            <div style="font-size: 50px; margin-bottom: -15px;">📬</div>
            <div style="font-size: 20px; font-weight: 900; color: #27ae60; margin-bottom: 5px;">Delivered!</div>
            <div class="custom-alert-text" style="font-size: 14px;">
                You just received a new postcard from<br>
                <b style="font-size: 16px; color: #333;">${botName} <span style="font-size: 18px;">${flag}</span></b><br>
                <br>
                <span style="color: #7f8c8d; font-size: 12px;">Check your Received Postcards archive.</span>
            </div>
            <button class="primary-button custom-alert-btn" style="background: #27ae60; border-color: #27ae60;" onclick="this.closest('.custom-alert-overlay').remove()">Open Archive</button>
        </div>
    `;
    phoneFrame.appendChild(overlay);
}

setInterval(simulateBotActivity, BOT_SETTINGS.ACTIVITY_INTERVAL); 
setInterval(checkBotDeliveries, 3000);

// ==========================================================================
// 4. УПРАВЛЕНИЕ НАСТРОЙКАМИ БОТОВ
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const botToggle = document.getElementById('bot-toggle');
    const botSettingsRow = document.getElementById('bot-settings-row');
    const botSlider = document.getElementById('bot-count-slider');
    const botCountDisplay = document.getElementById('bot-count-display');
    const btnApplyBots = document.getElementById('btn-apply-bots'); 

    const botNames = ["Traveler", "PostX", "Nomad", "Wanderlust", "GlobeTrotter", "StampLover", "MailBird", "LetterFan", "PostcardKing", "PenPal", "OceanView", "MountainPeak"];

    function generateBots(count) {
        state.bots = []; 
        
        const allCountries = typeof countryList !== 'undefined' ? countryList : [{flag: '🌍', name: 'Unknown'}];
        
        for(let i = 0; i < count; i++) {
            const randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
            const nameBase = botNames[Math.floor(Math.random() * botNames.length)];
            const botName = `@${nameBase}_${Math.floor(Math.random() * 999)}`;
            const sentCount = Math.floor(Math.random() * 40) + 1; 
            
            state.bots.push({
                name: botName,
                flag: randomCountry.flag,
                countryName: randomCountry.name,
                sent: sentCount
            });
        }
        
        if (typeof refreshAllLists === 'function') refreshAllLists();
    }

    if (botToggle && botSettingsRow && botSlider && btnApplyBots) {
        botToggle.onchange = (e) => {
            if (e.target.checked) {
                botSettingsRow.style.display = 'block';
                generateBots(parseInt(botSlider.value));
            } else {
                botSettingsRow.style.display = 'none';
                state.bots = []; 
                if (typeof refreshAllLists === 'function') refreshAllLists();
            }
        };

        botSlider.oninput = (e) => {
            botCountDisplay.textContent = e.target.value;
        };

        btnApplyBots.onclick = () => {
            const count = parseInt(botSlider.value);
            generateBots(count);
            
            const originalText = btnApplyBots.textContent;
            btnApplyBots.textContent = "✅ Applied!";
            btnApplyBots.style.background = "#d35400";
            btnApplyBots.style.color = "white";
            
            setTimeout(() => {
                btnApplyBots.textContent = originalText;
                btnApplyBots.style.background = "transparent";
                btnApplyBots.style.color = "#d35400";
            }, 1000);
        };
    }
});