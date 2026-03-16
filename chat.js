// ==========================================================================
// CHAT & AI SYSTEM
// ==========================================================================

let currentActiveChatId = null;

// === 1. РАЗБЛОКИРОВКА НОВОГО ЧАТА ===
window.unlockChat = function(botId, botName, botFlag, botCountry) {
    if (!state.chats) state.chats = {};
    
    // Если чата еще нет, создаем его
    if (!state.chats[botId]) {
        state.chats[botId] = {
            id: botId,
            name: botName,
            flag: botFlag,
            country: botCountry,
            messages: []
        };
        
        // Бот может написать первым!
        setTimeout(() => {
            receiveMessage(botId, `Hello from ${botFlag}! I received your postcard, it's wonderful!`);
        }, 2000);
        
        if (typeof saveState === 'function') saveState();
        renderChatList();
        
        if (typeof showToastNotification === 'function') {
            showToastNotification(`💬 New chat unlocked with ${botName}!`);
        }
    }
};

// === 2. РЕНДЕР СПИСКА ЧАТОВ ===
window.renderChatList = function() {
    const container = document.getElementById('chat-list-container');
    if (!container || !state.chats) return;

    const chatKeys = Object.keys(state.chats);
    
    if (chatKeys.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: #aaa; padding: 20px 0; font-size: 14px;">
              No active chats yet.<br>Send or receive postcards to unlock!
            </div>`;
        return;
    }

    container.innerHTML = chatKeys.map(key => {
        const chat = state.chats[key];
        const lastMsg = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Tap to chat...";
        
        const unreadDot = chat.hasUnread ? '<div style="width: 10px; height: 10px; background: #e74c3c; border-radius: 50%; margin-right: 10px;"></div>' : '';
        const msgColor = chat.hasUnread ? '#e74c3c' : 'var(--text-sub)';
        const msgWeight = chat.hasUnread ? 'bold' : 'normal';

        // Получаем лицо бота
        const avatarFace = typeof window.getBotAvatar === 'function' ? window.getBotAvatar(chat.name) : chat.flag;

        return `
        <div class="chat-list-item" onclick="openChat('${chat.id}')">
            <div style="font-size: 26px; width: 45px; height: 45px; background: var(--bg-flag-circle); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">${avatarFace}</div>
            <div style="flex: 1; overflow: hidden; margin-left: 5px;">
                <div style="font-weight: 800; color: var(--text-main); font-size: 14px;">${chat.name} <span style="font-size: 12px; margin-left: 4px;">${chat.flag}</span></div>
                <div style="font-size: 12px; color: ${msgColor}; font-weight: ${msgWeight}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${lastMsg}</div>
            </div>
            ${unreadDot}
            <div style="font-size: 16px; color: var(--border);">›</div>
        </div>`;
    }).join('');
};

// === 3. ОТКРЫТИЕ И ЗАКРЫТИЕ ДИАЛОГА ===
window.openChat = function(botId) {
    currentActiveChatId = botId;
    const chat = state.chats[botId];
    
    chat.hasUnread = false;
    updateChatBadge();
    
    document.getElementById('chat-list-view').style.display = 'none';
    
    // Делаем сам контейнер чата "резиновым"
    const chatView = document.getElementById('active-chat-view');
    chatView.style.display = 'flex';
    chatView.style.flex = '1';
    
    const avatarFace = typeof window.getBotAvatar === 'function' ? window.getBotAvatar(chat.name) : chat.flag;
    document.getElementById('active-chat-avatar').textContent = avatarFace;
    document.getElementById('active-chat-name').innerHTML = `${chat.name} <span style="font-size: 12px; margin-left: 4px;">${chat.flag}</span>`;
    
    // Прячем меню
    const nav = document.querySelector('.bottom-nav');
    if (nav) nav.style.display = 'none'; 
    
    // 🛠 МАГИЯ ДЛЯ МОБИЛОК: Жестко растягиваем экран на всю высоту
    const chatScreen = document.querySelector('.screen[data-screen="chat"]');
    if (chatScreen) {
        chatScreen.style.setProperty('display', 'flex', 'important');
        chatScreen.style.setProperty('flex-direction', 'column', 'important');
        chatScreen.style.setProperty('height', '100%', 'important');
        chatScreen.style.setProperty('flex', '1', 'important'); // Заставляем вытянуться до самого низа
        chatScreen.style.setProperty('padding-bottom', '15px', 'important');
    }
    
    renderMessages();
};

window.closeChat = function() {
    currentActiveChatId = null;
    document.getElementById('chat-list-view').style.display = 'block';
    document.getElementById('active-chat-view').style.display = 'none';
    
    // Возвращаем меню
    const nav = document.querySelector('.bottom-nav');
    if (nav) nav.style.display = 'flex';
    
    // 🛠 Возвращаем экрану исходные стили
    const chatScreen = document.querySelector('.screen[data-screen="chat"]');
    if (chatScreen) {
        chatScreen.style.setProperty('display', 'block', 'important');
        chatScreen.style.removeProperty('flex-direction');
        chatScreen.style.removeProperty('height');
        chatScreen.style.removeProperty('flex');
        chatScreen.style.removeProperty('padding-bottom');
    }
    
    renderChatList(); 
};

// === 4. РЕНДЕР СООБЩЕНИЙ ===
function renderMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container || !currentActiveChatId) return;

    const chat = state.chats[currentActiveChatId];
    
    container.innerHTML = chat.messages.map((msg, index) => {
        const isMine = msg.sender === 'me';
        const bubbleClass = isMine ? 'mine' : 'theirs';
        
        // Текст для отображения (с учетом перевода)
        const displayText = msg.showTranslation && msg.translatedText ? msg.translatedText : msg.text;
        
        // Пометка о редактировании
        const editedMark = msg.edited ? `<span class="chat-edited-mark">(edited)</span>` : '';
        
        // Логика подсказок под сообщением
        let hintHtml = '';
        if (!isMine) {
            const hintText = msg.showTranslation ? "Tap to show original" : "Tap to translate";
            hintHtml = `<div class="chat-translate-hint">${hintText}</div>`;
        } else {
            hintHtml = `<div class="chat-edit-hint" onclick="startEditingMessage('${currentActiveChatId}', ${index})">Edit ✏️</div>`;
        }

        return `
            <div style="display: flex; flex-direction: column; align-items: ${isMine ? 'flex-end' : 'flex-start'}; margin-bottom: 5px;">
                <div class="chat-bubble ${bubbleClass}" ${!isMine ? `onclick="toggleTranslation('${currentActiveChatId}', ${index})"` : ''}>
                    ${displayText}
                    <div class="chat-time">${msg.time} ${editedMark}</div>
                </div>
                ${hintHtml}
            </div>
        `;
    }).join('');

    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}

// Переменная для хранения состояния редактирования
let currentlyEditingMsg = null; 

// Функция запуска редактирования
window.startEditingMessage = function(chatId, index) {
    const msg = state.chats[chatId].messages[index];
    const input = document.getElementById('chat-input');
    const sendBtn = document.querySelector('button[onclick="handleSendMessage()"]');

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
window.handleSendMessage = function() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    const sendBtn = document.querySelector('button[onclick="handleSendMessage()"]');
    
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
        input.value = '';
        
        // Возвращаем кнопку в исходное состояние
        if (sendBtn) {
            sendBtn.textContent = "Send";
            sendBtn.style.background = "var(--primary)";
        }

        renderMessages();
        if (typeof saveState === 'function') saveState();
        return; // ВАЖНО: Прерываем функцию
    }

    // === ЕСЛИ ЭТО НОВОЕ СООБЩЕНИЕ (Стандартная логика) ===
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    state.chats[currentActiveChatId].messages.push({
        sender: 'me',
        text: text,
        time: timeStr
    });

    input.value = '';
    renderMessages();
    if (typeof saveState === 'function') saveState();

    // Триггерим бота
    generateAIResponse(currentActiveChatId, text);
};

// Позволяем отправлять по кнопке Enter на клавиатуре
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chat-input');
    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') handleSendMessage();
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
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    state.chats[botId].messages.push({
        sender: 'bot',
        text: text,
        time: timeStr
    });

    if (currentActiveChatId === botId) {
        renderMessages(); 
    } else {
        state.chats[botId].hasUnread = true; 
        renderChatList(); 
    }
    
    updateChatBadge(); 
    if (typeof saveState === 'function') saveState();
}

// === 7. 🤖 МОДУЛЬ AI (ИНТЕГРАЦИЯ С POLLINATIONS) ===
async function generateAIResponse(botId, userText) {
    const chat = state.chats[botId];
    const API_KEY = 'sk_pnErfGbnDfLxDEytQqoAc0iioMQrgJl8'; 
    
    // Меняем статус на "Typing..."
    const statusEl = document.getElementById('active-chat-status');
    if (statusEl) statusEl.textContent = "typing...";

    try {
        const recentMessages = chat.messages.slice(-8).map(msg => ({
            role: msg.sender === 'me' ? 'user' : 'assistant',
            content: msg.text
        }));

        const botCountry = chat.country || chat.flag;

        const systemPrompt = {
            role: 'system',
            content: `You are a friendly local from ${botCountry}. Your name is ${chat.name}. You are chatting in a postcard exchange app with a user who sent/received a postcard from you. 
            Rules:
            - Keep your answers short, friendly, and natural (like SMS/messenger format).
            - Add a little bit of your local cultural flavor or national emojis.
            - Do not write long essays. Max 2-3 short sentences.
            - Communicate in English unless the user speaks another language.`
        };

        const apiMessages = [systemPrompt, ...recentMessages];

        const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gemini-search',
                messages: apiMessages,
                max_tokens: 150,     
                temperature: 0.7     
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Детали ошибки API:", errText);
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content;
        receiveMessage(botId, botReply);

    } catch (error) {
        console.error("Ошибка при генерации AI-ответа:", error);
        receiveMessage(botId, "Sorry, my internet connection is a bit unstable right now! 🌍 Give me a second.");
    } finally {
        if (statusEl) statusEl.textContent = "Online";
    }
}

// === 8. ОБНОВЛЕНИЕ БЕЙДЖА НЕПРОЧИТАННЫХ СООБЩЕНИЙ ===
window.updateChatBadge = function() {
    if (!state.chats) return;
    
    const badge = document.getElementById('chat-badge');
    if (!badge) return;

    let unreadChatsCount = 0;
    
    Object.values(state.chats).forEach(chat => {
        if (chat.hasUnread) {
            unreadChatsCount++;
        }
    });

    if (unreadChatsCount > 0) {
        badge.textContent = unreadChatsCount;
        badge.style.display = 'flex'; 
    } else {
        badge.style.display = 'none'; 
    }
};

// === 9. 🌐 МОДУЛЬ ПЕРЕВОДА СООБЩЕНИЙ ===
window.toggleTranslation = async function(chatId, msgIndex) {
    const msg = state.chats[chatId].messages[msgIndex];

    if (msg.showTranslation) {
        msg.showTranslation = false;
        renderMessages();
        if (typeof saveState === 'function') saveState();
        return;
    }

    if (msg.translatedText) {
        msg.showTranslation = true;
        renderMessages();
        if (typeof saveState === 'function') saveState();
        return;
    }

    const originalText = msg.text;
    msg.text = "Translating... ⏳";
    renderMessages();

    try {
        const targetLang = navigator.language || 'en';
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(originalText)}&langpair=autodetect|${targetLang}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data && data.responseData && data.responseData.translatedText) {
            msg.translatedText = data.responseData.translatedText;
            msg.showTranslation = true;
        } else {
            if (typeof showToastNotification === 'function') showToastNotification("⚠️ Translation failed.");
        }
    } catch (error) {
        console.error("Translation error:", error);
        if (typeof showToastNotification === 'function') showToastNotification("🌍 Network error during translation.");
    } finally {
        msg.text = originalText;
        renderMessages();
        if (typeof saveState === 'function') saveState();
    }
};

// === 10. ПРОФИЛЬ СОБЕСЕДНИКА ===
window.showChatUserProfile = function() {
    if (!currentActiveChatId) return;
    const chat = state.chats[currentActiveChatId];

    // 1. Генерируем БИО и ИНТЕРЕСЫ, если их еще нет
    if (!chat.profile) {
        const availableInterests = typeof AVAILABLE_INTERESTS !== 'undefined' ? AVAILABLE_INTERESTS : ["Travel", "Postcards", "Nature", "Art", "Books", "Music", "Photography", "History", "Coffee"];
        let shuffledInterests = [...availableInterests].sort(() => 0.5 - Math.random());
        let selectedInterests = shuffledInterests.slice(0, 3);

        const bioTemplates = [
            "Hi! I'm passionate about {int1} and {int2}. I would love to receive a postcard showing {int3}!",
            "Greetings from {country}! I spend my free time enjoying {int1}. Surprise me with a beautiful postcard!",
            "Postcrossing is my favorite hobby! I love learning about {int1} and {int2}.",
            "Hello! Please send me something related to {int3} or {int2}. Happy postcrossing! ✨",
            "I'm a huge fan of {int1}! If you can generate a postcard with that, it would make my day! 🌍"
        ];
        
        let rawBio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
        let bio = rawBio
            .replace('{int1}', selectedInterests[0].toLowerCase())
            .replace('{int2}', selectedInterests[1].toLowerCase())
            .replace('{int3}', selectedInterests[2].toLowerCase())
            .replace('{country}', chat.country || 'my country');

        chat.profile = {
            interests: selectedInterests,
            bio: bio
        };
        if (typeof saveState === 'function') saveState();
    }

    // === 2. ЧЕСТНЫЙ РАСЧЕТ СТАТИСТИКИ ===
    let displayDays = 1;
    let displaySent = 0;
    let displayCountries = 0;

    const installDate = localStorage.getItem('install_date');
    if (installDate) {
        const diffTime = Math.abs(new Date().getTime() - parseInt(installDate));
        displayDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    const bot = state.bots ? state.bots.find(b => b.userId === chat.id || b.name === chat.name) : null;
    
    if (chat.id === state.profile.userId || chat.name === state.profile.name) {
        const validSent = state.sentPostcards.filter(c => c.isOffline !== true && c.to && !c.to.toLowerCase().includes("personal"));
        displaySent = validSent.length;
        const uniqueCountries = new Set(validSent.map(c => c.countryFlag || c.flag));
        displayCountries = uniqueCountries.size;
    } 
    else if (bot) {
        displaySent = bot.sent || 0;
        displayCountries = bot.contactedCountries ? bot.contactedCountries.length : 0;
    } 
    else {
        displaySent = chat.profile.stats ? chat.profile.stats.sent : 0;
        displayCountries = chat.profile.stats ? chat.profile.stats.countries : 0;
    }

    chat.profile.stats = { sent: displaySent, countries: displayCountries };

    // 3. Генерируем HTML-теги для интересов
    const tagsHtml = chat.profile.interests.map(tag => 
        `<span style="background: var(--primary); color: white; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">#${tag}</span>`
    ).join('');

    // === ПОЛУЧАЕМ ЛИЦО БОТА ИЗ BOTS.JS ===
    const avatarFace = typeof window.getBotAvatar === 'function' ? window.getBotAvatar(chat.name) : chat.flag;

    // 4. Создаем и показываем модальное окно
    const phoneFrame = document.querySelector('.phone-frame') || document.body;
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    overlay.style.zIndex = '999999';

    // === КОМПАКТНЫЙ ДИЗАЙН КАРТОЧКИ ===
    overlay.innerHTML = `
        <div class="custom-alert-box" style="text-align: left; padding: 20px 15px;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div onclick="showLargeAvatar('${avatarFace}')" style="cursor: pointer; font-size: 26px; background: var(--bg-flag-circle); border-radius: 50%; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                        ${avatarFace}
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
window.showLargeAvatar = function(content) {
    const phoneFrame = document.querySelector('.phone-frame') || document.body;
    
    // Создаем окно-оверлей
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    overlay.style.zIndex = '9999999'; // Поверх всего (даже карточки профиля)
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.cursor = 'pointer'; // Указываем, что можно кликнуть
    
    // Закрываем при клике куда угодно
    overlay.onclick = () => overlay.remove();

    // Задел на будущее: если когда-нибудь у ботов будут не эмодзи, а реальные фото-ссылки
    const isImage = content.startsWith('http') || content.startsWith('data:');

    // Формируем HTML (либо огромный кружок с эмодзи, либо тег <img>)
    const innerContent = isImage 
        ? `<img src="${content}" style="width: 250px; height: 250px; border-radius: 50%; object-fit: cover; box-shadow: 0 15px 35px rgba(0,0,0,0.3); animation: alertPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">`
        : `<div style="width: 200px; height: 200px; background: var(--bg-flag-circle); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 100px; box-shadow: 0 15px 35px rgba(0,0,0,0.3); animation: alertPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);">${content}</div>`;

    // Вставляем только контент, без лишних надписей
    overlay.innerHTML = innerContent;
    
    phoneFrame.appendChild(overlay);
};