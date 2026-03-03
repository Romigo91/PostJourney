// ==========================================================================
// ПОЧТОВОЕ ОБЛАКО (МАЧМЕЙКИНГ И ПРОФИЛИ ПОЛУЧАТЕЛЕЙ)
// ==========================================================================

const CloudSystem = {
    // База шаблонов для биографий
    bioTemplates: [
        "Hi! I'm passionate about {int1} and {int2}. I would love to receive a postcard showing {int3}!",
        "Greetings from {country}! I spend my free time enjoying {int1}. Surprise me with a beautiful postcard!",
        "Postcrossing is my favorite hobby! I love learning about {int1} and {int2}.",
        "Hello! Please send me something related to {int3} or {int2}. Happy postcrossing! ✨",
        "I'm a huge fan of {int1}! If you can generate a postcard with that, it would make my day! 🌍"
    ],

    generateProfile: function() {
        const allCountries = typeof countryList !== 'undefined' ? countryList : [{flag: '🌍', name: 'Unknown', city: 'Capital'}];
        const botNames = ["Traveler", "PostX", "Nomad", "Wanderlust", "GlobeTrotter", "StampLover", "MailBird", "LetterFan", "PostcardKing", "PenPal", "OceanView", "MountainPeak"];
        
        const randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
        const nameBase = botNames[Math.floor(Math.random() * botNames.length)];
        const botName = `@${nameBase}_${Math.floor(Math.random() * 999)}`;

        let shuffledInterests = [...AVAILABLE_INTERESTS].sort(() => 0.5 - Math.random());
        let selectedInterests = shuffledInterests.slice(0, 3);

        let rawBio = this.bioTemplates[Math.floor(Math.random() * this.bioTemplates.length)];
        let bio = rawBio
            .replace('{int1}', selectedInterests[0].toLowerCase())
            .replace('{int2}', selectedInterests[1].toLowerCase())
            .replace('{int3}', selectedInterests[2].toLowerCase())
            .replace('{country}', randomCountry.name);

        return {
            userId: 'PJ-' + Math.floor(1000 + Math.random() * 9000),
            name: botName,
            country: randomCountry.name,
            flag: randomCountry.flag,
            city: randomCountry.city || "Capital",
            interests: selectedInterests,
            bio: bio
        };
    },

    pullAddress: function() {
        const activeOutgoing = state.tracking ? state.tracking.filter(item => item.type === "outgoing").length : 0;
        
        // Лимит: 5 открыток в пути
        if (activeOutgoing >= 5) {
            showAppAlert("Limit reached! ✈️<br>You already have 5 postcards traveling. Wait for them to be delivered.");
            return null;
        }

        if (state.postcards <= 0) {
            showAppAlert("You don't have any blank postcards left! ✉️<br>Check the Travel Shop.");
            return null;
        }

        const newTarget = this.generateProfile();
        state.currentTarget = newTarget; // Запоминаем цель
        return newTarget;
    }
};

// Функция для сброса экрана Create (вызывается после отправки открытки)
window.resetCloudScreen = function() {
    document.getElementById("btn-pull-address").style.display = "block";
    document.getElementById("pulled-profile-container").style.display = "none";
    document.getElementById("postcard-constructor-section").style.display = "none";
    state.currentTarget = null;
};

// Оживляем кнопку при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    const btnPull = document.getElementById("btn-pull-address");
    const profileContainer = document.getElementById("pulled-profile-container");
    const constructorSection = document.getElementById("postcard-constructor-section");

    if (btnPull) {
        btnPull.onclick = () => {
            const target = CloudSystem.pullAddress();
            if (!target) return; // Если сработал лимит, обрываем

            // Прячем кнопку "Pull"
            btnPull.style.display = "none";

            // Рисуем карточку получателя
            profileContainer.innerHTML = `
                <div style="background: #fff5eb; border: 2px dashed #d35400; border-radius: 12px; padding: 15px; position: relative;">
                    <div style="position: absolute; top: -10px; left: 15px; background: #d35400; color: white; padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: bold;">
                        Your Destination
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; margin-top: 5px;">
                        <div>
                            <div style="font-weight: 900; font-size: 16px; color: #333;">${target.name}</div>
                            <div style="font-size: 12px; color: #555;">${target.flag} ${target.country}, ${target.city}</div>
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

            // Показываем сам конструктор, чтобы юзер мог начать рисовать
            constructorSection.style.display = "block";
            
            // Прокручиваем страницу немного вниз к конструктору
            setTimeout(() => {
                constructorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        };
    }
});