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

    generateProfile: function() {
        // Берем случайного бота ИЗ НАШЕЙ СГЕНЕРИРОВАННОЙ БАЗЫ
        const targetBot = state.bots[Math.floor(Math.random() * state.bots.length)];

        let shuffledInterests = [...AVAILABLE_INTERESTS].sort(() => 0.5 - Math.random());
        let selectedInterests = shuffledInterests.slice(0, 3);

        let rawBio = this.bioTemplates[Math.floor(Math.random() * this.bioTemplates.length)];
        let bio = rawBio
            .replace('{int1}', selectedInterests[0].toLowerCase())
            .replace('{int2}', selectedInterests[1].toLowerCase())
            .replace('{int3}', selectedInterests[2].toLowerCase())
            .replace('{country}', targetBot.countryName);

        return {
            userId: 'PJ-' + Math.floor(1000 + Math.random() * 9000),
            name: targetBot.name,
            country: targetBot.countryName,
            flag: targetBot.flag,
            // Город удален
            interests: selectedInterests,
            bio: bio
        };
    }
};

// Обновление интерфейса в зависимости от наличия ботов
window.updateCloudScreenUI = function() {
    const title = document.getElementById("cloud-title");
    const desc = document.getElementById("cloud-desc");
    const btn = document.getElementById("btn-pull-address");
    const offlineBanner = document.getElementById("offline-banner");

    if (!title || !desc || !btn) return;

    if (!state.bots || state.bots.length === 0) {
        // === ОФФЛАЙН РЕЖИМ ===
        title.innerText = "Personal Collection 🗂️";
        desc.innerText = "Create a beautiful postcard for your own archive. No recipient needed.";
        btn.innerHTML = "🎨 Create Postcard (-1 Postcard)";
        if (offlineBanner) offlineBanner.style.display = "block";
    } else {
        // === ОНЛАЙН РЕЖИМ ===
        title.innerText = "Who is next?";
        desc.innerText = "Pull a random address from the PostJourney Cloud and discover a new friend's interests!";
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
                return showAppAlert("You don't have any blank postcards left! ✉️<br>Check the Travel Shop.");
            }

            if (!state.bots || state.bots.length === 0) {
                // В ОФФЛАЙНЕ ПРОСТО ОТКРЫВАЕМ КОНСТРУКТОР
                state.currentTarget = "offline";
                btnPull.style.display = "none";
                profileContainer.style.display = "none"; 
                constructorSection.style.display = "block";
                setTimeout(() => constructorSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                return;
            }

            // В ОНЛАЙНЕ - ВЫТЯГИВАЕМ АДРЕС И ПРОВЕРЯЕМ ЛИМИТЫ
            const activeOutgoing = state.tracking ? state.tracking.filter(item => item.type === "outgoing").length : 0;
            if (activeOutgoing >= 5) {
                return showAppAlert("Limit reached! ✈️<br>You already have 5 postcards traveling. Wait for them to be delivered.");
            }

            const target = CloudSystem.generateProfile();
            state.currentTarget = target; 
            btnPull.style.display = "none";

            profileContainer.innerHTML = `
                <div style="background: #fff5eb; border: 2px dashed #d35400; border-radius: 12px; padding: 15px; position: relative;">
                    <div style="position: absolute; top: -10px; left: 15px; background: #d35400; color: white; padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: bold;">
                        Your Destination
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; margin-top: 5px;">
                        <div>
                            <div style="font-weight: 900; font-size: 16px; color: #333;">${target.name}</div>
                            <div style="font-size: 12px; color: #555;">${target.flag} ${target.country}</div>
                        </div>
                        <div style="font-size: 28px;">${target.flag}</div>
                    </div>
                    <div style="font-size: 13px; color: #444; font-style: italic; margin-bottom: 10px; line-height: 1.4;">
                        "${target.bio}"
                    </div>
                    <div style="display: flex; gap: 5px; flex-wrap: wrap;">
                        ${target.interests.map(tag => `<span style="background: #e67e22; color: white; padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold;">#${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            profileContainer.style.display = "block";
            constructorSection.style.display = "block";
            setTimeout(() => constructorSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        };
    }
});