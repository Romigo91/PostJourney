// ==========================================================================
// CHAT & AI SYSTEM
// ==========================================================================

let currentActiveChatId = null;


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



