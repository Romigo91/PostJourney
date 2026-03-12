// ==========================================================================
// CHAT & AI SYSTEM
// ==========================================================================

let currentActiveChatId = null;

// === 1. РАЗБЛОКИРОВКА НОВОГО ЧАТА ===
// Эту функцию мы будем вызывать из script.js, когда открытка доставлена или открыта
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

    // Отрисовываем чаты
    container.innerHTML = chatKeys.map(key => {
        const chat = state.chats[key];
        const lastMsg = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Tap to chat...";
        
        const unreadDot = chat.hasUnread ? '<div style="width: 10px; height: 10px; background: #e74c3c; border-radius: 50%; margin-right: 10px;"></div>' : '';
        const msgColor = chat.hasUnread ? '#e74c3c' : 'var(--text-sub)';
        const msgWeight = chat.hasUnread ? 'bold' : 'normal';

        return `
        <div class="chat-list-item" onclick="openChat('${chat.id}')">
            <div style="font-size: 28px;">${chat.flag}</div>
            <div style="flex: 1; overflow: hidden;">
                <div style="font-weight: 800; color: var(--text-main); font-size: 14px;">${chat.name}</div>
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
    
    // === СНИМАЕМ СТАТУС НЕПРОЧИТАННОГО ===
    chat.hasUnread = false;
    updateChatBadge();
    // =====================================
    
    document.getElementById('chat-list-view').style.display = 'none';
// ...
    document.getElementById('active-chat-view').style.display = 'flex';
    
    document.getElementById('active-chat-avatar').textContent = chat.flag;
    document.getElementById('active-chat-name').textContent = chat.name;
    
    renderMessages();
};

window.closeChat = function() {
    currentActiveChatId = null;
    document.getElementById('chat-list-view').style.display = 'block';
    document.getElementById('active-chat-view').style.display = 'none';
    renderChatList(); // Обновляем превью последних сообщений
};

// === 4. РЕНДЕР СООБЩЕНИЙ ===
function renderMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container || !currentActiveChatId) return;

    const chat = state.chats[currentActiveChatId];
    
    container.innerHTML = chat.messages.map(msg => {
        const isMine = msg.sender === 'me';
        const bubbleClass = isMine ? 'mine' : 'theirs';
        return `
            <div class="chat-bubble ${bubbleClass}">
                ${msg.text}
                <div class="chat-time">${msg.time}</div>
            </div>
        `;
    }).join('');

    // Автоскролл вниз, чтобы всегда видеть последнее сообщение
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 50);
}

// === 5. ОТПРАВКА СООБЩЕНИЯ (ЮЗЕР) ===
window.handleSendMessage = function() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (!text || !currentActiveChatId) return;

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    // Сохраняем наше сообщение в state
    state.chats[currentActiveChatId].messages.push({
        sender: 'me',
        text: text,
        time: timeStr
    });

    input.value = '';
    renderMessages();
    if (typeof saveState === 'function') saveState();

    // === ТРИГГЕР ДЛЯ ИСКУССТВЕННОГО ИНТЕЛЛЕКТА ===
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
    
    // Пытаемся отрендерить список чатов при старте (с небольшой задержкой, чтобы state загрузился)
    setTimeout(() => {
        renderChatList();
        updateChatBadge(); // <--- ДОБАВИЛИ СЮДА
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
        renderMessages(); // Если мы прямо сейчас в этом чате - обновляем экран
    } else {
        state.chats[botId].hasUnread = true; // <--- ПОМЕЧАЕМ ЧАТ КАК НЕПРОЧИТАННЫЙ
        renderChatList(); // Иначе обновляем превью в списке
    }
    
    updateChatBadge(); // <--- ОБНОВЛЯЕМ ЦИФРУ НАД МЕНЮ
    if (typeof saveState === 'function') saveState();
}

// === 7. 🤖 МОДУЛЬ AI (ИНТЕГРАЦИЯ С POLLINATIONS) ===
async function generateAIResponse(botId, userText) {
    const chat = state.chats[botId];
    const API_KEY = 'sk_pnErfGbnDfLxDEytQqoAc0iioMQrgJl8'; // Твой ключ API
    
    // Меняем статус на "Typing..."
    const statusEl = document.getElementById('active-chat-status');
    if (statusEl) statusEl.textContent = "typing...";

    try {
        // 1. Формируем историю сообщений для контекста
        // Берем последние 8 сообщений, чтобы бот помнил контекст, но мы не тратили лишние токены
        const recentMessages = chat.messages.slice(-8).map(msg => ({
            role: msg.sender === 'me' ? 'user' : 'assistant',
            content: msg.text
        }));

        // Если в объекте чата хранится страна (botCountry), используем её, иначе берем флаг и имя.
        // Допустим, при создании чата ты передаешь страну как chat.country, если нет - опираемся на флаг.
        const botCountry = chat.country || chat.flag;

        // 2. Создаем системный промпт (задаем личность бота)
        const systemPrompt = {
            role: 'system',
            content: `You are a friendly local from ${botCountry}. Your name is ${chat.name}. You are chatting in a postcard exchange app with a user who sent/received a postcard from you. 
            Rules:
            - Keep your answers short, friendly, and natural (like SMS/messenger format).
            - Add a little bit of your local cultural flavor or national emojis.
            - Do not write long essays. Max 2-3 short sentences.
            - Communicate in English unless the user speaks another language.`
        };

        // Собираем итоговый массив: Инструкция + История сообщений (включая последнее от юзера)
        // Примечание: userText уже добавлен в chat.messages в функции handleSendMessage, 
        // поэтому он уже есть в recentMessages.
        const apiMessages = [systemPrompt, ...recentMessages];

        // 3. Отправляем запрос к API (формат совместим с OpenAI)
        const response = await fetch('https://gen.pollinations.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gemini-search',
                messages: apiMessages,
                max_tokens: 150,     // Ограничиваем длину ответа
                temperature: 0.7     // 0.7 дает баланс между логикой и креативностью
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Детали ошибки API:", errText);
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();
        
        // 4. Достаем текст ответа и отправляем в чат
        const botReply = data.choices[0].message.content;
        receiveMessage(botId, botReply);

    } catch (error) {
        console.error("Ошибка при генерации AI-ответа:", error);
        // Заглушка на случай, если пропал интернет или API лежит
        receiveMessage(botId, "Sorry, my internet connection is a bit unstable right now! 🌍 Give me a second.");
    } finally {
        // Возвращаем статус Online
        if (statusEl) statusEl.textContent = "Online";
    }
}
// === 8. ОБНОВЛЕНИЕ БЕЙДЖА НЕПРОЧИТАННЫХ СООБЩЕНИЙ ===
window.updateChatBadge = function() {
    if (!state.chats) return;
    
    const badge = document.getElementById('chat-badge');
    if (!badge) return;

    let unreadChatsCount = 0;
    
    // Перебираем все чаты и ищем флаг hasUnread
    Object.values(state.chats).forEach(chat => {
        if (chat.hasUnread) {
            unreadChatsCount++;
        }
    });

    if (unreadChatsCount > 0) {
        badge.textContent = unreadChatsCount;
        badge.style.display = 'flex'; // Показываем кружочек
    } else {
        badge.style.display = 'none'; // Прячем, если всё прочитано
    }
};