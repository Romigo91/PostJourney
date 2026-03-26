// ==========================================================================
// СИСТЕМА ИСКУССТВЕННОГО ИНТЕЛЛЕКТА (БОТЫ)
// ==========================================================================

// === БАЗА АВАТАРОВ ДЛЯ БОТОВ ===
const BOT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", // Девушка брюнетка
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop", // Мужчина профиль
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", // Девушка портрет
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop", // Парень серьезный
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", // Девушка с улыбкой
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop", // Парень с улыбкой
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop", // Девушка на светлом фоне
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop", // Мужчина в очках
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150&h=150&fit=crop", // Девушка кудрявая
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop"  // Парень с бородой
];

// Функция подбирает уникальное лицо на основе имени
window.getBotAvatar = function (name) {
  if (!name) return "👤"; // Заглушка на случай ошибки
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
  }
  return BOT_AVATARS[Math.abs(hash) % BOT_AVATARS.length];
};

const BOT_SETTINGS = {
  ACTIVITY_INTERVAL: 10000,
  CHANCE_TO_SEND: 0.15,
};

// 1. ГЛАВНЫЙ ЦИКЛ ЖИЗНИ БОТОВ (ОБЪЕДИНЕННАЯ УМНАЯ ЛОГИКА)
// ... дальше идет твой старый код ...
function simulateBotActivity() {
  if (!state.bots || state.bots.length === 0) return;

  let uiNeedsUpdate = false;
  const chance = BOT_SETTINGS.CHANCE_TO_SEND || 0.15;

  state.bots.forEach((bot) => {
    if (!bot.contactedUsers) bot.contactedUsers = [];
    if (!bot.contactedCountries) bot.contactedCountries = [];

    // Проверяем, можешь ли ты получить открытку (есть ли токен)
    let canTargetPlayer =
      !bot.contactedUsers.includes("You") && state.receiveTokens > 0;

    // Бот просыпается, если у него < 5 отправок ИЛИ ты ждешь открытку!
    if (bot.sent < 5 || canTargetPlayer) {
      if (Math.random() < chance) {
        let availableTargets = state.bots.filter(
          (target) =>
            target.name !== bot.name &&
            !bot.contactedUsers.includes(target.name),
        );

        let randomTarget = null;

        // ДАЕМ ИГРОКУ ПОЛНЫЙ ПРИОРИТЕТ (70% шанс, что бот ответит сразу тебе)
        if (canTargetPlayer && Math.random() < 0.7) {
          randomTarget = {
            name: "You",
            countryName: state.profile.country || "My Country",
            isPlayer: true,
          };
        } else if (bot.sent < 5 && availableTargets.length > 0) {
          randomTarget =
            availableTargets[
              Math.floor(Math.random() * availableTargets.length)
            ];
        } else if (canTargetPlayer) {
          randomTarget = {
            name: "You",
            countryName: state.profile.country || "My Country",
            isPlayer: true,
          };
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
            const myFlag =
              typeof MY_HOME_FLAG !== "undefined" ? MY_HOME_FLAG : "🌍";
            const arrivalTime =
              typeof calculateDeliveryTime === "function"
                ? calculateDeliveryTime(bot.flag, myFlag)
                : now + 3600000;

                state.tracking.unshift({
                  type: "incoming",
                  senderId: bot.userId, // <--- ДОБАВЛЯЕМ ВОТ ЭТУ СТРОЧКУ!
                  fromBot: bot.name,
                  flag: bot.flag,
                  countryName: bot.countryName,
                  sentAt: now,
                  arrivalAt: arrivalTime,
                  status: "In transit ✈️",
                });
          }
        }
      }
    }
  });

  if (uiNeedsUpdate && typeof refreshAllLists === "function") refreshAllLists();
}

// ==========================================================================
// 2. АСИНХРОННАЯ ГЕНЕРАЦИЯ И ПРОВЕРКА ДОСТАВКИ
// ==========================================================================

async function processIncomingDelivery(item) {
  const seed = Math.floor(Math.random() * 10000000);
  const apiKey = "sk_cWgVu0P68kj6o4SVTj3eLeF79FgLbie8";

  const frontPrompt = encodeURIComponent(
    `Beautiful landscape, famous landmarks, and nature of ${item.countryName}, highly detailed, professional postcard photography, cinematic lighting, 8k (variation: ${seed})`,
  );
  const stampPrompt = encodeURIComponent(
    `Vintage postage stamp of ${item.countryName}, intricate engraving, official postal look, muted philatelic colors, highly detailed (variation: ${seed})`,
  );

  const frontUrl = `https://gen.pollinations.ai/image/${frontPrompt}?width=800&height=500&model=flux&nologo=true&seed=${seed}`;
  const stampUrl = `https://gen.pollinations.ai/image/${stampPrompt}?width=200&height=250&model=flux&nologo=true&seed=${seed}`;

  try {
    const [frontRes, stampRes] = await Promise.all([
      fetch(frontUrl, { headers: { Authorization: `Bearer ${apiKey}` } }),
      fetch(stampUrl, { headers: { Authorization: `Bearer ${apiKey}` } }),
    ]);

    if (!frontRes.ok || !stampRes.ok) throw new Error("API Limit reached");

    const frontBlob = await frontRes.blob();
    const stampBlob = await stampRes.blob();

    state.receivedPostcards.unshift({
      senderId: item.senderId, 
      displayId: 'PJ-' + Math.floor(1000 + Math.random() * 9000), // <--- ВОТ ЭТА СТРОЧКА!
      countryFlag: item.flag,
      fromBot: item.fromBot,
      senderName: item.fromBot,
      to: item.fromBot + ", " + item.flag,
      status: "Delivered",
      frontImage: URL.createObjectURL(frontBlob),
      message: `Hello friend!\n\nI am sending you warm greetings from ${item.countryName}! I generated this photo specially for you to show the beauty of my homeland.\n\nBest wishes,\n${item.fromBot}`,
      stampType: "ai",
      stampImage: URL.createObjectURL(stampBlob),
      isNew: true,
    });
  } catch (e) {
    console.error("Bot image generation failed:", e);
    state.receivedPostcards.unshift({
      senderId: item.senderId, 
      displayId: 'PJ-' + Math.floor(1000 + Math.random() * 9000), // <--- И СЮДА ТОЖЕ!
      countryFlag: item.flag,
      fromBot: item.fromBot,
      senderName: item.fromBot,
      to: item.fromBot + ", " + item.flag,
      status: "Delivered",
      frontImage: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80&random=${seed}`,
      message: `Hello friend!\n\nWarm greetings from ${item.countryName}!\n\nBest wishes,\n${item.fromBot}`,
      stampType: "emoji",
      stampData: "💌",
      isNew: true,
    });
  }

  if (typeof refreshAllLists === "function") refreshAllLists();

  // === МАГИЯ: ОТКРЫВАЕМ ЧАТ С БОТОМ, КОТОРЫЙ ПРИСЛАЛ ОТКРЫТКУ ===
  if (typeof unlockChat === "function") {
    const bot = state.bots.find((b) => b.name === item.fromBot) || {};
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
  const instantToggle = document.getElementById("instant-delivery-toggle");
  const isInstantMode = instantToggle && instantToggle.checked;

  // Если галочка включена, перебираем ВСЕ открытки и сжимаем время до 1 сек
  if (isInstantMode) {
    state.tracking.forEach((item) => {
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
        const sentCard = state.sentPostcards.find(
          (c) => c.sentAt === item.sentAt,
        );
        if (sentCard) sentCard.status = "Delivered";

        state.receiveTokens = (state.receiveTokens || 0) + 1;

        // === МАГИЯ: БОТ ПОЛУЧИЛ ТВОЮ ОТКРЫТКУ И ПИШЕТ ТЕБЕ ===
        const bot = state.bots.find((b) => b.flag === item.flag);
        if (bot && typeof unlockChat === "function") {
          unlockChat(bot.userId, bot.name, bot.flag, bot.countryName);
        }
      }

      state.tracking.splice(i, 1);
      uiNeedsUpdate = true;
    }
  }

  if (uiNeedsUpdate && typeof refreshAllLists === "function") refreshAllLists();
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
  const botToggle = document.getElementById("bot-toggle");
  const botNames = [
    "Traveler",
    "PostX",
    "Nomad",
    "Wanderlust",
    "GlobeTrotter",
    "StampLover",
    "MailBird",
    "LetterFan",
    "PostcardKing",
    "PenPal",
    "OceanView",
    "MountainPeak",
  ];

  function generateBots(count) {
    state.bots = [];
    // Создаем копию базы стран, чтобы не сломать оригинал
    const allCountries =
      typeof countryList !== "undefined"
        ? [...countryList]
        : [{ flag: "🌍", name: "Unknown" }];

    // ПЕРЕМЕШИВАЕМ СТРАНЫ, чтобы каждый раз был случайный уникальный набор
    allCountries.sort(() => 0.5 - Math.random());

    for (let i = 0; i < count; i++) {
      // Берем страны по порядку из перемешанного массива (гарантия уникальности)
      const randomCountry = allCountries[i % allCountries.length];
      const nameBase = botNames[Math.floor(Math.random() * botNames.length)];

      state.bots.push({
        name: `@${nameBase}_${Math.floor(Math.random() * 999)}`,
        flag: randomCountry.flag,
        countryName: randomCountry.name,
        sent: 0,
        userId: "PJ-" + Math.floor(1000 + Math.random() * 9000),
      });
    }

    if (typeof refreshAllLists === "function") refreshAllLists();
    if (typeof updateCloudScreenUI === "function") updateCloudScreenUI();
  }

  if (botToggle) {
    botToggle.onchange = (e) => {
      if (e.target.checked) {
        // ТУМБЛЕР ВКЛЮЧЕН -> Сразу создаем 10 ботов
        generateBots(10);
        
      } else {
        // ТУМБЛЕР ВЫКЛЮЧЕН -> Сбрасываем ботов
        state.bots = [];
        if (typeof refreshAllLists === "function") refreshAllLists();
        if (typeof updateCloudScreenUI === "function") updateCloudScreenUI();
      }
    };
  }
});
