// ==========================================================================
// CHAT & AI SYSTEM
// ==========================================================================

let currentActiveChatId = null;

// === УМНЫЙ РЕНДЕР АВАТАРКИ (Эмодзи или Картинка) ===
function renderAvatarHTML(content) {
  if (content && (content.startsWith("http") || content.startsWith("data:"))) {
    return `<img src="${content}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block;">`;
  }
  return content;
}

// === 1. РАЗБЛОКИРОВКА НОВОГО ЧАТА ===
window.unlockChat = function (botId, botName, botFlag, botCountry) {
  if (!state.chats) state.chats = {};

  // Если чата еще нет, создаем его
  if (!state.chats[botId]) {
    state.chats[botId] = {
      id: botId,
      name: botName,
      flag: botFlag,
      country: botCountry,
      messages: [],
    };

    // Бот может написать первым!
    setTimeout(() => {
      receiveMessage(
        botId,
        `Hello from ${botFlag}! I received your postcard, it's wonderful!`,
      );
    }, 2000);

    if (typeof saveState === "function") saveState();
    renderChatList();

  }
};

// === 2. РЕНДЕР СПИСКА ЧАТОВ ===
window.renderChatList = function () {
  const container = document.getElementById("chat-list-container");
  if (!container || !state.chats) return;

  const chatKeys = Object.keys(state.chats);

  if (chatKeys.length === 0) {
    container.innerHTML = `
            <div style="text-align: center; color: #aaa; padding: 20px 0; font-size: 14px;">
              No active chats yet.<br>Send postcards to unlock!
            </div>`;
    return;
  }

  container.innerHTML = chatKeys
    .map((key) => {
      const chat = state.chats[key];
      const lastMsg =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1].text
          : "Tap to chat...";

      const unreadDot = chat.hasUnread
        ? '<div style="width: 10px; height: 10px; background: #e74c3c; border-radius: 50%; margin-right: 10px;"></div>'
        : "";
      const msgColor = chat.hasUnread ? "#e74c3c" : "var(--text-sub)";
      const msgWeight = chat.hasUnread ? "bold" : "normal";

      // Получаем лицо бота
      const avatarFace =
        typeof window.getBotAvatar === "function"
          ? window.getBotAvatar(chat.name)
          : chat.flag;

      return `
        <div class="chat-list-item" onclick="openChat('${chat.id}')">
            <div style="font-size: 26px; width: 45px; height: 45px; background: var(--bg-flag-circle); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden;">
                ${renderAvatarHTML(avatarFace)}
            </div>
            <div style="flex: 1; overflow: hidden; margin-left: 5px;">
                <div style="font-weight: 800; color: var(--text-main); font-size: 14px;">${chat.name} <span style="font-size: 12px; margin-left: 4px;">${chat.flag}</span></div>
                <div style="font-size: 12px; color: ${msgColor}; font-weight: ${msgWeight}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lastMsg}</div>
            </div>
            ${unreadDot}
            <div style="font-size: 16px; color: var(--border);">›</div>
        </div>`;
    })
    .join("");
};

// === 3. ОТКРЫТИЕ И ЗАКРЫТИЕ ДИАЛОГА ===
window.openChat = function (botId) {
  currentActiveChatId = botId;
  const chat = state.chats[botId];
  chat.hasUnread = false;
  if (typeof updateChatBadge === "function") updateChatBadge();

  // Прячем списки чатов и меню
  document.getElementById("chat-list-view").style.display = "none";
  const nav = document.querySelector(".bottom-nav");
  if (nav) nav.style.display = "none";

  // Показываем окно активного чата
  const chatView = document.getElementById("active-chat-view");
  chatView.style.display = "flex";

  // === МАГИЯ РАСТЯЖЕНИЯ ===
  // Вешаем класс, который растянет чат и уберет отступ меню
  document.getElementById("screen-container").classList.add("chat-active-mode");
  // ==========================

  const avatarFace =
    typeof window.getBotAvatar === "function"
      ? window.getBotAvatar(chat.name)
      : chat.flag;
      document.getElementById("active-chat-avatar").innerHTML = renderAvatarHTML(avatarFace);
  document.getElementById("active-chat-name").innerHTML =
    `${chat.name} <span style="font-size: 12px; margin-left: 4px;">${chat.flag}</span>`;

    document.getElementById("active-chat-name").setAttribute("data-target-id", botId);

  if (typeof renderMessages === "function") renderMessages();
};

window.closeChat = function () {
  currentActiveChatId = null;

  // Возвращаем список чатов
  document.getElementById("chat-list-view").style.display = "block";

  // Прячем окно диалога
  const chatView = document.getElementById("active-chat-view");
  chatView.style.display = "none";

  // === ОТКЛЮЧАЕМ МАГИЮ ===
  // Убираем класс, чтобы вернуть отступы для нижнего меню
  document
    .getElementById("screen-container")
    .classList.remove("chat-active-mode");

  // УДАЛИЛИ ЗДЕСЬ removeProperty! Окно должно сохранять свои стили!

  // Возвращаем меню
  const nav = document.querySelector(".bottom-nav");
  if (nav) nav.style.display = "flex";

  if (typeof renderChatList === "function") renderChatList();
};

// === 4. РЕНДЕР СООБЩЕНИЙ ===
// === 4. РЕНДЕР СООБЩЕНИЙ (ФИНАЛЬНАЯ ВЕРСИЯ С ФОТО) ===
function renderMessages() {
  const container = document.getElementById("chat-messages-container");
  if (!container || !currentActiveChatId) return;

  const chat = state.chats[currentActiveChatId];

  container.innerHTML = chat.messages
    .map((msg, index) => {
      const isMine = msg.sender === "me";
      const bubbleClass = isMine ? "mine" : "theirs";

      // === 1. ВИДЖЕТ ДУЭЛИ ===
      if (msg.type === 'duel') {
        if (msg.status === 'pending') {
            return `
              <div style="display: flex; flex-direction: column; align-items: ${isMine ? 'flex-end' : 'flex-start'}; margin-bottom: 5px;">
                  <div class="chat-bubble ${bubbleClass}" style="width: 200px; padding: 0; overflow: hidden; border: 2px solid ${isMine ? '#e67e22' : 'var(--border)'}; background: var(--bg-card);">
                      <div style="background: ${isMine ? '#e67e22' : 'var(--bg-input)'}; color: ${isMine ? 'white' : 'var(--text-main)'}; padding: 10px; font-weight: 900; text-align: center; font-size: 14px;">
                          ⚔️ GEO QUIZ DUEL
                      </div>
                      <div style="padding: 15px; text-align: center;">
                          <div style="font-size: 24px; font-weight: 900; margin-bottom: 5px; color: var(--text-main);">${msg.bet} ⚡</div>
                          <div style="font-size: 11px; color: var(--text-sub); margin-bottom: 10px;">
                              ${isMine ? 'Waiting for opponent...' : 'Challenge received!'}
                          </div>
                          ${!isMine ? `<button class="primary-button" style="width: 100%; margin: 0; padding: 8px; font-size: 12px; background: #27ae60;" onclick="acceptDuel('${currentActiveChatId}', ${index})">Accept & Play</button>` : ''}
                      </div>
                  </div>
                  <div class="chat-time">${msg.time}</div>
              </div>
            `;
        } else if (msg.status === 'completed') {
            // РЕНДЕР ФИНАЛЬНОГО РЕЗУЛЬТАТА ДУЭЛИ
            const myScore = isMine ? msg.playerScore : msg.opponentScore;
            const myTime = isMine ? msg.playerTime : msg.opponentTime;
            const theirScore = isMine ? msg.opponentScore : msg.playerScore;
            const theirTime = isMine ? msg.opponentTime : msg.playerTime;

            let didIWin = false;
            let isTie = msg.winner === 'tie';
            if (isMine && msg.winner === 'initiator') didIWin = true;
            if (!isMine && msg.winner === 'responder') didIWin = true;

            const resultColor = isTie ? "#f39c12" : (didIWin ? "#27ae60" : "#e74c3c");
            
            let headerText = "";
            if (isTie) headerText = `🤝 TIE (+${msg.bet} ⚡)`;
            else if (didIWin) headerText = `🏆 YOU WON (+${msg.bet * 2} ⚡)`;
            else headerText = `💔 YOU LOST (-${msg.bet} ⚡)`;
            
            return `
              <div style="display: flex; flex-direction: column; align-items: ${isMine ? 'flex-end' : 'flex-start'}; margin-bottom: 5px;">
                  <div class="chat-bubble ${bubbleClass}" style="width: 240px; padding: 0; overflow: hidden; border: 2px solid ${resultColor}; background: var(--bg-card);">
                      <div style="background: ${resultColor}; color: white; padding: 10px; font-weight: 900; text-align: center; font-size: 14px; text-transform: uppercase;">
                          ${headerText}
                      </div>
                      <div style="padding: 15px;">
                          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: 800; font-size: 13px;">
                              <div style="color: var(--primary);">You</div>
                              <div style="color: var(--text-main);">${myScore}/10 <span style="font-size: 10px; color: var(--text-sub);">(${(myTime/1000).toFixed(2)}s)</span></div>
                          </div>
                          <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 13px;">
                              <div style="color: var(--text-sub);">Opponent</div>
                              <div style="color: var(--text-main);">${theirScore}/10 <span style="font-size: 10px; color: var(--text-sub);">(${(theirTime/1000).toFixed(2)}s)</span></div>
                          </div>
                      </div>
                  </div>
                  <div class="chat-time">${msg.time}</div>
              </div>
            `;
        }
      }

      // === 2. ОТОБРАЖЕНИЕ ФОТОГРАФИЙ (ОБНОВЛЕНО: Меньше размер + клик) ===
      if (msg.type === 'photo' && msg.photoUrl) {
        const borderColor = isMine ? "#e67e22" : "var(--border)"; 
        
        return `
          <div style="display: flex; flex-direction: column; align-items: ${isMine ? 'flex-end' : 'flex-start'}; margin-bottom: 5px;">
              
              <div class="chat-bubble ${bubbleClass}" 
                   style="width: 120px; padding: 0; overflow: hidden; border: 2px solid ${borderColor}; background: var(--bg-card); border-radius: 8px; cursor: pointer;"
                   onclick="window.showFullSizePhoto('${msg.photoUrl}')"
                   title="Click to zoom">
                  
                  <img src="${msg.photoUrl}" style="max-width: 100%; height: auto; object-fit: cover; display: block; border-radius: 6px;">
                  
                  <div style="background: ${isMine ? '#e67e22' : 'var(--bg-input)'}; color: ${isMine ? 'white' : 'var(--text-main)'}; padding: 2px 6px; font-weight: 800; text-align: ${isMine ? 'right' : 'left'}; font-size: 9px;">
                    ${msg.time}
                  </div>
              </div>
          </div>
        `;
    }

      // === 3. СТАРАЯ ЛОГИКА ДЛЯ ТЕКСТОВЫХ СООБЩЕНИЙ ===
      const displayText = msg.showTranslation && msg.translatedText ? msg.translatedText : msg.text;
      const editedMark = msg.edited ? `<span class="chat-edited-mark">(edited)</span>` : "";

      let hintHtml = "";
      if (!isMine) {
        const hintText = msg.showTranslation ? "Tap to show original" : "Tap to translate";
        hintHtml = `<div class="chat-translate-hint">${hintText}</div>`;
      } else {
        hintHtml = `<div class="chat-edit-hint" onclick="startEditingMessage('${currentActiveChatId}', ${index})">Edit ✏️</div>`;
      }

      return `
            <div style="display: flex; flex-direction: column; align-items: ${isMine ? "flex-end" : "flex-start"}; margin-bottom: 5px;">
                <div class="chat-bubble ${bubbleClass}" ${!isMine ? `onclick="toggleTranslation('${currentActiveChatId}', ${index})"` : ""}>
                    ${displayText}
                    <div class="chat-time">${msg.time} ${editedMark}</div>
                </div>
                ${hintHtml}
            </div>
        `;
    })
    .join("");

  setTimeout(() => {
    container.scrollTop = container.scrollHeight;
  }, 50);
}

// Переменная для хранения состояния редактирования
let currentlyEditingMsg = null;

// Функция запуска редактирования
window.startEditingMessage = function (chatId, index) {
  const msg = state.chats[chatId].messages[index];
  const input = document.getElementById("chat-input");
  const sendBtn = document.querySelector(
    'button[onclick="handleSendMessage()"]',
  );

  // Переносим текст в инпут и ставим фокус
  input.value = msg.text;
  input.focus();

  // Запоминаем, что мы редактируем
  currentlyEditingMsg = { chatId: chatId, index: index };

  // Меняем текст кнопки
  if (sendBtn) {
    sendBtn.textContent = "Save";
    sendBtn.style.background = "#27ae60";
  }
};

// === 5. ОТПРАВКА СООБЩЕНИЯ (ЮЗЕР) ===
window.handleSendMessage = function () {
  const input = document.getElementById("chat-input");
  const text = input.value.trim();
  const sendBtn = document.querySelector(
    'button[onclick="handleSendMessage()"]',
  );

  if (!text || !currentActiveChatId) return;

  // === ЕСЛИ МЫ В РЕЖИМЕ РЕДАКТИРОВАНИЯ ===
  if (currentlyEditingMsg) {
    const chat = state.chats[currentlyEditingMsg.chatId];
    const msg = chat.messages[currentlyEditingMsg.index];

    // Обновляем текст и ставим флаг
    msg.text = text;
    msg.edited = true;

    // Сбрасываем состояние
    currentlyEditingMsg = null;
    input.value = "";

    // Возвращаем кнопку в исходное состояние
    if (sendBtn) {
      sendBtn.textContent = "Send";
      sendBtn.style.background = "var(--primary)";
    }

    renderMessages();
    if (typeof saveState === "function") saveState();
    return; // ВАЖНО: Прерываем функцию
  }

  // === ЕСЛИ ЭТО НОВОЕ СООБЩЕНИЕ (Стандартная логика) ===
  const now = new Date();
  const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

  state.chats[currentActiveChatId].messages.push({
    sender: "me",
    text: text,
    time: timeStr,
  });

  input.value = "";
  renderMessages();
  if (typeof saveState === "function") saveState();

  // Триггерим бота
  generateAIResponse(currentActiveChatId, text);
};

// Позволяем отправлять по кнопке Enter на клавиатуре
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");
  if (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") handleSendMessage();
    });
  }

  setTimeout(() => {
    renderChatList();
    updateChatBadge();
  }, 500);
});

// === 6. ПОЛУЧЕНИЕ СООБЩЕНИЯ (ОТ БОТА) ===
function receiveMessage(botId, text) {
  if (!state.chats[botId]) return;

  const now = new Date();
  const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

  state.chats[botId].messages.push({
    sender: "bot",
    text: text,
    time: timeStr,
  });

  if (currentActiveChatId === botId) {
    renderMessages();
  } else {
    state.chats[botId].hasUnread = true;
    renderChatList();
  }

  updateChatBadge();
  if (typeof saveState === "function") saveState();
}

// === 7. 🤖 МОДУЛЬ AI (ИНТЕГРАЦИЯ С OPENROUTER) ===
async function generateAIResponse(botId, userText) {
  const chat = state.chats[botId];
  // Твой ключ OpenRouter
  const API_KEY = "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";

  // Меняем статус на "Typing..."
  const statusEl = document.getElementById("active-chat-status");
  if (statusEl) statusEl.textContent = "typing...";

  try {
    const recentMessages = chat.messages.slice(-8).map((msg) => ({
      role: msg.sender === "me" ? "user" : "assistant",
      content: msg.text,
    }));

    const botCountry = chat.country || chat.flag;

    const systemPrompt = {
      role: "system",
      content: `You are a friendly local from ${botCountry}. Your name is ${chat.name}. You are chatting in a postcard exchange app with a user who sent/received a postcard from you. 
            Rules:
            - Keep your answers short, friendly, and natural (like SMS/messenger format).
            - Add a little bit of your local cultural flavor or national emojis.
            - Do not write long essays. Max 2-3 short sentences.
            - Communicate in English unless the user speaks another language.`,
    };

    const apiMessages = [systemPrompt, ...recentMessages];

    // Стучимся в OpenRouter через стандартный fetch
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        // OpenRouter просит эти заголовки для своей аналитики (по желанию, но лучше оставить)
        "HTTP-Referer": window.location.href, 
        "X-Title": "Postcard Exchange App", 
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-super-120b-a12b:free", // Выбранная тобой бесплатная модель
        messages: apiMessages,
        // Мы не используем stream: true, чтобы ответ приходил целиком, 
        // как этого ожидает твоя функция receiveMessage()
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Детали ошибки API OpenRouter:", errText);
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;
    
    // Передаем готовый ответ в твою функцию отрисовки сообщений
    receiveMessage(botId, botReply);
    
  } catch (error) {
    console.error("Ошибка при генерации AI-ответа:", error);
    receiveMessage(
      botId,
      "Sorry, my internet connection is a bit unstable right now! 🌍 Give me a second."
    );
  } finally {
    if (statusEl) statusEl.textContent = "Online";
  }
}

// === 8. ОБНОВЛЕНИЕ БЕЙДЖА НЕПРОЧИТАННЫХ СООБЩЕНИЙ ===
window.updateChatBadge = function () {
  if (!state.chats) return;

  const badge = document.getElementById("chat-badge");
  if (!badge) return;

  let unreadChatsCount = 0;

  Object.values(state.chats).forEach((chat) => {
    if (chat.hasUnread) {
      unreadChatsCount++;
    }
  });

  if (unreadChatsCount > 0) {
    badge.textContent = unreadChatsCount;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }
};

// === 9. 🌐 МОДУЛЬ ПЕРЕВОДА СООБЩЕНИЙ ===
window.toggleTranslation = async function (chatId, msgIndex) {
  const msg = state.chats[chatId].messages[msgIndex];

  if (msg.showTranslation) {
    msg.showTranslation = false;
    renderMessages();
    if (typeof saveState === "function") saveState();
    return;
  }

  if (msg.translatedText) {
    msg.showTranslation = true;
    renderMessages();
    if (typeof saveState === "function") saveState();
    return;
  }

  const originalText = msg.text;
  msg.text = "Translating... ⏳";
  renderMessages();

  try {
    const targetLang = navigator.language || "en";
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=autodetect|${targetLang}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data && data.responseData && data.responseData.translatedText) {
      msg.translatedText = data.responseData.translatedText;
      msg.showTranslation = true;
    } else {
      if (typeof showToastNotification === "function")
        showToastNotification("⚠️ Translation failed.");
    }
  } catch (error) {
    console.error("Translation error:", error);
    if (typeof showToastNotification === "function")
      showToastNotification("🌍 Network error during translation.");
  } finally {
    msg.text = originalText;
    renderMessages();
    if (typeof saveState === "function") saveState();
  }
};

// === 10. ПРОФИЛЬ СОБЕСЕДНИКА ===
window.showChatUserProfile = function () {
  if (!currentActiveChatId) return;
  const chat = state.chats[currentActiveChatId];

  // 1. Генерируем БИО и ИНТЕРЕСЫ, если их еще нет
  if (!chat.profile) {
    const availableInterests =
      typeof AVAILABLE_INTERESTS !== "undefined"
        ? AVAILABLE_INTERESTS
        : [
            "Travel",
            "Postcards",
            "Nature",
            "Art",
            "Books",
            "Music",
            "Photography",
            "History",
            "Coffee",
          ];
    let shuffledInterests = [...availableInterests].sort(
      () => 0.5 - Math.random(),
    );
    let selectedInterests = shuffledInterests.slice(0, 3);

    const bioTemplates = [
      "Hi! I'm passionate about {int1} and {int2}. I would love to receive a postcard showing {int3}!",
      "Greetings from {country}! I spend my free time enjoying {int1}. Surprise me with a beautiful postcard!",
      "Postcrossing is my favorite hobby! I love learning about {int1} and {int2}.",
      "Hello! Please send me something related to {int3} or {int2}. Happy postcrossing! ✨",
      "I'm a huge fan of {int1}! If you can generate a postcard with that, it would make my day! 🌍",
    ];

    let rawBio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
    let bio = rawBio
      .replace("{int1}", selectedInterests[0].toLowerCase())
      .replace("{int2}", selectedInterests[1].toLowerCase())
      .replace("{int3}", selectedInterests[2].toLowerCase())
      .replace("{country}", chat.country || "my country");

    chat.profile = {
      interests: selectedInterests,
      bio: bio,
    };
    if (typeof saveState === "function") saveState();
  }

  // === 2. ЧЕСТНЫЙ РАСЧЕТ СТАТИСТИКИ ===
  let displayDays = 1;
  let displaySent = 0;
  let displayCountries = 0;

  const installDate = localStorage.getItem("install_date");
  if (installDate) {
    const diffTime = Math.abs(new Date().getTime() - parseInt(installDate));
    displayDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  const bot = state.bots
    ? state.bots.find((b) => b.userId === chat.id || b.name === chat.name)
    : null;

  if (chat.id === state.profile.userId || chat.name === state.profile.name) {
    const validSent = state.sentPostcards.filter(
      (c) =>
        c.isOffline !== true &&
        c.to &&
        !c.to.toLowerCase().includes("personal"),
    );
    displaySent = validSent.length;
    const uniqueCountries = new Set(
      validSent.map((c) => c.countryFlag || c.flag),
    );
    displayCountries = uniqueCountries.size;
  } else if (bot) {
    displaySent = bot.sent || 0;
    displayCountries = bot.contactedCountries
      ? bot.contactedCountries.length
      : 0;
  } else {
    displaySent = chat.profile.stats ? chat.profile.stats.sent : 0;
    displayCountries = chat.profile.stats ? chat.profile.stats.countries : 0;
  }

  chat.profile.stats = { sent: displaySent, countries: displayCountries };

  // 3. Генерируем HTML-теги для интересов
  // 3. Генерируем HTML-теги для интересов (В стиле главной страницы)
  const tagsHtml = chat.profile.interests
    .map(
      (tag) =>
        `<span style="background: transparent; color: var(--text-sub); border: 1px solid var(--border); padding: 4px 12px; border-radius: 16px; font-size: 11px; font-weight: 600;">${tag}</span>`,
    )
    .join("");

  // === ПОЛУЧАЕМ ЛИЦО БОТА ИЗ BOTS.JS ===
  const avatarFace =
    typeof window.getBotAvatar === "function"
      ? window.getBotAvatar(chat.name)
      : chat.flag;

  // 4. Создаем и показываем модальное окно
  const phoneFrame = document.querySelector(".phone-frame") || document.body;
  const overlay = document.createElement("div");
  overlay.className = "custom-alert-overlay";
  overlay.style.zIndex = "999999";

  // === КОНЦЕПТ 1: ЗЕРКАЛО (Идеальная центровка и минимализм) ===
  // === КОНЦЕПТ 1: ЗЕРКАЛО (Обновленный: статус под фото, компактные отступы) ===
  overlay.innerHTML = `
        <div class="custom-alert-box" style="text-align: center; padding: 24px 20px; position: relative;">
            
            <button onclick="this.closest('.custom-alert-overlay').remove()" style="position: absolute; top: 16px; right: 16px; background: var(--bg-element); border: 1px solid var(--border); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: var(--text-main); cursor: pointer; font-weight: bold; z-index: 10; box-shadow: inset 0 2px 4px rgba(255,255,255,0.5);">✕</button>

            <div onclick="showLargeAvatar('${avatarFace}')" style="cursor: pointer; width: 86px; height: 86px; margin: 0 auto 6px auto; font-size: 36px; background: var(--bg-flag-circle); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 3px solid var(--bg-card); box-shadow: 0 8px 16px rgba(0,0,0,0.08);">
                ${renderAvatarHTML(avatarFace)}
            </div>

            <div style="font-size: 10px; color: #27ae60; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; ">Online</div>

            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
                <span style="font-size: 22px; font-weight: 900; color: var(--text-title); line-height: 1;">${chat.name}</span>
                <span style="padding: 2px 8px; font-size: 11px; background: transparent; color: var(--text-sub); border: 1px solid var(--border); border-radius: 12px; font-weight: 700;">${chat.flag}</span>
            </div>

            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-bottom: 16px;">
                ${tagsHtml}
            </div>

            <div style="font-size: 13px; color: var(--text-sub); line-height: 1.4; margin-bottom: 20px; padding: 0 10px;">
                ${chat.profile.bio}
            </div>

            <div style="display: flex; gap: 8px; justify-content: space-between;">
                <div style="flex: 1; background: transparent; border: 1px solid var(--border-input); border-radius: 12px; padding: 12px 4px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 900; color: var(--primary); line-height: 1;">${displayDays}</div>
                    <div style="font-size: 9px; color: var(--text-sub); font-weight: 800; text-transform: uppercase; margin-top: 6px;">Days in App</div>
                </div>
                <div style="flex: 1; background: transparent; border: 1px solid var(--border-input); border-radius: 12px; padding: 12px 4px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 900; color: var(--primary); line-height: 1;">${displaySent}</div>
                    <div style="font-size: 9px; color: var(--text-sub); font-weight: 800; text-transform: uppercase; margin-top: 6px;">Sent</div>
                </div>
                <div style="flex: 1; background: transparent; border: 1px solid var(--border-input); border-radius: 12px; padding: 12px 4px; text-align: center;">
                    <div style="font-size: 18px; font-weight: 900; color: var(--primary); line-height: 1;">${displayCountries}</div>
                    <div style="font-size: 9px; color: var(--text-sub); font-weight: 800; text-transform: uppercase; margin-top: 6px;">Countries</div>
                </div>
            </div>
            
        </div>
  `;

  phoneFrame.appendChild(overlay);
};
// === 11. ПРОСМОТР АВАТАРКИ В ПОЛНОМ РАЗМЕРЕ ===
window.showLargeAvatar = function (content) {
  const phoneFrame = document.querySelector(".phone-frame") || document.body;

  // Создаем окно-оверлей
  const overlay = document.createElement("div");
  overlay.className = "custom-alert-overlay";
  overlay.style.zIndex = "9999999"; // Поверх всего (даже карточки профиля)
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.cursor = "pointer"; // Указываем, что можно кликнуть

  // Закрываем при клике куда угодно
  overlay.onclick = () => overlay.remove();

  // Задел на будущее: если когда-нибудь у ботов будут не эмодзи, а реальные фото-ссылки
  const isImage = content.startsWith("http") || content.startsWith("data:");

  // Формируем HTML (либо огромный кружок с эмодзи, либо тег <img>)
  const innerContent = isImage
    ? `<img src="${content}" style="width: 250px; height: 250px; border-radius: 50%; object-fit: cover; box-shadow: 0 15px 35px rgba(0,0,0,0.3); animation: alertPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">`
    : `<div style="width: 200px; height: 200px; background: var(--bg-flag-circle); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 100px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); animation: alertPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">${content}</div>`;

  // Вставляем только контент, без лишних надписей
  overlay.innerHTML = innerContent;

  phoneFrame.appendChild(overlay);
};

// ==========================================================================
// 🎮 СИСТЕМА ДУЭЛЕЙ (GEO QUIZ MULTIPLAYER)
// ==========================================================================

// Открываем окно выбора ставки
window.openDuelBetModal = function() {
  if (!currentActiveChatId) return;
  
  // Обновляем отображение баланса пользователя перед показом
  const balanceDisplay = document.getElementById('duel-balance-display');
  if (balanceDisplay && state) {
      balanceDisplay.textContent = state.energy + '⚡';
  }
  
  document.getElementById('modal-duel-bet').style.display = 'flex';
};

// Пользователь выбрал ставку и нажал на кнопку (10, 50 или 100)
// === ЗАПУСК ДУЭЛИ ===
window.initiateDuel = function(betAmount) {
  if (!state || state.energy < betAmount) {
      if (typeof showToastNotification === "function") showToastNotification("⚡ Not enough energy for this bet!");
      return;
  }
  document.getElementById('modal-duel-bet').style.display = 'none';

  // ЗАПУСКАЕМ ИГРУ ИЗ games.js
  if (typeof startDuelGame === "function") {
      startDuelGame(betAmount, currentActiveChatId);
  }
};

// === ОБРАБОТКА РЕЗУЛЬТАТОВ ИГРЫ ===
window.processDuelResult = function(finalDuelState) {
  const chat = state.chats[finalDuelState.chatId];
  const now = new Date();
  const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

  if (!finalDuelState.isOpponentTurn) {
      // МЫ БРОСИЛИ ВЫЗОВ (Сохраняем наш счет в секрете и отправляем в чат)
      const duelMsg = {
          type: 'duel',
          sender: 'me',
          time: timeStr,
          bet: finalDuelState.bet,
          questions: finalDuelState.questions, // Сохраняем "пакет" вопросов для оппонента
          playerScore: finalDuelState.score,
          playerTime: finalDuelState.totalTimeMs,
          status: 'pending' // Ждем, пока оппонент примет вызов
      };
      chat.messages.push(duelMsg);
  }

  renderMessages();
  if (typeof saveState === "function") saveState();
};

// === ЗАПУСК ИГРЫ ПРИ ПРИНЯТИИ ВЫЗОВА ===
window.acceptDuel = function(chatId, msgIndex) {
  const chat = state.chats[chatId];
  const msg = chat.messages[msgIndex];

  if (!state || state.energy < msg.bet) {
      if (typeof showToastNotification === "function") showToastNotification("⚡ Not enough energy to accept!");
      return;
  }

  // Запоминаем, какой вызов мы сейчас играем
  window.currentActiveDuelMsgIndex = msgIndex;

  if (typeof startDuelGame === "function") {
      // Запускаем игру, подсовывая ТЕ ЖЕ САМЫЕ вопросы!
      startDuelGame(msg.bet, chatId, msg.questions);
  }
};

// === ОБРАБОТКА РЕЗУЛЬТАТОВ ИГРЫ ===
window.processDuelResult = function(finalDuelState) {
  const chat = state.chats[finalDuelState.chatId];
  const now = new Date();
  const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

  if (!finalDuelState.isOpponentTurn) {
      // 1. МЫ БРОСИЛИ ВЫЗОВ (Мы - Инициатор)
      const duelMsg = {
          type: 'duel',
          sender: 'me',
          time: timeStr,
          bet: finalDuelState.bet,
          questions: finalDuelState.questions,
          playerScore: finalDuelState.score,
          playerTime: finalDuelState.totalTimeMs,
          status: 'pending'
      };
      chat.messages.push(duelMsg);
      
      // 🤖 МАГИЯ: Заставляем бота "сыграть" против нас через 5-8 секунд
      const msgIndex = chat.messages.length - 1;
      setTimeout(() => {
          simulateBotDuelResponse(finalDuelState.chatId, msgIndex);
      }, 5000 + Math.random() * 3000);

  } else {
      // 2. МЫ ПРИНЯЛИ ВЫЗОВ ОППОНЕНТА (Мы - Респондер)
      const msgIndex = window.currentActiveDuelMsgIndex;
      const msg = chat.messages[msgIndex];

      msg.opponentScore = finalDuelState.score; 
      msg.opponentTime = finalDuelState.totalTimeMs;
      msg.status = 'completed';

      // КТО ПОБЕДИЛ?
      let iWon = false;
      let isTie = false;

      if (msg.opponentScore > msg.playerScore) {
          iWon = true; // Мы набрали больше очков
      } else if (msg.opponentScore === msg.playerScore) {
          if (msg.opponentTime < msg.playerTime) iWon = true; // При ничьей - мы были быстрее!
          else if (msg.opponentTime === msg.playerTime) isTie = true; // Абсолютная магия
      }

      if (isTie) {
          state.energy += msg.bet; // Возврат только нашей ставки
          msg.winner = 'tie';
          if (typeof showToastNotification === "function") showToastNotification("🤝 Tie! Energy refunded.");
      } else if (iWon) {
          state.energy += (msg.bet * 2); // Забираем банк!
          msg.winner = 'responder';
          if (typeof showToastNotification === "function") showToastNotification(`🏆 You won! +${msg.bet * 2}⚡`);
      } else {
          msg.winner = 'initiator'; // Победил тот, кто бросал вызов
          if (typeof showToastNotification === "function") showToastNotification("💔 You lost... Better luck next time!");
      }

      window.currentActiveDuelMsgIndex = null;
      const energyEl = document.getElementById('energy-display');
      if(energyEl) energyEl.textContent = state.energy + '⚡';
  }

  renderMessages();
  if (typeof saveState === "function") saveState();
};

// === 🤖 АВТОМАТИЧЕСКАЯ ИГРА БОТА ===
window.simulateBotDuelResponse = function(chatId, msgIndex) {
  const chat = state.chats[chatId];
  if (!chat || !chat.messages[msgIndex]) return;
  const msg = chat.messages[msgIndex];
  if (msg.status !== 'pending') return;

  // Бот "поиграл" (набирает от 5 до 9 очков, тратит от 12 до 35 секунд)
  msg.opponentScore = Math.floor(Math.random() * 5) + 5; 
  msg.opponentTime = 12000 + Math.random() * 23000; 
  msg.status = 'completed';

  let botWon = false;
  let isTie = false;

  // Сравниваем результаты бота с нашими
  if (msg.opponentScore > msg.playerScore) {
      botWon = true;
  } else if (msg.opponentScore === msg.playerScore) {
      if (msg.opponentTime < msg.playerTime) botWon = true;
      else if (msg.opponentTime === msg.playerTime) isTie = true;
  }

  // Расчет банка
  if (isTie) {
      state.energy += msg.bet; // Нам возвращается наша ставка
      msg.winner = 'tie';
      if (currentActiveChatId === chatId && typeof showToastNotification === "function") showToastNotification(`🤝 ${chat.name} tied with you! Energy refunded.`);
  } else if (botWon) {
      msg.winner = 'responder'; // Бот победил
      if (currentActiveChatId === chatId && typeof showToastNotification === "function") showToastNotification(`💀 ${chat.name} beat your score! You lost ${msg.bet}⚡`);if (currentActiveChatId === chatId && typeof showToastNotification === "function") showToastNotification(`💔 ${chat.name} beat your score! You lost ${msg.bet}⚡`);
  } else {
      msg.winner = 'initiator'; // Мы победили бота
      state.energy += (msg.bet * 2); // Забираем двойной куш!
      if (currentActiveChatId === chatId && typeof showToastNotification === "function") showToastNotification(`🏆 You defeated ${chat.name}! +${msg.bet * 2}⚡`);
  }

  const energyEl = document.getElementById('energy-display');
  if(energyEl) energyEl.textContent = state.energy + '⚡';

  if (currentActiveChatId === chatId) renderMessages();
  if (typeof saveState === "function") saveState();
};
// === ЗАПУСК БЕСПЛАТНОЙ ТРЕНИРОВКИ ИЗ ЧАТА ===
window.startPracticeMode = function() {
  // Прячем модалку
  document.getElementById('modal-duel-bet').style.display = 'none';
  // Запускаем старый добрый Quiz (мы его сейчас переделаем под тренировку)
  if (typeof startQuizGame === "function") {
      startQuizGame();
  }
};
// === ЛОГИКА МЕНЮ СКРЕПКИ В ЧАТЕ ===
document.addEventListener("DOMContentLoaded", () => {
  const attachBtn = document.getElementById("btn-chat-attach");
  const attachMenu = document.getElementById("attachment-menu");
  const sharedGalleryBtn = document.getElementById("btn-shared-gallery");
  const sendPhotoBtn = document.getElementById("btn-send-photo");
  const photoInput = document.getElementById("photo-input");

  if (attachBtn && attachMenu) {
      // 1. Открытие и закрытие меню по клику на саму скрепку
      attachBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (attachMenu.style.display === "none" || attachMenu.style.display === "") {
              attachMenu.style.display = "block";
          } else {
              attachMenu.style.display = "none";
          }
      });

      // 2. Закрытие меню, если кликнули куда угодно мимо него
      document.addEventListener("click", (e) => {
          if (attachMenu.style.display === "block" && !attachMenu.contains(e.target) && e.target !== attachBtn) {
              attachMenu.style.display = "none";
          }
      });
  }

  // 3. Клик по кнопке "Postcards"
  if (sharedGalleryBtn) {
      sharedGalleryBtn.addEventListener("click", () => {
          attachMenu.style.display = "none";
          if (typeof window.showSharedGallery === "function") {
              window.showSharedGallery(); 
          }
      });
  }

  // 4. Клик по кнопке "Photo" (НОВОЕ!)
  if (sendPhotoBtn && photoInput) {
      sendPhotoBtn.addEventListener("click", () => {
          attachMenu.style.display = "none"; // Прячем меню
          photoInput.click(); // Имитируем клик по скрытому инпуту для выбора файлов
      });

      // Когда юзер выбрал фотку из галереи
      photoInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (!file) return;

          // Используем наш умный компрессор из script.js (сжимаем до 600px)
          if (typeof compressImage === "function") {
              compressImage(file, 600, (compressedBase64) => {
                  sendPhotoMessage(compressedBase64);
              });
          }
          
          // Очищаем инпут, чтобы можно было выбрать это же фото еще раз
          photoInput.value = "";
      });
  }
});

// === ФУНКЦИЯ СОХРАНЕНИЯ ФОТО-СООБЩЕНИЯ ===
window.sendPhotoMessage = function(base64Image) {
    if (!currentActiveChatId) return;

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

    // Добавляем сообщение с новым типом "photo"
    state.chats[currentActiveChatId].messages.push({
        sender: "me",
        type: "photo", // Важный флаг!
        photoUrl: base64Image,
        time: timeStr,
    });

    if (typeof saveState === "function") saveState();
    renderMessages(); // Перерисовываем чат

    // Заставляем бота мило отреагировать на твое фото через 2 секунды
    setTimeout(() => {
         if (typeof receiveMessage === "function") {
             receiveMessage(currentActiveChatId, "Wow, what a beautiful photo! 😍");
         }
    }, 2000);
};

// === ФУНКЦИЯ ПОКАЗА ОБЩИХ ОТКРЫТОК В ЧАТЕ (СТРОГО ПО ID + НАТИВНАЯ ГАЛЕРЕЯ) ===
window.showSharedGallery = function() {
  // 1. Берем ID текущего чата напрямую из глобальной переменной (самый надежный способ)
  const partnerId = currentActiveChatId;
  if (!partnerId) return;

  const chat = state.chats[partnerId];
  const partnerName = chat ? chat.name : "Partner";

  // 2. СТРОГИЙ ПОИСК ТОЛЬКО ПО УНИКАЛЬНОМУ ID
  const sentCards = (state.sentPostcards || []).map((card, index) => ({...card, originalIndex: index, isSent: true}))
      .filter(card => card.targetId === partnerId);

  const receivedCards = (state.receivedPostcards || []).map((card, index) => ({...card, originalIndex: index, isSent: false}))
      .filter(card => card.senderId === partnerId);

  // Объединяем и сортируем по дате (самые свежие сверху)
  const allShared = [...sentCards, ...receivedCards].sort((a, b) => 
      (b.receivedAt || b.sentAt || 0) - (a.receivedAt || a.sentAt || 0)
  );

  // 3. ИСПОЛЬЗУЕМ РОДНУЮ МОДАЛКУ КОЛЛЕКЦИИ (Из script.js / index.html)
  const modal = document.getElementById("modal-gallery");
  const grid = document.getElementById("gallery-modal-grid");
  const title = document.getElementById("gallery-modal-title");

  if (!modal || !grid || !title) return;

  // Меняем заголовок окна под имя собеседника
  title.innerHTML = `📬 ${partnerName} Archive`;

  // Настраиваем сетку (как в Flag Collection)
  grid.className = "";
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(3, 1fr)";
  grid.style.gap = "12px";
  grid.style.alignContent = "start";
  grid.style.padding = "10px 5px"; // Воздух для пульсации

  if (allShared.length === 0) {
      grid.style.display = "block";
      grid.innerHTML = `<div style="text-align: center; color: var(--text-sub); padding: 40px 20px; font-size: 13px;">No postcards exchanged with this traveler yet.</div>`;
  } else {
      grid.style.display = "grid";
      grid.innerHTML = allShared.map(item => {
          const flag = item.countryFlag || item.flag || "🌍";
          const bgImg = item.frontImage ? `background-image: url(${item.frontImage});` : `background: #eee;`;
          
          // Определяем иконку: отправленная (📤) или полученная (📥)
          const icon = item.isSent ? "📤" : "📥";
          
          // Пульсация только для НОВЫХ полученных открыток
          const pulseClass = (!item.isSent && item.isNew) ? "card-pulse" : "";

          // Выводим карточку ТОЧНО в таком же формате, как и в главной коллекции
          return `
          <div class="archive-card ${pulseClass}" data-index="${item.originalIndex}" data-is-sent="${item.isSent}"
               style="${bgImg} background-size: cover; background-position: center; position: relative; cursor: pointer; aspect-ratio: 3/2; border-radius: 8px; border: 1px solid var(--border); box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              
              <div style="position: absolute; top: -6px; left: -6px; font-size: 12px; background: white; border-radius: 50%; padding: 4px; line-height: 1; box-shadow: 0 2px 5px rgba(0,0,0,0.15); z-index: 2;">${icon}</div>
              
              <div style="position: absolute; bottom: 3px; right: 3px; font-size: 11px; background: rgba(255,255,255,0.9); border-radius: 50%; padding: 2px; line-height: 1; box-shadow: 0 1px 3px rgba(0,0,0,0.2);">${flag}</div>
          </div>`;
      }).join("");
  }

  // Показываем родное окно поверх всего
  modal.style.setProperty("z-index", "9999999", "important");
  modal.style.display = "flex";
};
// ==========================================================================
// ГАЛЕРЕЯ: ПРОСМОТР ЧАТ-ФОТО ВО ВЕСЬ ЭКРАН (НОВОЕ!)
// ==========================================================================
window.showFullSizePhoto = function(base64Image) {
  const phoneFrame = document.querySelector(".phone-frame") || document.body;

  // Создаем оверлей (черный фон поверх всего)
  const overlay = document.createElement("div");
  overlay.className = "custom-alert-overlay";
  overlay.style.zIndex = "9999999"; // Самый высокий z-index
  overlay.style.cursor = "zoom-out"; // Показываем, что клик закроет

  // Закрываем по клику на фон
  overlay.onclick = () => overlay.remove();

  // Собираем HTML с картинкой
  // Мы ограничиваем максимальную ширину/высоту картинки, чтобы она не вылезала за экран
  overlay.innerHTML = `
      <div style="position: relative; max-width: 90%; max-height: 90%; display: flex; align-items: center; justify-content: center; animation: alertPop 0.3s ease;">
          <img src="${base64Image}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 12px; border: 3px solid white; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
          
          <div style="position: absolute; bottom: -25px; color: white; font-size: 11px; opacity: 0.7; font-weight: 600;"></div>
      </div>
  `;

  phoneFrame.appendChild(overlay);
};
// ==========================================================================
// ГАЛЕРЕЯ ОБЩИХ МЕДИА (ФОТО И ОТКРЫТКИ) ВНУТРИ ЧАТА
// ==========================================================================
window.showChatMediaGallery = function() {
  // 1. Проверяем, открыт ли какой-то чат
  if (!currentActiveChatId) return;
  
  const chat = state.chats[currentActiveChatId];
  const partnerName = chat ? chat.name : "Partner";
  const phoneFrame = document.querySelector(".phone-frame") || document.body;

  // 2. Собираем все фотографии из истории сообщений этого чата
  const photoMessages = (chat.messages || [])
      .filter(m => m.type === 'photo' && m.photoUrl)
      .map(m => ({ url: m.photoUrl, type: 'photo' }));

  // 3. Собираем все открытки, полученные от этого пользователя (по ID)
  const sharedPostcards = (state.receivedPostcards || [])
      .filter(p => p.senderId === currentActiveChatId)
      .map(p => ({ url: p.frontImage, type: 'postcard' }));

  // Объединяем их (сначала новые)
  const allMedia = [...photoMessages, ...sharedPostcards].reverse();

  // 4. Создаем окно галереи (используем твой стиль оверлея)
  const overlay = document.createElement("div");
  overlay.className = "custom-alert-overlay";
  overlay.id = "modal-chat-media";
  overlay.style.zIndex = "10000"; // Поверх шапки чата

  // Формируем сетку
  let gridHtml = '';
  if (allMedia.length === 0) {
      gridHtml = `
          <div style="text-align: center; color: var(--text-sub); padding: 40px 20px; font-size: 13px;">
              No photos or postcards shared yet. 📷
          </div>`;
  } else {
      gridHtml = `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; max-height: 400px; overflow-y: auto; padding: 5px;">`;
      allMedia.forEach(item => {
          gridHtml += `
              <div style="aspect-ratio: 1/1; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; background: var(--bg-input);" 
                   onclick="window.showFullSizePhoto('${item.url}')">
                  <img src="${item.url}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
              </div>
          `;
      });
      gridHtml += `</div>`;
  }

  overlay.innerHTML = `
      <div class="custom-alert-box" style="width: 90%; max-width: 340px;  padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div style="font-weight: 900; font-size: 18px; color: var(--text-title);">📬 ${partnerName} Media</div>
              <div style="cursor: pointer; font-size: 20px; color: var(--text-sub);" onclick="document.getElementById('modal-chat-media').remove()">✕</div>
          </div>
          
          ${gridHtml}
          
          
      </div>
  `;

  phoneFrame.appendChild(overlay);
};