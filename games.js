// ==========================================
// 1. ПОЛНАЯ БАЗА ДАННЫХ (195 стран + КОНТИНЕНТЫ)
// ==========================================
const countryList = [
    { name: "Afghanistan", flag: "🇦🇫", capital: "Kabul", continent: "Asia" }, { name: "Albania", flag: "🇦🇱", capital: "Tirana", continent: "Europe" }, { name: "Algeria", flag: "🇩🇿", capital: "Algiers", continent: "Africa" }, { name: "Andorra", flag: "🇦🇩", capital: "Andorra la Vella", continent: "Europe" }, { name: "Angola", flag: "🇦🇴", capital: "Luanda", continent: "Africa" },
    { name: "Antigua and Barbuda", flag: "🇦🇬", capital: "Saint John's", continent: "North America" }, { name: "Argentina", flag: "🇦🇷", capital: "Buenos Aires", continent: "South America" }, { name: "Armenia", flag: "🇦🇲", capital: "Yerevan", continent: "Asia" }, { name: "Australia", flag: "🇦🇺", capital: "Canberra", continent: "Oceania" }, { name: "Austria", flag: "🇦🇹", capital: "Vienna", continent: "Europe" },
    { name: "Azerbaijan", flag: "🇦🇿", capital: "Baku", continent: "Asia" }, { name: "Bahamas", flag: "🇧🇸", capital: "Nassau", continent: "North America" }, { name: "Bahrain", flag: "🇧🇭", capital: "Manama", continent: "Asia" }, { name: "Bangladesh", flag: "🇧🇩", capital: "Dhaka", continent: "Asia" }, { name: "Barbados", flag: "🇧🇧", capital: "Bridgetown", continent: "North America" },
    { name: "Belarus", flag: "🇧🇾", capital: "Minsk", continent: "Europe" }, { name: "Belgium", flag: "🇧🇪", capital: "Brussels", continent: "Europe" }, { name: "Belize", flag: "🇧🇿", capital: "Belmopan", continent: "North America" }, { name: "Benin", flag: "🇧🇯", capital: "Porto-Novo", continent: "Africa" }, { name: "Bhutan", flag: "🇧🇹", capital: "Thimphu", continent: "Asia" },
    { name: "Bolivia", flag: "🇧🇴", capital: "Sucre", continent: "South America" }, { name: "Bosnia and Herzegovina", flag: "🇧🇦", capital: "Sarajevo", continent: "Europe" }, { name: "Botswana", flag: "🇧🇼", capital: "Gaborone", continent: "Africa" }, { name: "Brazil", flag: "🇧🇷", capital: "Brasilia", continent: "South America" }, { name: "Brunei", flag: "🇧🇳", capital: "Bandar Seri Begawan", continent: "Asia" },
    { name: "Bulgaria", flag: "🇧🇬", capital: "Sofia", continent: "Europe" }, { name: "Burkina Faso", flag: "🇧🇫", capital: "Ouagadougou", continent: "Africa" }, { name: "Burundi", flag: "🇧🇮", capital: "Gitega", continent: "Africa" }, { name: "Cabo Verde", flag: "🇨🇻", capital: "Praia", continent: "Africa" }, { name: "Cambodia", flag: "🇰🇭", capital: "Phnom Penh", continent: "Asia" },
    { name: "Cameroon", flag: "🇨🇲", capital: "Yaounde", continent: "Africa" }, { name: "Canada", flag: "🇨🇦", capital: "Ottawa", continent: "North America" }, { name: "Central African Republic", flag: "🇨🇫", capital: "Bangui", continent: "Africa" }, { name: "Chad", flag: "🇹🇩", capital: "N'Djamena", continent: "Africa" }, { name: "Chile", flag: "🇨🇱", capital: "Santiago", continent: "South America" },
    { name: "China", flag: "🇨🇳", capital: "Beijing", continent: "Asia" }, { name: "Colombia", flag: "🇨🇴", capital: "Bogota", continent: "South America" }, { name: "Comoros", flag: "🇰🇲", capital: "Moroni", continent: "Africa" }, { name: "Congo", flag: "🇨🇬", capital: "Brazzaville", continent: "Africa" }, { name: "Costa Rica", flag: "🇨🇷", capital: "San Jose", continent: "North America" },
    { name: "Croatia", flag: "🇭🇷", capital: "Zagreb", continent: "Europe" }, { name: "Cuba", flag: "🇨🇺", capital: "Havana", continent: "North America" }, { name: "Cyprus", flag: "🇨🇾", capital: "Nicosia", continent: "Europe" }, { name: "Czech Republic", flag: "🇨🇿", capital: "Prague", continent: "Europe" }, { name: "Denmark", flag: "🇩🇰", capital: "Copenhagen", continent: "Europe" },
    { name: "Djibouti", flag: "🇩🇯", capital: "Djibouti", continent: "Africa" }, { name: "Dominica", flag: "🇩🇲", capital: "Roseau", continent: "North America" }, { name: "Dominican Republic", flag: "🇩🇴", capital: "Santo Domingo", continent: "North America" }, { name: "Ecuador", flag: "🇪🇨", capital: "Quito", continent: "South America" }, { name: "Egypt", flag: "🇪🇬", capital: "Cairo", continent: "Africa" },
    { name: "El Salvador", flag: "🇸🇻", capital: "San Salvador", continent: "North America" }, { name: "Equatorial Guinea", flag: "🇬🇶", capital: "Malabo", continent: "Africa" }, { name: "Eritrea", flag: "🇪🇷", capital: "Asmara", continent: "Africa" }, { name: "Estonia", flag: "🇪🇪", capital: "Tallinn", continent: "Europe" }, { name: "Eswatini", flag: "🇸🇿", capital: "Mbabane", continent: "Africa" },
    { name: "Ethiopia", flag: "🇪🇹", capital: "Addis Ababa", continent: "Africa" }, { name: "Fiji", flag: "🇫🇯", capital: "Suva", continent: "Oceania" }, { name: "Finland", flag: "🇫🇮", capital: "Helsinki", continent: "Europe" }, { name: "France", flag: "🇫🇷", capital: "Paris", continent: "Europe" }, { name: "Gabon", flag: "🇬🇦", capital: "Libreville", continent: "Africa" },
    { name: "Gambia", flag: "🇬🇲", capital: "Banjul", continent: "Africa" }, { name: "Georgia", flag: "🇬🇪", capital: "Tbilisi", continent: "Asia" }, { name: "Germany", flag: "🇩🇪", capital: "Berlin", continent: "Europe" }, { name: "Ghana", flag: "🇬🇭", capital: "Accra", continent: "Africa" }, { name: "Greece", flag: "🇬🇷", capital: "Athens", continent: "Europe" },
    { name: "Grenada", flag: "🇬🇩", capital: "Saint George's", continent: "North America" }, { name: "Guatemala", flag: "🇬🇹", capital: "Guatemala City", continent: "North America" }, { name: "Guinea", flag: "🇬🇳", capital: "Conakry", continent: "Africa" }, { name: "Guinea-Bissau", flag: "🇬🇼", capital: "Bissau", continent: "Africa" }, { name: "Guyana", flag: "🇬🇾", capital: "Georgetown", continent: "South America" },
    { name: "Haiti", flag: "🇭🇹", capital: "Port-au-Prince", continent: "North America" }, { name: "Honduras", flag: "🇭🇳", capital: "Tegucigalpa", continent: "North America" }, { name: "Hungary", flag: "🇭🇺", capital: "Budapest", continent: "Europe" }, { name: "Iceland", flag: "🇮🇸", capital: "Reykjavik", continent: "Europe" }, { name: "India", flag: "🇮🇳", capital: "New Delhi", continent: "Asia" },
    { name: "Indonesia", flag: "🇮🇩", capital: "Jakarta", continent: "Asia" }, { name: "Iran", flag: "🇮🇷", capital: "Tehran", continent: "Asia" }, { name: "Iraq", flag: "🇮🇶", capital: "Baghdad", continent: "Asia" }, { name: "Ireland", flag: "🇮🇪", capital: "Dublin", continent: "Europe" }, { name: "Israel", flag: "🇮🇱", capital: "Jerusalem", continent: "Asia" },
    { name: "Italy", flag: "🇮🇹", capital: "Rome", continent: "Europe" }, { name: "Jamaica", flag: "🇯🇲", capital: "Kingston", continent: "North America" }, { name: "Japan", flag: "🇯🇵", capital: "Tokyo", continent: "Asia" }, { name: "Jordan", flag: "🇯🇴", capital: "Amman", continent: "Asia" }, { name: "Kazakhstan", flag: "🇰🇿", capital: "Astana", continent: "Asia" },
    { name: "Kenya", flag: "🇰🇪", capital: "Nairobi", continent: "Africa" }, { name: "Kiribati", flag: "🇰🇮", capital: "Tarawa", continent: "Oceania" }, { name: "Korea, North", flag: "🇰🇵", capital: "Pyongyang", continent: "Asia" }, { name: "Korea, South", flag: "🇰🇷", capital: "Seoul", continent: "Asia" }, { name: "Kuwait", flag: "🇰🇼", capital: "Kuwait City", continent: "Asia" },
    { name: "Kyrgyzstan", flag: "🇰🇬", capital: "Bishkek", continent: "Asia" }, { name: "Laos", flag: "🇱🇦", capital: "Vientiane", continent: "Asia" }, { name: "Latvia", flag: "🇱🇻", capital: "Riga", continent: "Europe" }, { name: "Lebanon", flag: "🇱🇧", capital: "Beirut", continent: "Asia" }, { name: "Lesotho", flag: "🇱🇸", capital: "Maseru", continent: "Africa" },
    { name: "Liberia", flag: "🇱🇷", capital: "Monrovia", continent: "Africa" }, { name: "Libya", flag: "🇱🇾", capital: "Tripoli", continent: "Africa" }, { name: "Liechtenstein", flag: "🇱🇮", capital: "Vaduz", continent: "Europe" }, { name: "Lithuania", flag: "🇱🇹", capital: "Vilnius", continent: "Europe" }, { name: "Luxembourg", flag: "🇱🇺", capital: "Luxembourg", continent: "Europe" },
    { name: "Madagascar", flag: "🇲🇬", capital: "Antananarivo", continent: "Africa" }, { name: "Malawi", flag: "🇲🇼", capital: "Lilongwe", continent: "Africa" }, { name: "Malaysia", flag: "🇲🇾", capital: "Kuala Lumpur", continent: "Asia" }, { name: "Maldives", flag: "🇲🇻", capital: "Male", continent: "Asia" }, { name: "Mali", flag: "🇲🇱", capital: "Bamako", continent: "Africa" },
    { name: "Malta", flag: "🇲🇹", capital: "Valletta", continent: "Europe" }, { name: "Marshall Islands", flag: "🇲🇭", capital: "Majuro", continent: "Oceania" }, { name: "Mauritania", flag: "🇲🇷", capital: "Nouakchott", continent: "Africa" }, { name: "Mauritius", flag: "🇲🇺", capital: "Port Louis", continent: "Africa" }, { name: "Mexico", flag: "🇲🇽", capital: "Mexico City", continent: "North America" },
    { name: "Micronesia", flag: "🇫🇲", capital: "Palikir", continent: "Oceania" }, { name: "Moldova", flag: "🇲🇩", capital: "Chisinau", continent: "Europe" }, { name: "Monaco", flag: "🇲🇨", capital: "Monaco", continent: "Europe" }, { name: "Mongolia", flag: "🇲🇳", capital: "Ulaanbaatar", continent: "Asia" }, { name: "Montenegro", flag: "🇲🇪", capital: "Podgorica", continent: "Europe" },
    { name: "Morocco", flag: "🇲🇦", capital: "Rabat", continent: "Africa" }, { name: "Mozambique", flag: "🇲🇿", capital: "Maputo", continent: "Africa" }, { name: "Myanmar", flag: "🇲🇲", capital: "Naypyidaw", continent: "Asia" }, { name: "Namibia", flag: "🇳🇦", capital: "Windhoek", continent: "Africa" }, { name: "Nauru", flag: "🇳🇷", capital: "Yaren", continent: "Oceania" },
    { name: "Nepal", flag: "🇳🇵", capital: "Kathmandu", continent: "Asia" }, { name: "Netherlands", flag: "🇳🇱", capital: "Amsterdam", continent: "Europe" }, { name: "New Zealand", flag: "🇳🇿", capital: "Wellington", continent: "Oceania" }, { name: "Nicaragua", flag: "🇳🇮", capital: "Managua", continent: "North America" }, { name: "Niger", flag: "🇳🇪", capital: "Niamey", continent: "Africa" },
    { name: "Nigeria", flag: "🇳🇬", capital: "Abuja", continent: "Africa" }, { name: "North Macedonia", flag: "🇲🇰", capital: "Skopje", continent: "Europe" }, { name: "Norway", flag: "🇳🇴", capital: "Oslo", continent: "Europe" }, { name: "Oman", flag: "🇴🇲", capital: "Muscat", continent: "Asia" }, { name: "Pakistan", flag: "🇵🇰", capital: "Islamabad", continent: "Asia" },
    { name: "Palau", flag: "🇵🇼", capital: "Ngerulmud", continent: "Oceania" }, { name: "Panama", flag: "🇵🇦", capital: "Panama City", continent: "North America" }, { name: "Papua New Guinea", flag: "🇵🇬", capital: "Port Moresby", continent: "Oceania" }, { name: "Paraguay", flag: "🇵🇾", capital: "Asuncion", continent: "South America" }, { name: "Peru", flag: "🇵🇪", capital: "Lima", continent: "South America" },
    { name: "Philippines", flag: "🇵🇭", capital: "Manila", continent: "Asia" }, { name: "Poland", flag: "🇵🇱", capital: "Warsaw", continent: "Europe" }, { name: "Portugal", flag: "🇵🇹", capital: "Lisbon", continent: "Europe" }, { name: "Qatar", flag: "🇶🇦", capital: "Doha", continent: "Asia" }, { name: "Romania", flag: "🇷🇴", capital: "Bucharest", continent: "Europe" },
    { name: "Russia", flag: "🇷🇺", capital: "Moscow", continent: "Europe" }, { name: "Rwanda", flag: "🇷🇼", capital: "Kigali", continent: "Africa" }, { name: "Saint Kitts and Nevis", flag: "🇰🇳", capital: "Basseterre", continent: "North America" }, { name: "Saint Lucia", flag: "🇱🇨", capital: "Castries", continent: "North America" }, { name: "Saint Vincent and the Grenadines", flag: "🇻🇨", capital: "Kingstown", continent: "North America" },
    { name: "Samoa", flag: "🇼🇸", capital: "Apia", continent: "Oceania" }, { name: "San Marino", flag: "🇸🇲", capital: "San Marino", continent: "Europe" }, { name: "Sao Tome and Principe", flag: "🇸🇹", capital: "Sao Tome", continent: "Africa" }, { name: "Saudi Arabia", flag: "🇸🇦", capital: "Riyadh", continent: "Asia" }, { name: "Senegal", flag: "🇸🇳", capital: "Dakar", continent: "Africa" },
    { name: "Serbia", flag: "🇷🇸", capital: "Belgrade", continent: "Europe" }, { name: "Seychelles", flag: "🇸🇨", capital: "Victoria", continent: "Africa" }, { name: "Sierra Leone", flag: "🇸🇱", capital: "Freetown", continent: "Africa" }, { name: "Singapore", flag: "🇸🇬", capital: "Singapore", continent: "Asia" }, { name: "Slovakia", flag: "🇸🇰", capital: "Bratislava", continent: "Europe" },
    { name: "Slovenia", flag: "🇸🇮", capital: "Ljubljana", continent: "Europe" }, { name: "Solomon Islands", flag: "🇸🇧", capital: "Honiara", continent: "Oceania" }, { name: "Somalia", flag: "🇸🇴", capital: "Mogadishu", continent: "Africa" }, { name: "South Africa", flag: "🇿🇦", capital: "Pretoria", continent: "Africa" }, { name: "South Sudan", flag: "🇸🇸", capital: "Juba", continent: "Africa" },
    { name: "Spain", flag: "🇪🇸", capital: "Madrid", continent: "Europe" }, { name: "Sri Lanka", flag: "🇱🇰", capital: "Colombo", continent: "Asia" }, { name: "Sudan", flag: "🇸🇩", capital: "Khartoum", continent: "Africa" }, { name: "Suriname", flag: "🇸🇷", capital: "Paramaribo", continent: "South America" }, { name: "Sweden", flag: "🇸🇪", capital: "Stockholm", continent: "Europe" },
    { name: "Switzerland", flag: "🇨🇭", capital: "Bern", continent: "Europe" }, { name: "Syria", flag: "🇸🇾", capital: "Damascus", continent: "Asia" }, { name: "Tajikistan", flag: "🇹🇯", capital: "Dushanbe", continent: "Asia" }, { name: "Tanzania", flag: "🇹🇿", capital: "Dodoma", continent: "Africa" }, { name: "Thailand", flag: "🇹🇭", capital: "Bangkok", continent: "Asia" },
    { name: "Timor-Leste", flag: "🇹🇱", capital: "Dili", continent: "Asia" }, { name: "Togo", flag: "🇹🇬", capital: "Lome", continent: "Africa" }, { name: "Tonga", flag: "🇹🇴", capital: "Nuku'alofa", continent: "Oceania" }, { name: "Trinidad and Tobago", flag: "🇹🇹", capital: "Port of Spain", continent: "North America" }, { name: "Tunisia", flag: "🇹🇳", capital: "Tunis", continent: "Africa" },
    { name: "Turkey", flag: "🇹🇷", capital: "Ankara", continent: "Asia" }, { name: "Turkmenistan", flag: "🇹🇲", capital: "Ashgabat", continent: "Asia" }, { name: "Tuvalu", flag: "🇹🇻", capital: "Funafuti", continent: "Oceania" }, { name: "Uganda", flag: "🇺🇬", capital: "Kampala", continent: "Africa" }, { name: "Ukraine", flag: "🇺🇦", capital: "Kyiv", continent: "Europe" },
    { name: "United Arab Emirates", flag: "🇦🇪", capital: "Abu Dhabi", continent: "Asia" }, { name: "United Kingdom", flag: "🇬🇧", capital: "London", continent: "Europe" }, { name: "USA", flag: "🇺🇸", capital: "Washington, D.C.", continent: "North America" }, { name: "Uruguay", flag: "🇺🇾", capital: "Montevideo", continent: "South America" }, { name: "Uzbekistan", flag: "🇺🇿", capital: "Tashkent", continent: "Asia" },
    { name: "Vanuatu", flag: "🇻🇺", capital: "Port Vila", continent: "Oceania" }, { name: "Vatican City", flag: "🇻🇦", capital: "Vatican City", continent: "Europe" }, { name: "Venezuela", flag: "🇻🇪", capital: "Caracas", continent: "South America" }, { name: "Vietnam", flag: "🇻🇳", capital: "Hanoi", continent: "Asia" }, { name: "Yemen", flag: "🇾🇪", capital: "Sana'a", continent: "Asia" },
    { name: "Zambia", flag: "🇿🇲", capital: "Lusaka", continent: "Africa" }, { name: "Zimbabwe", flag: "🇿🇼", capital: "Harare", continent: "Africa" }
];

// УНИКАЛЬНОЕ ИМЯ для Сортировщика Почты (чтобы не конфликтовать со script.js)
const SORTER_COUNTRIES = {
    "Europe": ["🇫🇷 France", "🇩🇪 Germany", "🇮🇹 Italy", "🇪🇸 Spain", "🇬🇧 UK", "🇵🇱 Poland", "🇸🇪 Sweden", "🇨🇭 Switzerland", "🇳🇱 Netherlands"],
    "Asia": ["🇯🇵 Japan", "🇨🇳 China", "🇮🇳 India", "🇰🇷 South Korea", "🇹🇭 Thailand", "🇻🇳 Vietnam", "🇹🇷 Turkey", "🇮🇩 Indonesia"],
    "Africa": ["🇪🇬 Egypt", "🇿🇦 South Africa", "🇳🇬 Nigeria", "🇰🇪 Kenya", "🇲🇦 Morocco", "🇩🇿 Algeria"],
    "North America": ["🇺🇸 USA", "🇨🇦 Canada", "🇲🇽 Mexico", "🇨🇺 Cuba", "🇯🇲 Jamaica"],
    "South America": ["🇧🇷 Brazil", "🇦🇷 Argentina", "🇨🇴 Colombia", "🇨🇱 Chile", "🇵🇪 Peru"],
    "Oceania": ["🇦🇺 Australia", "🇳🇿 New Zealand", "🇫🇯 Fiji"]
};


// ==========================================
// 2. УПРАВЛЕНИЕ ЭКРАНАМИ
// ==========================================
function backToGames() {
    document.getElementById('games-menu-list').style.display = 'block';
    document.getElementById('active-game-zone').style.display = 'none';
    document.getElementById('game-content').innerHTML = '';
}

// ==========================================
// 3. ИГРА 1: GEO QUIZ (ВИНТАЖНЫЙ ДИЗАЙН)
// ==========================================
let quizScore = 0;
let quizCombo = 0;

function startQuizGame() {
    document.getElementById('games-menu-list').style.display = 'none';
    document.getElementById('active-game-zone').style.display = 'block';
    
    const container = document.getElementById('game-content');
    
    // Рисуем новый винтажный интерфейс
    container.innerHTML = `
        <button onclick="backToGames()" class="back-link" style="background:none; border:none; color:#d35400; cursor:pointer; margin-bottom:15px; display:flex; align-items:center; gap:5px; font-weight:bold; font-size:14px; font-family:'Montserrat', sans-serif;">
            <span style="font-size: 18px;">🏷️</span> Back to Menu
        </button>
        
        <div class="quiz-game-wrapper" id="quiz-game-container">
            
            <div class="luggage-tags-container">
                <div class="luggage-tag">SCORE: <span id="quiz-score">0</span></div>
                <div class="luggage-tag combo">COMBO: <span id="quiz-combo">0</span>🔥</div>
            </div>

            <div id="quiz-question-area" class="vintage-stamp-card">
                <span class="stamp-decor decor-plane">✈️</span>
                <span class="stamp-decor decor-globe">🌍</span>
                
                <div id="quiz-question-content" style="z-index: 2;"></div>
            </div>
            
            <div id="quiz-options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 5px;"></div>
        </div>
    `;
    
    quizScore = 0;
    quizCombo = 0;
    nextQuizRound();
}

function nextQuizRound() {
    const correct = countryList[Math.floor(Math.random() * countryList.length)];
    const isFlagQuestion = Math.random() > 0.5; 
    
    let alternates;
    if (isFlagQuestion) {
        alternates = countryList.filter(c => c.name !== correct.name).sort(() => 0.5 - Math.random()).slice(0, 3);
    } else {
        alternates = countryList.filter(c => c.capital !== correct.capital).sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    
    const options = [correct, ...alternates].sort(() => 0.5 - Math.random());
    
    const questionCard = document.getElementById('quiz-question-area');
    const questionContent = document.getElementById('quiz-question-content');
    const grid = document.getElementById('quiz-options-grid');
    
    // Анимация появления новой марки
    questionCard.className = 'vintage-stamp-card';
    void questionCard.offsetWidth;
    questionCard.className = 'vintage-stamp-card slide-in';
    
    // Рисуем вопрос
    if (isFlagQuestion) {
        // Заметка: если ОС не поддерживает эмодзи флага (как на твоем скрине с "TO"), 
        // стилизация ниже сделает буквы красивыми и крупными.
        questionContent.innerHTML = `
            <div style="font-size: 90px; line-height: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); letter-spacing: -4px;">${correct.flag}</div>
            <p class="quiz-question-title">Which country?</p>
        `;
    } else {
        questionContent.innerHTML = `
            <div style="font-size: 40px; line-height: 1; margin-bottom: 5px; opacity: 0.8;">📍</div>
            <h2 style="margin: 0 0 5px 0; font-family: 'Playfair Display', serif; color: #3e2723; font-size: 26px;">${correct.name}</h2>
            <p class="quiz-question-title" style="margin:0;">What is the capital?</p>
        `;
    }
    
    grid.innerHTML = '';
    
    // Генерируем "деревянные" кнопки с ответами
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'wooden-stamp-btn';
        
        const answerText = isFlagQuestion ? opt.name : opt.capital;
        const correctAnswerText = isFlagQuestion ? correct.name : correct.capital;
        
        btn.innerText = answerText;
        
        btn.onclick = () => {
            const btns = grid.querySelectorAll('button');
            btns.forEach(b => b.style.pointerEvents = 'none'); 
            
            if (answerText === correctAnswerText) {
                // ПРАВИЛЬНО (Кнопка становится зеленой)
                btn.classList.add('correct');
                
                quizScore += 1;
                quizCombo += 1;
                
                let earnedEnergy = 5;
                if (quizCombo > 0 && quizCombo % 5 === 0) {
                    earnedEnergy += 15;
                    showFloatingText("COMBO! +" + earnedEnergy + "⚡", "#e67e22", "quiz-game-container");
                } else {
                    showFloatingText("+" + earnedEnergy + "⚡", "#27ae60", "quiz-game-container");
                }
                
                state.energy += earnedEnergy;
                const energyEl = document.getElementById('energy-display');
                if(energyEl) energyEl.textContent = state.energy;
                
                document.getElementById('quiz-score').innerText = quizScore;
                document.getElementById('quiz-combo').innerText = quizCombo;
            } else {
                // ОШИБКА (Кнопка краснеет, марка трясется)
                btn.classList.add('wrong');
                
                quizCombo = 0;
                document.getElementById('quiz-combo').innerText = "0";
                questionCard.classList.add('error-shake');
                
                // Подсвечиваем правильный ответ зеленым
                btns.forEach(b => {
                    if (b.innerText === correctAnswerText) {
                        b.classList.add('correct');
                    }
                });
            }
            setTimeout(nextQuizRound, 800);
        };
        grid.appendChild(btn);
    });
}

// ==========================================
// 5. ИГРА 2: POST OFFICE SORTER (ВИНТАЖНЫЙ ДИЗАЙН)
// ==========================================
let currentSorterContinent = "";
let sorterScore = 0;
let sorterCombo = 0;

function startSorterGame() {
    document.getElementById('games-menu-list').style.display = 'none';
    document.getElementById('active-game-zone').style.display = 'block';

    const container = document.getElementById('game-content');
    
    // ИСПРАВЛЕНИЕ: Добавили data-continent каждой кнопке, чтобы скрипт мог их находить
    container.innerHTML = `
        <button onclick="backToGames()" class="back-link" style="background:none; border:none; color:#d35400; cursor:pointer; margin-bottom:15px; display:flex; align-items:center; gap:5px; font-weight:bold; font-size:14px; font-family:'Montserrat', sans-serif;">
            <span style="font-size: 18px;">🏷️</span> Back to Menu
        </button>
        
        <div class="quiz-game-wrapper" id="sorter-game-container">
            <div class="luggage-tags-container">
                <div class="luggage-tag">SCORE: <span id="sorter-score">0</span></div>
                <div class="luggage-tag combo">COMBO: <span id="sorter-combo">0</span>🔥</div>
            </div>

            <div id="sorter-letter" class="vintage-stamp-card" style="margin-bottom: 20px; min-height: 140px; padding: 15px;">
                <span class="stamp-decor decor-plane">✉️</span>
                <div id="sorter-destination" style="z-index: 2;">Loading...</div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-bottom: 5px;">
                <button class="wooden-stamp-btn" data-continent="Europe" onclick="checkSorterBin('Europe', this)">Europe</button>
                <button class="wooden-stamp-btn" data-continent="Asia" onclick="checkSorterBin('Asia', this)">Asia</button>
                <button class="wooden-stamp-btn" data-continent="Africa" onclick="checkSorterBin('Africa', this)">Africa</button>
                <button class="wooden-stamp-btn" data-continent="North America" onclick="checkSorterBin('North America', this)">N. America</button>
                <button class="wooden-stamp-btn" data-continent="South America" onclick="checkSorterBin('South America', this)">S. America</button>
                <button class="wooden-stamp-btn" data-continent="Oceania" onclick="checkSorterBin('Oceania', this)">Oceania</button>
            </div>
        </div>
    `;
    
    sorterScore = 0;
    sorterCombo = 0;
    nextSorterLetter();
}

function nextSorterLetter() {
    const randomCountry = countryList[Math.floor(Math.random() * countryList.length)];
    currentSorterContinent = randomCountry.continent;
    
    const letter = document.getElementById('sorter-letter');
    
    // ИСПРАВЛЕНИЕ: Жестко сбрасываем цвета (зеленый/красный) от прошлого ответа
    letter.style.backgroundColor = '';
    letter.style.borderColor = '';
    
    letter.className = 'vintage-stamp-card'; 
    void letter.offsetWidth; 
    letter.className = 'vintage-stamp-card slide-in'; 
    
    document.getElementById('sorter-destination').innerHTML = `
        <div style="font-size: 50px; line-height: 1.1; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">${randomCountry.flag}</div>
        <div class="quiz-question-title" style="margin-top: 5px; font-size: 18px;">${randomCountry.name}</div>
    `;

    const btns = document.querySelectorAll('#sorter-game-container .wooden-stamp-btn');
    btns.forEach(b => {
        b.style.pointerEvents = 'auto';
        b.classList.remove('correct', 'wrong');
    });
}

function checkSorterBin(selectedContinent, btnElement) {
    const letter = document.getElementById('sorter-letter');
    const btns = document.querySelectorAll('#sorter-game-container .wooden-stamp-btn');
    
    // Блокируем кнопки
    btns.forEach(b => b.style.pointerEvents = 'none');
    
    if (selectedContinent === currentSorterContinent) {
        // === ПРАВИЛЬНЫЙ ОТВЕТ ===
        if(btnElement) btnElement.classList.add('correct'); 
        
        sorterScore += 1;
        sorterCombo += 1;
        
        let earnedEnergy = 5;
        if (sorterCombo > 0 && sorterCombo % 5 === 0) {
            earnedEnergy += 15;
            showFloatingText("COMBO! +" + earnedEnergy + "⚡", "#e67e22", "sorter-game-container");
        } else {
            showFloatingText("+" + earnedEnergy + "⚡", "#27ae60", "sorter-game-container");
        }
        
        state.energy += earnedEnergy;
        const energyEl = document.getElementById('energy-display');
        if(energyEl) energyEl.textContent = state.energy;
        
        document.getElementById('sorter-score').innerText = sorterScore;
        document.getElementById('sorter-combo').innerText = sorterCombo;
        
        // Карточка зеленеет
        letter.style.backgroundColor = '#e8f8f5';
        letter.style.borderColor = '#27ae60';
        
        setTimeout(() => {
            letter.className = 'vintage-stamp-card success-out';
            setTimeout(() => {
                nextSorterLetter(); // Сброс цветов теперь происходит внутри этой функции
            }, 600);
        }, 600);
        
    } else {
        // === НЕПРАВИЛЬНЫЙ ОТВЕТ ===
        if(btnElement) btnElement.classList.add('wrong'); 
        
        // Подсвечиваем правильную кнопку зеленым
        btns.forEach(b => {
            if (b.getAttribute('data-continent') === currentSorterContinent) {
                b.classList.add('correct');
            }
        });

        sorterCombo = 0; 
        document.getElementById('sorter-combo').innerText = "0";
        
        // ИСПРАВЛЕНИЕ: Карточка краснеет! 🔴
        letter.style.backgroundColor = '#fdedec';
        letter.style.borderColor = '#e74c3c';
        letter.className = 'vintage-stamp-card error-shake';

        setTimeout(nextSorterLetter, 600);
    }
}



function nextCustomsRound() {
    currentCustomsAnswer = Math.random() > 0.5;
    
    const actualCountry = countryList[Math.floor(Math.random() * countryList.length)];
    let displayCountry = actualCountry;

    if (!currentCustomsAnswer) {
        let wrongCountry;
        do {
            wrongCountry = countryList[Math.floor(Math.random() * countryList.length)];
        } while (wrongCountry.name === actualCountry.name);
        displayCountry = wrongCountry;
    }

    const content = document.getElementById('customs-content');
    const card = document.getElementById('customs-card');
    
    const oldStamps = card.querySelectorAll('.stamp-effect');
    oldStamps.forEach(stamp => stamp.remove());

    card.className = 'vintage-stamp-card';
    void card.offsetWidth;
    card.className = 'vintage-stamp-card slide-in';

    const isFlagQuestion = Math.random() > 0.5;

    if (isFlagQuestion) {
        content.innerHTML = `
            <div style="font-size: 70px; line-height: 1.1; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);">${actualCountry.flag}</div>
            <div style="font-size: 13px; color: var(--text-sub); margin-top: 5px; font-family: 'Montserrat', sans-serif;">This is the flag of</div>
            <div style="font-size: 22px; font-weight: 900; color: #3e2723; margin-top: 2px; font-family: 'Playfair Display', serif;">${displayCountry.name}</div>
        `;
    } else {
        content.innerHTML = `
            <div style="font-size: 22px; font-weight: 900; color: #3e2723; margin-bottom: 5px; font-family: 'Playfair Display', serif;">${actualCountry.name}</div>
            <div style="font-size: 13px; color: var(--text-sub); font-family: 'Montserrat', sans-serif;">Capital city is</div>
            <div style="font-size: 26px; font-weight: bold; color: #d35400; margin-top: 2px; font-family: 'Playfair Display', serif;">${displayCountry.capital}</div>
        `;
    }

    const btnReject = document.getElementById('btn-customs-reject');
    const btnApprove = document.getElementById('btn-customs-approve');
    
    btnReject.disabled = false;
    btnApprove.disabled = false;
    
    // Сбрасываем цвета кнопок
    btnReject.classList.remove('correct', 'wrong');
    btnApprove.classList.remove('correct', 'wrong');
}

function checkCustomsAnswer(playerAnswer, btnElement) {
    document.getElementById('btn-customs-reject').disabled = true;
    document.getElementById('btn-customs-approve').disabled = true;

    const card = document.getElementById('customs-card');
    const isCorrect = (playerAnswer === currentCustomsAnswer);

    const stamp = document.createElement('div');
    stamp.className = 'stamp-effect';

    if (isCorrect) {
        if(btnElement) btnElement.classList.add('correct'); // Красим нажатую кнопку в зеленый
        
        customsScore += 1;
        customsCombo += 1;
        
        let earnedEnergy = 5;
        if (customsCombo > 0 && customsCombo % 5 === 0) {
            earnedEnergy += 15;
            showFloatingText("COMBO! +" + earnedEnergy + "⚡", "#e67e22", "customs-game-container");
        } else {
            showFloatingText("+" + earnedEnergy + "⚡", "#27ae60", "customs-game-container");
        }
        
        state.energy += earnedEnergy;
        const energyEl = document.getElementById('energy-display');
        if(energyEl) energyEl.textContent = state.energy;
        
        document.getElementById('customs-score').innerText = customsScore;
        document.getElementById('customs-combo').innerText = customsCombo;

        stamp.classList.add('stamp-approve');
        stamp.innerText = playerAnswer ? "APPROVED" : "REJECTED";
        
    } else {
        if(btnElement) btnElement.classList.add('wrong'); // Красим нажатую кнопку в красный
        customsCombo = 0;
        document.getElementById('customs-combo').innerText = "0";
        card.classList.add('error-shake'); 

        stamp.classList.add('stamp-reject');
        stamp.innerText = "WRONG!";
    }

    card.appendChild(stamp);
    setTimeout(nextCustomsRound, 1000);
}

// Универсальный визуальный эффект добавления энергии (Оставляем без изменений)
function showFloatingText(text, color, targetContainerId = 'sorter-zone') {
    const zone = document.getElementById(targetContainerId);
    if (!zone) return;
    
    const floatEl = document.createElement('div');
    floatEl.className = 'energy-float';
    floatEl.innerText = text;
    floatEl.style.color = color;
    
    floatEl.style.left = (30 + Math.random() * 40) + '%';
    floatEl.style.top = '30%';
    
    zone.appendChild(floatEl);
    setTimeout(() => { floatEl.remove(); }, 800);
}