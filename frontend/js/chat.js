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

    if (typeof showToastNotification === "function") {
      showToastNotification(`💬 New chat unlocked with ${botName}!`);
    }
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
              No active chats yet.<br>Send or receive postcards to unlock!
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
function renderMessages() {
  const container = document.getElementById("chat-messages-container");
  if (!container || !currentActiveChatId) return;

  const chat = state.chats[currentActiveChatId];

  container.innerHTML = chat.messages
    .map((msg, index) => {
      const isMine = msg.sender === "me";
      const bubbleClass = isMine ? "mine" : "theirs";

      // === НОВАЯ ЛОГИКА: ВИДЖЕТ ДУЭЛИ ===
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
            // РЕНДЕР ФИНАЛЬНОГО РЕЗУЛЬТАТА
            const myScore = isMine ? msg.playerScore : msg.opponentScore;
            const myTime = isMine ? msg.playerTime : msg.opponentTime;
            
            const theirScore = isMine ? msg.opponentScore : msg.playerScore;
            const theirTime = isMine ? msg.opponentTime : msg.playerTime;

            let didIWin = false;
              let isTie = msg.winner === 'tie';
              if (isMine && msg.winner === 'initiator') didIWin = true;
              if (!isMine && msg.winner === 'responder') didIWin = true;

              const resultColor = isTie ? "#f39c12" : (didIWin ? "#27ae60" : "#e74c3c");
              
              // Умный заголовок с правильным отображением баланса
              let headerText = "";
              if (isTie) {
                  headerText = `🤝 TIE (+${msg.bet} ⚡)`; // Возврат ставки
              } else if (didIWin) {
                  headerText = `🏆 YOU WON (+${msg.bet * 2} ⚡)`; // Забрали банк
              } else {
                  headerText = `💔 YOU LOST (-${msg.bet} ⚡)`; // Потеряли только свою ставку
              }
              
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

      // === СТАРАЯ ЛОГИКА ДЛЯ ОБЫЧНЫХ ТЕКСТОВЫХ СООБЩЕНИЙ ===
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
  const tagsHtml = chat.profile.interests
    .map(
      (tag) =>
        `<span style="background: var(--primary); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">#${tag}</span>`,
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

  // === КОМПАКТНЫЙ ДИЗАЙН КАРТОЧКИ ===
  overlay.innerHTML = `
        <div class="custom-alert-box" style="text-align: left; padding: 20px 15px;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div onclick="showLargeAvatar('${avatarFace}')" style="cursor: pointer; font-size: 26px; background: var(--bg-flag-circle); border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05); overflow: hidden;">
                        ${renderAvatarHTML(avatarFace)}
                    </div>
                    <div>
                        <div style="font-weight: 900; font-size: 16px; color: var(--text-main); line-height: 1.1;">${chat.name} <span style="font-size: 12px; margin-left: 4px;">${chat.flag}</span></div>
                        <div style="font-size: 11px; color: #27ae60; font-weight: bold;">Online</div>
                    </div>
                </div>
                <button onclick="this.closest('.custom-alert-overlay').remove()" style="background: var(--bg-element); border: 1px solid var(--border); border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; color: var(--text-main); cursor: pointer; font-weight: bold; flex-shrink: 0;">✕</button>
            </div>

            <div style="font-size: 13px; color: var(--text-main); font-style: italic; line-height: 1.4; margin-bottom: 10px; background: var(--bg-input); padding: 10px; border-radius: 12px; border: 1px dashed var(--border);">
                "${chat.profile.bio}"
            </div>

            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 15px;">
                ${tagsHtml}
            </div>

            <div style="display: flex; gap: 6px; justify-content: space-between;">
                <div style="flex: 1; background: var(--bg-input); border: 1px solid var(--border-input); border-radius: 8px; padding: 8px 4px; text-align: center;">
                    <div style="font-size: 15px; font-weight: 900; color: var(--primary); line-height: 1;">${displayDays}</div>
                    <div style="font-size: 8px; color: var(--text-sub); font-weight: bold; text-transform: uppercase; margin-top: 4px;">Days in App</div>
                </div>
                <div style="flex: 1; background: var(--bg-input); border: 1px solid var(--border-input); border-radius: 8px; padding: 8px 4px; text-align: center;">
                    <div style="font-size: 15px; font-weight: 900; color: var(--primary); line-height: 1;">${displaySent}</div>
                    <div style="font-size: 8px; color: var(--text-sub); font-weight: bold; text-transform: uppercase; margin-top: 4px;">Sent</div>
                </div>
                <div style="flex: 1; background: var(--bg-input); border: 1px solid var(--border-input); border-radius: 8px; padding: 8px 4px; text-align: center;">
                    <div style="font-size: 15px; font-weight: 900; color: var(--primary); line-height: 1;">${displayCountries}</div>
                    <div style="font-size: 8px; color: var(--text-sub); font-weight: bold; text-transform: uppercase; margin-top: 4px;">Countries</div>
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