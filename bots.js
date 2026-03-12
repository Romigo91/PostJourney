// ==========================================================================
// СИСТЕМА ИСКУССТВЕННОГО ИНТЕЛЛЕКТА (БОТЫ)
// ==========================================================================

const BOT_SETTINGS = {
    ACTIVITY_INTERVAL: 10000, 
    CHANCE_TO_SEND: 0.15,     
};

// 1. ГЛАВНЫЙ ЦИКЛ ЖИЗНИ БОТОВ (ОБЪЕДИНЕННАЯ УМНАЯ ЛОГИКА)
function simulateBotActivity() {
    if (!state.bots || state.bots.length === 0) return;

    let uiNeedsUpdate = false;
    const chance = BOT_SETTINGS.CHANCE_TO_SEND || 0.15;

    state.bots.forEach(bot => {
        if (!bot.contactedUsers) bot.contactedUsers = [];
        if (!bot.contactedCountries) bot.contactedCountries = [];

        // Проверяем, можешь ли ты получить открытку (есть ли токен)
        let canTargetPlayer = !bot.contactedUsers.includes("You") && state.receiveTokens > 0;

        // Бот просыпается, если у него < 5 отправок ИЛИ ты ждешь открытку!
        if (bot.sent < 5 || canTargetPlayer) {
            
            if (Math.random() < chance) {
                
                let availableTargets = state.bots.filter(target => 
                    target.name !== bot.name && !bot.contactedUsers.includes(target.name)
                );

                let randomTarget = null;

                // ДАЕМ ИГРОКУ ПОЛНЫЙ ПРИОРИТЕТ (70% шанс, что бот ответит сразу тебе)
                if (canTargetPlayer && Math.random() < 0.70) {
                    randomTarget = { name: "You", countryName: state.profile.country || "My Country", isPlayer: true };
                } else if (bot.sent < 5 && availableTargets.length > 0) {
                    randomTarget = availableTargets[Math.floor(Math.random() * availableTargets.length)];
                } else if (canTargetPlayer) {
                    randomTarget = { name: "You", countryName: state.profile.country || "My Country", isPlayer: true };
                }

                if (randomTarget) {
                    bot.contactedUsers.push(randomTarget.name);
                    
                    if (!bot.contactedCountries.includes(randomTarget.countryName)) {
                        bot.contactedCountries.push(randomTarget.countryName);
                    }

                    bot.sent += 1;
                    uiNeedsUpdate = true;

                    // ЕСЛИ ВЫБРАН ТЫ — ОТПРАВЛЯЕМ В ТРЕКЕР
                    if (randomTarget.isPlayer) {
                        state.receiveTokens -= 1; 
                        
                        const now = new Date().getTime();
                        // Ставим базовое время. Если включена галочка 1s, "Машина времени" ниже его сожмет
                        const myFlag = typeof MY_HOME_FLAG !== 'undefined' ? MY_HOME_FLAG : "🌍";
                        const arrivalTime = typeof calculateDeliveryTime === 'function' ? calculateDeliveryTime(bot.flag, myFlag) : now + 3600000;

                        state.tracking.unshift({
                            type: "incoming",
                            fromBot: bot.name,
                            flag: bot.flag,
                            countryName: bot.countryName,
                            sentAt: now,
                            arrivalAt: arrivalTime,
                            status: "In transit ✈️"
                        });
                    }
                }
            }
        }
    });

    if (uiNeedsUpdate && typeof refreshAllLists === 'function') refreshAllLists();
}

// ==========================================================================
// 2. АСИНХРОННАЯ ГЕНЕРАЦИЯ И ПРОВЕРКА ДОСТАВКИ
// ==========================================================================

async function processIncomingDelivery(item) {
    const seed = Math.floor(Math.random() * 10000000);
    const apiKey = "sk_cWgVu0P68kj6o4SVTj3eLeF79FgLbie8";
    
    const frontPrompt = encodeURIComponent(`Beautiful landscape, famous landmarks, and nature of ${item.countryName}, highly detailed, professional postcard photography, cinematic lighting, 8k (variation: ${seed})`);
    const stampPrompt = encodeURIComponent(`Vintage postage stamp of ${item.countryName}, intricate engraving, official postal look, muted philatelic colors, highly detailed (variation: ${seed})`);

    const frontUrl = `https://gen.pollinations.ai/image/${frontPrompt}?width=800&height=500&model=flux&nologo=true&seed=${seed}`;
    const stampUrl = `https://gen.pollinations.ai/image/${stampPrompt}?width=200&height=250&model=flux&nologo=true&seed=${seed}`;

    try {
        const [frontRes, stampRes] = await Promise.all([
            fetch(frontUrl, { headers: { "Authorization": `Bearer ${apiKey}` } }),
            fetch(stampUrl, { headers: { "Authorization": `Bearer ${apiKey}` } })
        ]);

        if (!frontRes.ok || !stampRes.ok) throw new Error("API Limit reached");

        const frontBlob = await frontRes.blob();
        const stampBlob = await stampRes.blob();

        state.receivedPostcards.unshift({
            countryFlag: item.flag,
            fromBot: item.fromBot,
            senderName: item.fromBot,
            to: item.fromBot + ", " + item.flag, 
            status: "Delivered",
            frontImage: URL.createObjectURL(frontBlob), 
            message: `Hello friend!\n\nI am sending you warm greetings from ${item.countryName}! I generated this photo specially for you to show the beauty of my homeland.\n\nBest wishes,\n${item.fromBot}`,
            stampType: "ai",
            stampImage: URL.createObjectURL(stampBlob) 
        });

    } catch (e) {
        console.error("Bot image generation failed:", e);
        state.receivedPostcards.unshift({
            countryFlag: item.flag,
            fromBot: item.fromBot,
            senderName: item.fromBot,
            to: item.fromBot + ", " + item.flag, 
            status: "Delivered",
            frontImage: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80&random=${seed}`,
            message: `Hello friend!\n\nWarm greetings from ${item.countryName}!\n\nBest wishes,\n${item.fromBot}`,
            stampType: "emoji",
            stampData: "💌"
        });
    }
    
    if (typeof refreshAllLists === 'function') refreshAllLists();
    if (typeof showToastNotification === 'function') {
        showToastNotification(`📬 New postcard received from <b>${item.fromBot}</b> ${item.flag}!`);
    }
    
    // === МАГИЯ: ОТКРЫВАЕМ ЧАТ С БОТОМ, КОТОРЫЙ ПРИСЛАЛ ОТКРЫТКУ ===
    if (typeof unlockChat === 'function') {
        const bot = state.bots.find(b => b.name === item.fromBot) || {};
        const botId = bot.userId || item.fromBot;
        unlockChat(botId, item.fromBot, item.flag, item.countryName);
    }
}

// === МАШИНА ВРЕМЕНИ И ПРОВЕРКА ДОСТАВКИ ===
function checkBotDeliveries() {
    if (!state.tracking || state.tracking.length === 0) return;
    
    const now = new Date().getTime();
    let uiNeedsUpdate = false;
    
    // МАГИЯ ДЕБАГА: Проверяем галочку
    const instantToggle = document.getElementById('instant-delivery-toggle');
    const isInstantMode = instantToggle && instantToggle.checked;

    // Если галочка включена, перебираем ВСЕ открытки и сжимаем время до 1 сек
    if (isInstantMode) {
        state.tracking.forEach(item => {
            // Если оригинальное время доставки больше 2 секунд - сжимаем!
            if (item.arrivalAt - item.sentAt > 2000) {
                item.arrivalAt = item.sentAt + 1000; 
                uiNeedsUpdate = true; // Обновляем UI, чтобы прогресс-бар дернулся
            }
        });
    }
    
    for (let i = state.tracking.length - 1; i >= 0; i--) {
        const item = state.tracking[i];
        
        if (item.arrivalAt && now >= item.arrivalAt) {
            
            if (item.type === "incoming") {
                processIncomingDelivery(item);
                
            } else if (item.type === "outgoing") {
                const sentCard = state.sentPostcards.find(c => c.sentAt === item.sentAt);
                if (sentCard) sentCard.status = "Delivered";
                
                state.receiveTokens = (state.receiveTokens || 0) + 1; 
                
                // === МАГИЯ: БОТ ПОЛУЧИЛ ТВОЮ ОТКРЫТКУ И ПИШЕТ ТЕБЕ ===
                const bot = state.bots.find(b => b.flag === item.flag);
                if (bot && typeof unlockChat === 'function') {
                    unlockChat(bot.userId, bot.name, bot.flag, bot.countryName);
                }
            }
            
            state.tracking.splice(i, 1);
            uiNeedsUpdate = true;
        }
    }
    
    if (uiNeedsUpdate && typeof refreshAllLists === 'function') refreshAllLists();
}

// ==========================================================================
// 3. МОДАЛЬНЫЕ ОКНА
// ==========================================================================



setInterval(simulateBotActivity, BOT_SETTINGS.ACTIVITY_INTERVAL); 
// Ускоряем проверку трекера до 1 раза в секунду, чтобы "Instant" срабатывал моментально
setInterval(checkBotDeliveries, 1000); 

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
            
            state.bots.push({
                name: `@${nameBase}_${Math.floor(Math.random() * 999)}`,
                flag: randomCountry.flag,
                countryName: randomCountry.name,
                sent: 0,
                userId: 'PJ-' + Math.floor(1000 + Math.random() * 9000) // <--- ДОБАВИЛИ СЮДА
            });
        }
        
        if (typeof refreshAllLists === 'function') refreshAllLists();
        if (typeof updateCloudScreenUI === 'function') updateCloudScreenUI(); 
    }

    if (botToggle && botSettingsRow && botSlider && btnApplyBots) {
        botToggle.onchange = (e) => {
            if (e.target.checked) {
                botSettingsRow.style.display = 'block';
            } else {
                botSettingsRow.style.display = 'none';
                state.bots = []; 
                if (typeof refreshAllLists === 'function') refreshAllLists();
                if (typeof updateCloudScreenUI === 'function') updateCloudScreenUI();
            }
        };

        botSlider.oninput = (e) => botCountDisplay.textContent = e.target.value;

        btnApplyBots.onclick = () => {
            generateBots(parseInt(botSlider.value)); 
            
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