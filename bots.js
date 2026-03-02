// ==========================================================================
// СИСТЕМА ИСКУССТВЕННОГО ИНТЕЛЛЕКТА (БОТЫ)
// ==========================================================================

const BOT_SETTINGS = {
    ACTIVITY_INTERVAL: 15000, // Боты "думают" каждые 15 секунд
    CHANCE_TO_SEND: 0.15,     // 15% шанс, что бот отправит открытку тебе
    MIN_DELIVERY_MINUTES: 1,  // Минимальное время доставки (1 минута для быстрого теста)
    MAX_DELIVERY_MINUTES: 3   // Максимальное время доставки (3 минуты)
};

// 1. ГЛАВНЫЙ ЦИКЛ ЖИЗНИ БОТОВ
function simulateBotActivity() {
    // Если боты выключены в настройках — ничего не делаем
    if (!state.bots || state.bots.length === 0) return;

    let uiNeedsUpdate = false;

    // --- А. СИМУЛЯЦИЯ ИХ СОБСТВЕННОЙ ЖИЗНИ (Ежедневные бонусы) ---
    // Каждый бот с вероятностью 10% отправляет кому-то (не тебе) открытку
    state.bots.forEach(bot => {
        if (Math.random() < 0.10) {
            bot.sent += 1;
            uiNeedsUpdate = true; // Таблица лидеров изменилась
        }
    });

    // --- Б. ОТПРАВКА ОТКРЫТКИ ТЕБЕ ---
    if (Math.random() < BOT_SETTINGS.CHANCE_TO_SEND) {
        // Выбираем случайного бота из списка
        const randomBot = state.bots[Math.floor(Math.random() * state.bots.length)];
        
        // Генерируем случайное время доставки
        const deliveryMinutes = Math.floor(Math.random() * (BOT_SETTINGS.MAX_DELIVERY_MINUTES - BOT_SETTINGS.MIN_DELIVERY_MINUTES + 1)) + BOT_SETTINGS.MIN_DELIVERY_MINUTES;
        const now = new Date().getTime();
        const arrivalTime = now + (deliveryMinutes * 60 * 1000);

        // Добавляем открытку в твой ТРЕКИНГ
        state.tracking.unshift({
            type: "incoming",
            fromBot: randomBot.name,
            flag: randomBot.flag,
            sentAt: now,
            arrivalAt: arrivalTime,
            status: "In transit ✈️"
        });

        randomBot.sent += 1; // Бот молодец, счетчик растет
        uiNeedsUpdate = true;
        
        // Показываем красивое пуш-уведомление сверху экрана!
        showBotNotification(`📬 ${randomBot.name} ${randomBot.flag} sent you a postcard!`);
    }

    if (uiNeedsUpdate && typeof refreshAllLists === 'function') {
        refreshAllLists();
    }
}

// 2. ПРОВЕРКА ДОСТАВКИ (Прилетели ли открытки?)
function checkBotDeliveries() {
    if (!state.tracking || state.tracking.length === 0) return;
    
    const now = new Date().getTime();
    let uiNeedsUpdate = false;
    
    // Идем с конца массива, чтобы безопасно удалять элементы
    for (let i = state.tracking.length - 1; i >= 0; i--) {
        const item = state.tracking[i];
        
        // Если это открытка от бота, и время пришло
        if (item.type === "incoming" && item.arrivalAt && now >= item.arrivalAt) {
            
            // ПЕРЕНОСИМ В АРХИВ ПОЛУЧЕННЫХ!
            state.receivedPostcards.unshift({
                countryFlag: item.flag,
                fromBot: item.fromBot, // Сохраняем имя бота
                senderName: item.fromBot,
                senderCity: "Travel Hub", 
                to: item.fromBot + ", " + item.flag, 
                status: "Delivered",
                frontImage: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80&random=${Math.random()}`,
                message: `Hello friend!\n\nI'm sending you warm greetings from my country! Hope you enjoy this postcard.\n\nBest wishes,\n${item.fromBot}`,
                stampType: "emoji",
                stampData: "💌"
            });
            
            // Удаляем из трекинга
            state.tracking.splice(i, 1);
            uiNeedsUpdate = true;
            
            // Уведомление о получении!
            showBotNotification(`✅ You received a postcard from ${item.fromBot}! Check your Map.`);
        }
    }
    
    if (uiNeedsUpdate && typeof refreshAllLists === 'function') {
        refreshAllLists();
    }
}

// 3. СИСТЕМА КРАСИВЫХ ПУШ-УВЕДОМЛЕНИЙ
function showBotNotification(message) {
    const phoneFrame = document.querySelector('.phone-frame') || document.body;
    const toast = document.createElement('div');
    
    toast.style.position = 'absolute';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(46, 204, 113, 0.95)';
    toast.style.color = 'white';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '20px';
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '12px';
    toast.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    toast.style.zIndex = '1000';
    toast.style.transition = 'opacity 0.4s ease, top 0.4s ease';
    toast.style.opacity = '0';
    toast.style.textAlign = 'center';
    toast.style.width = '80%';
    
    toast.innerHTML = message;
    
    phoneFrame.appendChild(toast);
    
    // Анимация появления
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.top = '30px';
    }, 10);
    
    // Анимация исчезновения
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.top = '20px';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Запускаем двигатель ИИ
setInterval(simulateBotActivity, BOT_SETTINGS.ACTIVITY_INTERVAL); 
setInterval(checkBotDeliveries, 3000);

// ==========================================================================
// 4. УПРАВЛЕНИЕ НАСТРОЙКАМИ БОТОВ (ИНТЕРФЕЙС ТУМБЛЕРА И ПОЛЗУНКА)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    const botToggle = document.getElementById('bot-toggle');
    const botSettingsRow = document.getElementById('bot-settings-row');
    const botSlider = document.getElementById('bot-count-slider');
    const botCountDisplay = document.getElementById('bot-count-display');
    const btnApplyBots = document.getElementById('btn-apply-bots'); // Наша новая кнопка

    // База имен для симуляции
    const botNames = ["Traveler", "PostX", "Nomad", "Wanderlust", "GlobeTrotter", "StampLover", "MailBird", "LetterFan", "PostcardKing", "PenPal", "OceanView", "MountainPeak"];

    function generateBots(count) {
        state.bots = []; // Очищаем старых ботов
        
        const allCountries = typeof countryList !== 'undefined' ? countryList : [{flag: '🌍'}];
        
        for(let i = 0; i < count; i++) {
            const randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
            const nameBase = botNames[Math.floor(Math.random() * botNames.length)];
            const botName = `@${nameBase}_${Math.floor(Math.random() * 999)}`;
            const sentCount = Math.floor(Math.random() * 40) + 1; 
            
            state.bots.push({
                name: botName,
                flag: randomCountry.flag,
                sent: sentCount
            });
        }
        
        if (typeof refreshAllLists === 'function') refreshAllLists();
    }

    if (botToggle && botSettingsRow && botSlider && btnApplyBots) {
        
        // Логика включения/выключения тумблера
        botToggle.onchange = (e) => {
            if (e.target.checked) {
                botSettingsRow.style.display = 'block';
                // При включении генерируем стартовое значение (например, 5)
                generateBots(parseInt(botSlider.value));
            } else {
                botSettingsRow.style.display = 'none';
                state.bots = []; // Убиваем ботов
                if (typeof refreshAllLists === 'function') refreshAllLists();
            }
        };

        // ИСПРАВЛЕНИЕ: Теперь ползунок ТОЛЬКО меняет цифру на экране, но НЕ генерирует ботов!
        botSlider.oninput = (e) => {
            botCountDisplay.textContent = e.target.value;
        };

        // НОВОЕ: Генерация происходит только по клику на кнопку!
        btnApplyBots.onclick = () => {
            const count = parseInt(botSlider.value);
            generateBots(count);
            
            // Красивая анимация кнопки, чтобы показать, что всё сработало
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