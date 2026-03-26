// ==========================================================================
// ПОЧТОВОЕ ОБЛАКО И ОФФЛАЙН РЕЖИМ
// ==========================================================================

const CloudSystem = {
    bioTemplates: [
        "Hi! I'm passionate about {int1} and {int2}. I would love to receive a postcard showing {int3}!",
        "Greetings from {country}! I spend my free time enjoying {int1}. Surprise me with a beautiful postcard!",
        "Postcrossing is my favorite hobby! I love learning about {int1} and {int2}.",
        "Hello! Please send me something related to {int3} or {int2}. Happy postcrossing! ✨",
        "I'm a huge fan of {int1}! If you can generate a postcard with that, it would make my day! 🌍"
    ],

    // Форматируем профиль пользователя для выдачи
    formatUser: function(targetUser) {
        const interestsPool = typeof AVAILABLE_INTERESTS !== "undefined" ? AVAILABLE_INTERESTS : ["Travel", "Photography", "Vintage", "Space", "Coffee", "Nature", "Art", "Mountains"];
        
        let shuffledInterests = [...interestsPool].sort(() => 0.5 - Math.random());
        let selectedInterests = shuffledInterests.slice(0, 3);

        let rawBio = this.bioTemplates[Math.floor(Math.random() * this.bioTemplates.length)];
        let bio = rawBio
            .replace('{int1}', selectedInterests[0].toLowerCase())
            .replace('{int2}', selectedInterests[1].toLowerCase())
            .replace('{int3}', selectedInterests[2].toLowerCase())
            .replace('{country}', targetUser.countryName || targetUser.country || "my country");

        return {
            targetId: targetUser.userId || targetUser.id || targetUser.name, 
            displayId: 'PJ-' + Math.floor(1000 + Math.random() * 9000), 
            name: targetUser.name,
            country: targetUser.countryName || targetUser.country,
            flag: targetUser.flag,
            interests: selectedInterests,
            bio: bio
        };
    },

    // ГЛАВНАЯ ФУНКЦИЯ: Выдает сразу двух кандидатов по правилам!
    getTwoProfiles: function() {
        if (!state.contactedUsers) state.contactedUsers = [];
        let poolOfUsers = state.bots; 

        // 1. Ищем тех, кому еще НЕ отправляли
        let availableUsers = poolOfUsers.filter(user => {
            const uniqueId = user.userId || user.id || user.name; 
            return !state.contactedUsers.includes(uniqueId);
        });

        let user1, user2;

        if (availableUsers.length >= 2) {
            // УСЛОВИЕ 1: Есть минимум 2 новых человека. Берем их!
            user1 = availableUsers.splice(Math.floor(Math.random() * availableUsers.length), 1)[0];
            user2 = availableUsers.splice(Math.floor(Math.random() * availableUsers.length), 1)[0];
        
        } else if (availableUsers.length === 1) {
            // УСЛОВИЕ 2: Остался всего 1 новый. 
            user1 = availableUsers[0]; // Забираем его
            
            state.contactedUsers = []; // Запускаем новый круг!
            console.log("Круг пройден! Список получателей обнулен.");
            
            // Берем второго из старых (но следим, чтобы это не был тот же самый user1)
            let newPool = poolOfUsers.filter(u => (u.userId || u.id || u.name) !== (user1.userId || user1.id || user1.name));
            user2 = newPool[Math.floor(Math.random() * newPool.length)];
        
        } else {
            // КРАЙНИЙ СЛУЧАЙ: Новых 0. Обнуляем память и берем двух случайных
            state.contactedUsers = [];
            console.log("Круг пройден! Список получателей обнулен.");
            
            let newPool = [...poolOfUsers];
            user1 = newPool.splice(Math.floor(Math.random() * newPool.length), 1)[0];
            user2 = newPool.splice(Math.floor(Math.random() * newPool.length), 1)[0];
        }

        return [this.formatUser(user1), this.formatUser(user2)];
    }
};

window.updateCloudScreenUI = function() {
    const title = document.getElementById("cloud-title");
    const desc = document.getElementById("cloud-desc");
    const btn = document.getElementById("btn-pull-address");
    const offlineBanner = document.getElementById("offline-banner");

    if (!title || !desc || !btn) return;

    if (!state.bots || state.bots.length === 0) {
        title.innerText = "Personal Collection 🗂️";
        desc.innerHTML = "Create a beautiful postcard for your own archive. No recipient needed.";
        btn.innerHTML = "🎨 Create Postcard (-1 Postcard)";
        if (offlineBanner) offlineBanner.style.display = "block";
    } else {
        const activeOutgoing = state.tracking ? state.tracking.filter(item => item.type === "outgoing").length : 0;
        
        title.innerText = "Who is next?";
        desc.innerHTML = `Pull a random address from the PostJourney Cloud and discover a new friend's interests!<br><br><span style="color: #d35400; font-weight: bold; font-size: 12px; background: #ffeebd; padding: 4px 8px; border-radius: 8px; display: inline-block; margin-top: 5px;">🛫 Traveling limit: ${activeOutgoing} / 10</span>`;
        btn.innerHTML = "✉️ Pull Address (-1 Postcard)";
        if (offlineBanner) offlineBanner.style.display = "none";
    }
};

window.resetCloudScreen = function() {
    document.getElementById("btn-pull-address").style.display = "block";
    document.getElementById("pulled-profile-container").style.display = "none";
    document.getElementById("postcard-constructor-section").style.display = "none";
    state.currentTarget = null;
    updateCloudScreenUI(); 
};

document.addEventListener("DOMContentLoaded", () => {
    updateCloudScreenUI(); 

    const btnPull = document.getElementById("btn-pull-address");
    const profileContainer = document.getElementById("pulled-profile-container");
    const constructorSection = document.getElementById("postcard-constructor-section");

    if (btnPull) {
        btnPull.onclick = () => {
            if (state.postcards <= 0) {
                return showToastNotification("📮 Out of postcards! Visit the Shop or wait for tomorrow's daily refill.");
            }

            if (!state.bots || state.bots.length === 0) {
                state.currentTarget = "offline";
                document.getElementById("cloud-address-section").style.display = "none";
                constructorSection.style.display = "block";
                setTimeout(() => constructorSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                return;
            }

            const activeOutgoing = state.tracking ? state.tracking.filter(item => item.type === "outgoing").length : 0;
            if (activeOutgoing >= 10) {
                return showToastNotification("✈️ Travel limit reached (10/10)! Wait for some postcards to be delivered.");
            }

            // === ГЕНЕРИРУЕМ 2 РАЗНЫХ ПРОФИЛЯ ===
            const [target1, target2] = CloudSystem.getTwoProfiles();
            
            btnPull.style.display = "none";
            const cloudDesc = document.getElementById("cloud-desc");
            if (cloudDesc) cloudDesc.style.display = "none";
            const limitBadge = document.querySelector("#cloud-address-section > div[style*='display: inline-flex']");
            if (limitBadge) limitBadge.style.display = "none"; 

            // === ФУНКЦИЯ ДЛЯ ОТРИСОВКИ КОМПАКТНОЙ КАРТОЧКИ (С BIO) ===
            const createCompactCard = (target, index) => {
                const tagsHtml = (target.interests || []).slice(0, 3).map(tag =>
                    `<span style="background: transparent; color: var(--text-sub); border: 1px solid var(--border); padding: 3px 10px; border-radius: 12px; font-size: 10px; font-weight: 600;">${tag}</span>`
                ).join("");

                const avatarFace = typeof window.getBotAvatar === "function" ? window.getBotAvatar(target.name) : target.flag;
                const avatarContent = avatarFace.startsWith("http") 
                    ? `<img src="${avatarFace}" style="width:100%;height:100%;object-fit:cover;">` 
                    : avatarFace;

                const bioHtml = target.bio ? `
                    <div style="font-size: 11px; color: var(--text-sub); line-height: 1.4; margin-bottom: 12px; padding: 0 5px; font-style: italic;">
                        "${target.bio.length > 80 ? target.bio.substring(0, 77) + '...' : target.bio}"
                    </div>
                ` : '';

                return `
                    <div style="background: var(--bg-card); border-radius: 16px; padding: 16px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid var(--border); position: relative; animation: fadeIn 0.4s ease;">
                        <div style="width: 60px; height: 60px; margin: 0 auto 8px auto; font-size: 28px; background: var(--bg-flag-circle); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px solid var(--bg-body);">
                            ${avatarContent}
                        </div>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px;">
                            <span style="font-size: 18px; font-weight: 900; color: var(--text-title); line-height: 1;">${target.name}</span>
                            <span style="padding: 2px 6px; font-size: 10px; background: transparent; color: var(--text-sub); border: 1px solid var(--border); border-radius: 10px; font-weight: 700;">${target.flag}</span>
                        </div>
                        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; margin-bottom: 12px;">
                            ${tagsHtml}
                        </div>
                        
                        ${bioHtml}

                        <button id="btn-select-target-${index}" class="primary-button" style="width: 100%; padding: 10px; font-size: 14px; font-weight: 800; background: #e78564; border: none; border-radius: 12px; color: white; display: flex; align-items: center; justify-content: center; gap: 6px;">
                            🎨 Choose
                        </button>
                    </div>
                `;
            };

            // === ВСТАВЛЯЕМ 2 КАРТОЧКИ И ТЕКСТ ВЫБОРА НА ЭКРАН ===
            profileContainer.innerHTML = `
                <div style="text-align: center; margin-bottom: 12px; font-weight: 800; color: var(--text-main); font-size: 15px; margin-top: 5px;">
                    Choose your recipient 👇
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    ${createCompactCard(target1, 1)}
                    
                    <div style="text-align: center; font-size: 11px; font-weight: 900; color: var(--text-sub); text-transform: uppercase;">— OR —</div>
                    
                    ${createCompactCard(target2, 2)}
                </div>
            `;
            
            profileContainer.style.display = "block";
            
            // === ОБРАБОТКА ВЫБОРА (Клик по одной из кнопок "Choose") ===
            const handleSelection = (selectedTarget) => {
                state.currentTarget = selectedTarget; // Запоминаем того, кого выбрали!
                
                document.getElementById("cloud-address-section").style.display = "none";
                constructorSection.style.display = "block";
                
                // === УСЛОВИЕ 3: БЛОКИРУЕМ ПУТЬ НАЗАД ===
                const cancelBtn = document.getElementById("cancel-card-btn");
                if (cancelBtn) cancelBtn.style.display = "none";
                // =======================================

                const reminderName = document.getElementById("reminder-name");
                const reminderFlag = document.getElementById("reminder-flag");
                const reminderBanner = document.getElementById("target-reminder-banner");
                if (reminderName && reminderFlag && reminderBanner) {
                    reminderName.textContent = selectedTarget.name;
                    reminderFlag.textContent = selectedTarget.flag;
                    reminderBanner.style.display = "block";
                }

                if (typeof updateDisplay === "function") updateDisplay();
                setTimeout(() => constructorSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            };

            // Вешаем слушатели на кнопки
            document.getElementById("btn-select-target-1").onclick = () => handleSelection(target1);
            document.getElementById("btn-select-target-2").onclick = () => handleSelection(target2);
        };
    }
});