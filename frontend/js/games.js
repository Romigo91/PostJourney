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
// 3. ИГРА 1: GEO QUIZ (ЧИСТЫЙ ДИЗАЙН)
// ==========================================
let quizScore = 0;
let quizCombo = 0;

function startQuizGame() {
    document.getElementById('games-menu-list').style.display = 'none';
    document.getElementById('active-game-zone').style.display = 'block';
    
    const container = document.getElementById('game-content');
    
    // Рисуем новый чистый интерфейс в стиле приложения
    container.innerHTML = `
        <button onclick="backToGames()" class="back-link" style="background:none; border:none; color:var(--primary); cursor:pointer; margin-bottom:15px; display:flex; align-items:center; gap:5px; font-weight:bold; font-size:14px;">
            <span style="font-size: 18px;">⬅️</span> Back to Menu
        </button>
        
        <div id="quiz-game-container">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 0 5px;">
                <div style="font-size: 14px; font-weight: 800; color: var(--text-main);">SCORE: <span id="quiz-score" style="color: var(--primary);">0</span></div>
                <div style="font-size: 14px; font-weight: 800; color: var(--text-main);">COMBO: <span id="quiz-combo" style="color: #e74c3c;">0</span>🔥</div>
            </div>

            <div id="quiz-question-area">
                <div id="quiz-question-content" style="z-index: 2;"></div>
            </div>
            
            <div id="quiz-options-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding-top: 20px; padding-bottom: 5px;"></div>
        </div>
    `;
    
    quizScore = 0;
    quizCombo = 0;
    nextQuizRound();
}

function nextQuizRound() {
    // Выбираем случайную страну
    const correct = countryList[Math.floor(Math.random() * countryList.length)];
    
    // МАГИЯ: 0 = Флаги, 1 = Столицы, 2 = Континенты
    const questionType = Math.floor(Math.random() * 3); 
    
    let optionsStrings = []; // Здесь будут лежать 4 варианта ответов (текстом)
    let correctAnswerText = ""; // Правильный ответ (текстом)
    
    const questionCard = document.getElementById('quiz-question-area');
    const questionContent = document.getElementById('quiz-question-content');
    const grid = document.getElementById('quiz-options-grid');
    
    // Анимация появления новой карточки (без винтажных классов)
    questionCard.className = '';
    void questionCard.offsetWidth;
    questionCard.className = 'slide-in';
    
    if (questionType === 0) {
        // === 1. ВОПРОС ПРО ФЛАГ ===
        correctAnswerText = correct.name;
        // Ищем 3 случайные неправильные страны
        const alternates = countryList.filter(c => c.name !== correct.name).sort(() => 0.5 - Math.random()).slice(0, 3).map(c => c.name);
        optionsStrings = [correctAnswerText, ...alternates].sort(() => 0.5 - Math.random());
        
        questionContent.innerHTML = `
            <div style="font-size: 90px; line-height: 1.2; text-shadow: 0 4px 10px rgba(0,0,0,0.1);">${correct.flag}</div>
            <div class="quiz-question-title">Which country?</div>
        `;

    } else if (questionType === 1) {
        // === 2. ВОПРОС ПРО СТОЛИЦУ ===
        correctAnswerText = correct.capital;
        // Ищем 3 случайные неправильные столицы
        const alternates = countryList.filter(c => c.capital !== correct.capital).sort(() => 0.5 - Math.random()).slice(0, 3).map(c => c.capital);
        optionsStrings = [correctAnswerText, ...alternates].sort(() => 0.5 - Math.random());
        
        questionContent.innerHTML = `
            <div style="font-size: 40px; line-height: 1; margin-bottom: 10px;">📍</div>
            <h2 style="margin: 0 0 5px 0; font-size: 22px; color: var(--text-main);">${correct.name}</h2>
            <div class="quiz-question-title">What is the capital?</div>
        `;

    } else {
        // === 3. ВОПРОС ПРО КОНТИНЕНТ ===
        correctAnswerText = correct.continent;
        const allContinents = ["Europe", "Asia", "Africa", "North America", "South America", "Oceania"];
        // Ищем 3 случайных неправильных континента
        const alternates = allContinents.filter(c => c !== correct.continent).sort(() => 0.5 - Math.random()).slice(0, 3);
        optionsStrings = [correctAnswerText, ...alternates].sort(() => 0.5 - Math.random());
        
        questionContent.innerHTML = `
            <div style="font-size: 60px; line-height: 1.2; text-shadow: 0 4px 10px rgba(0,0,0,0.1); margin-bottom: 5px;">${correct.flag}</div>
            <h2 style="margin: 0 0 5px 0; font-size: 20px; color: var(--text-main);">${correct.name}</h2>
            <div class="quiz-question-title">Which continent?</div>
        `;
    }
    
    grid.innerHTML = '';
    
    // Генерируем 4 чистые кнопки с ответами
    optionsStrings.forEach(answerText => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn'; // <-- Используем наш новый CSS-класс
        btn.innerText = answerText;
        
        btn.onclick = () => {
            const btns = grid.querySelectorAll('button');
            btns.forEach(b => b.style.pointerEvents = 'none'); 
            
            if (answerText === correctAnswerText) {
                // ПРАВИЛЬНО
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
                // ОШИБКА
                btn.classList.add('wrong');
                quizCombo = 0;
                document.getElementById('quiz-combo').innerText = "0";
                questionCard.classList.add('error-shake');
                
                // Подсвечиваем правильную кнопку
                btns.forEach(b => {
                    if (b.innerText === correctAnswerText) b.classList.add('correct');
                });
            }
            setTimeout(nextQuizRound, 800);
        };
        grid.appendChild(btn);
    });
}

// === БОНУС: Очищенная от винтажных шрифтов мини-игра Customs ===
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

    // Убираем винтажную анимацию, оставляем простое появление
    card.className = '';
    void card.offsetWidth;
    card.className = 'slide-in';

    const isFlagQuestion = Math.random() > 0.5;

    // Используем системные шрифты и цвета из CSS переменных
    if (isFlagQuestion) {
        content.innerHTML = `
            <div style="font-size: 70px; line-height: 1.2; text-shadow: 0 4px 10px rgba(0,0,0,0.1);">${actualCountry.flag}</div>
            <div style="font-size: 13px; color: var(--text-sub); margin-top: 5px;">This is the flag of</div>
            <div style="font-size: 22px; font-weight: 800; color: var(--text-main); margin-top: 2px;">${displayCountry.name}</div>
        `;
    } else {
        content.innerHTML = `
            <div style="font-size: 22px; font-weight: 800; color: var(--text-main); margin-bottom: 5px;">${actualCountry.name}</div>
            <div style="font-size: 13px; color: var(--text-sub);">Capital city is</div>
            <div style="font-size: 26px; font-weight: 800; color: var(--primary); margin-top: 2px;">${displayCountry.capital}</div>
        `;
    }

    const btnReject = document.getElementById('btn-customs-reject');
    const btnApprove = document.getElementById('btn-customs-approve');
    
    if(btnReject) btnReject.disabled = false;
    if(btnApprove) btnApprove.disabled = false;
    
    // Сбрасываем цвета кнопок
    if(btnReject) btnReject.classList.remove('correct', 'wrong');
    if(btnApprove) btnApprove.classList.remove('correct', 'wrong');
}

function checkCustomsAnswer(playerAnswer, btnElement) {
    document.getElementById('btn-customs-reject').disabled = true;
    document.getElementById('btn-customs-approve').disabled = true;

    const card = document.getElementById('customs-card');
    const isCorrect = (playerAnswer === currentCustomsAnswer);

    const stamp = document.createElement('div');
    stamp.className = 'stamp-effect';

    if (isCorrect) {
        if(btnElement) btnElement.classList.add('correct'); 
        
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
        if(btnElement) btnElement.classList.add('wrong');
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