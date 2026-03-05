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
        
        const now = new Date().getTime();
        let arrivalTime;

        // === ПРОВЕРКА МГНОВЕННОЙ ДОСТАВКИ (ЧИТ-РЕЖИМ) ===
        const instantToggle = document.getElementById('instant-delivery-toggle');
        if (instantToggle && instantToggle.checked) {
            // Доставка через 1 секунду
            arrivalTime = now + 1000; 
        } else {
            // Реальная география от страны бота до твоего дома
            arrivalTime = calculateDeliveryTime(randomBot.flag, MY_HOME_FLAG);
        }

        state.tracking.unshift({
            type: "incoming",
            fromBot: randomBot.name,
            flag: randomBot.flag,
            countryName: randomBot.countryName,
            // Город удален
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

// ==========================================================================
// 2. АСИНХРОННАЯ ГЕНЕРАЦИЯ И ПРОВЕРКА ДОСТАВКИ
// ==========================================================================

// Функция фоновой генерации AI-открытки от бота
async function processIncomingDelivery(item) {
    const seed = Math.floor(Math.random() * 10000000);
    const apiKey = "sk_cWgVu0P68kj6o4SVTj3eLeF79FgLbie8";
    
    // Формируем красивые промпты, используя страну бота
    const frontPrompt = encodeURIComponent(`Beautiful landscape, famous landmarks, and nature of ${item.countryName}, highly detailed, professional postcard photography, cinematic lighting, 8k (variation: ${seed})`);
    const stampPrompt = encodeURIComponent(`Vintage postage stamp of ${item.countryName}, intricate engraving, official postal look, muted philatelic colors, highly detailed (variation: ${seed})`);

    // Подключаем модель FLUX
    const frontUrl = `https://gen.pollinations.ai/image/${frontPrompt}?width=800&height=500&model=flux&nologo=true&seed=${seed}`;
    const stampUrl = `https://gen.pollinations.ai/image/${stampPrompt}?width=200&height=250&model=flux&nologo=true&seed=${seed}`;

    try {
        // Скачиваем обе картинки параллельно с твоим ключом
        const [frontRes, stampRes] = await Promise.all([
            fetch(frontUrl, { headers: { "Authorization": `Bearer ${apiKey}` } }),
            fetch(stampUrl, { headers: { "Authorization": `Bearer ${apiKey}` } })
        ]);

        if (!frontRes.ok || !stampRes.ok) throw new Error("API Limit reached");

        const frontBlob = await frontRes.blob();
        const stampBlob = await stampRes.blob();

        // Добавляем готовую открытку в твой Архив
        state.receivedPostcards.unshift({
            countryFlag: item.flag,
            fromBot: item.fromBot,
            senderName: item.fromBot,
            // Город удален
            to: item.fromBot + ", " + item.flag, 
            status: "Delivered",
            frontImage: URL.createObjectURL(frontBlob), // Сгенерированное фото страны
            message: `Hello friend!\n\nI am sending you warm greetings from ${item.countryName}! I generated this photo specially for you to show the beauty of my homeland.\n\nBest wishes,\n${item.fromBot}`,
            stampType: "ai",
            stampImage: URL.createObjectURL(stampBlob) // Сгенерированная марка страны
        });

    } catch (e) {
        console.error("Bot image generation failed:", e);
        // Если вдруг API перегружено, возвращаем заглушку, чтобы открытка не потерялась
        state.receivedPostcards.unshift({
            countryFlag: item.flag,
            fromBot: item.fromBot,
            senderName: item.fromBot,
            // Город удален
            to: item.fromBot + ", " + item.flag, 
            status: "Delivered",
            frontImage: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80&random=${seed}`,
            message: `Hello friend!\n\nWarm greetings from ${item.countryName}!\n\nBest wishes,\n${item.fromBot}`,
            stampType: "emoji",
            stampData: "💌"
        });
    }
    
    // Обновляем списки и показываем окошко радости
    if (typeof refreshAllLists === 'function') refreshAllLists();
    showDeliveryModal(item.fromBot, item.flag);
}


// Основная функция проверки таймеров Трекера
function checkBotDeliveries() {
    if (!state.tracking || state.tracking.length === 0) return;
    
    const now = new Date().getTime();
    let uiNeedsUpdate = false;
    
    for (let i = state.tracking.length - 1; i >= 0; i--) {
        const item = state.tracking[i];
        
        if (item.arrivalAt && now >= item.arrivalAt) {
            
            if (item.type === "incoming") {
                // БОТ ДОСТАВИЛ ТЕБЕ -> Запускаем фоновую нейро-генерацию!
                processIncomingDelivery(item);
                
            } else if (item.type === "outgoing") {
                // ТВОЯ ОТКРЫТКА ДОСТАВЛЕНА БОТУ -> Получаем Токен Кармы
                const sentCard = state.sentPostcards.find(c => c.sentAt === item.sentAt);
                if (sentCard) sentCard.status = "Delivered";
                
                state.receiveTokens = (state.receiveTokens || 0) + 1;
                showOutgoingDeliveredModal(item.toCountry, item.flag);
            }
            
            // Открытка "приземлилась", сразу убираем её из Трекера
            state.tracking.splice(i, 1);
            uiNeedsUpdate = true;
        }
    }
    
    if (uiNeedsUpdate && typeof refreshAllLists === 'function') refreshAllLists();
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
            const sentCount = 0;
            
            state.bots.push({
                name: botName,
                flag: randomCountry.flag,
                countryName: randomCountry.name,
                // Город удален
                sent: sentCount
            });
        }
        
        if (typeof refreshAllLists === 'function') refreshAllLists();
        
        // Обновляем экран Create при генерации ботов
        if (typeof updateCloudScreenUI === 'function') updateCloudScreenUI(); 
    }

    if (botToggle && botSettingsRow && botSlider && btnApplyBots) {
        botToggle.onchange = (e) => {
            if (e.target.checked) {
                // Только показываем ползунок, ничего не генерируем!
                botSettingsRow.style.display = 'block';
            } else {
                botSettingsRow.style.display = 'none';
                state.bots = []; 
                if (typeof refreshAllLists === 'function') refreshAllLists();
                
                // Возвращаем экран Create в режим Personal Collection
                if (typeof updateCloudScreenUI === 'function') updateCloudScreenUI();
            }
        };

        botSlider.oninput = (e) => {
            botCountDisplay.textContent = e.target.value;
        };

        btnApplyBots.onclick = () => {
            const count = parseInt(botSlider.value);
            generateBots(count); // Генерируем ботов только по клику!
            
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