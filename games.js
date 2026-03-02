// ==========================================
// 1. ПОЛНАЯ БАЗА ДАННЫХ (195 стран)
// ==========================================
const countryList = [
    { name: "Afghanistan", flag: "🇦🇫", capital: "Kabul" }, { name: "Albania", flag: "🇦🇱", capital: "Tirana" }, { name: "Algeria", flag: "🇩🇿", capital: "Algiers" }, { name: "Andorra", flag: "🇦🇩", capital: "Andorra la Vella" }, { name: "Angola", flag: "🇦🇴", capital: "Luanda" },
    { name: "Antigua and Barbuda", flag: "🇦🇬", capital: "Saint John's" }, { name: "Argentina", flag: "🇦🇷", capital: "Buenos Aires" }, { name: "Armenia", flag: "🇦🇲", capital: "Yerevan" }, { name: "Australia", flag: "🇦🇺", capital: "Canberra" }, { name: "Austria", flag: "🇦🇹", capital: "Vienna" },
    { name: "Azerbaijan", flag: "🇦🇿", capital: "Baku" }, { name: "Bahamas", flag: "🇧🇸", capital: "Nassau" }, { name: "Bahrain", flag: "🇧🇭", capital: "Manama" }, { name: "Bangladesh", flag: "🇧🇩", capital: "Dhaka" }, { name: "Barbados", flag: "🇧🇧", capital: "Bridgetown" },
    { name: "Belarus", flag: "🇧🇾", capital: "Minsk" }, { name: "Belgium", flag: "🇧🇪", capital: "Brussels" }, { name: "Belize", flag: "🇧🇿", capital: "Belmopan" }, { name: "Benin", flag: "🇧🇯", capital: "Porto-Novo" }, { name: "Bhutan", flag: "🇧🇹", capital: "Thimphu" },
    { name: "Bolivia", flag: "🇧🇴", capital: "Sucre" }, { name: "Bosnia and Herzegovina", flag: "🇧🇦", capital: "Sarajevo" }, { name: "Botswana", flag: "🇧🇼", capital: "Gaborone" }, { name: "Brazil", flag: "🇧🇷", capital: "Brasilia" }, { name: "Brunei", flag: "🇧🇳", capital: "Bandar Seri Begawan" },
    { name: "Bulgaria", flag: "🇧🇬", capital: "Sofia" }, { name: "Burkina Faso", flag: "🇧🇫", capital: "Ouagadougou" }, { name: "Burundi", flag: "🇧🇮", capital: "Gitega" }, { name: "Cabo Verde", flag: "🇨🇻", capital: "Praia" }, { name: "Cambodia", flag: "🇰🇭", capital: "Phnom Penh" },
    { name: "Cameroon", flag: "🇨🇲", capital: "Yaounde" }, { name: "Canada", flag: "🇨🇦", capital: "Ottawa" }, { name: "Central African Republic", flag: "🇨🇫", capital: "Bangui" }, { name: "Chad", flag: "🇹🇩", capital: "N'Djamena" }, { name: "Chile", flag: "🇨🇱", capital: "Santiago" },
    { name: "China", flag: "🇨🇳", capital: "Beijing" }, { name: "Colombia", flag: "🇨🇴", capital: "Bogota" }, { name: "Comoros", flag: "🇰🇲", capital: "Moroni" }, { name: "Congo", flag: "🇨🇬", capital: "Brazzaville" }, { name: "Costa Rica", flag: "🇨🇷", capital: "San Jose" },
    { name: "Croatia", flag: "🇭🇷", capital: "Zagreb" }, { name: "Cuba", flag: "🇨🇺", capital: "Havana" }, { name: "Cyprus", flag: "🇨🇾", capital: "Nicosia" }, { name: "Czech Republic", flag: "🇨🇿", capital: "Prague" }, { name: "Denmark", flag: "🇩🇰", capital: "Copenhagen" },
    { name: "Djibouti", flag: "🇩🇯", capital: "Djibouti" }, { name: "Dominica", flag: "🇩🇲", capital: "Roseau" }, { name: "Dominican Republic", flag: "🇩🇴", capital: "Santo Domingo" }, { name: "Ecuador", flag: "🇪🇨", capital: "Quito" }, { name: "Egypt", flag: "🇪🇬", capital: "Cairo" },
    { name: "El Salvador", flag: "🇸🇻", capital: "San Salvador" }, { name: "Equatorial Guinea", flag: "🇬🇶", capital: "Malabo" }, { name: "Eritrea", flag: "🇪🇷", capital: "Asmara" }, { name: "Estonia", flag: "🇪🇪", capital: "Tallinn" }, { name: "Eswatini", flag: "🇸🇿", capital: "Mbabane" },
    { name: "Ethiopia", flag: "🇪🇹", capital: "Addis Ababa" }, { name: "Fiji", flag: "🇫🇯", capital: "Suva" }, { name: "Finland", flag: "🇫🇮", capital: "Helsinki" }, { name: "France", flag: "🇫🇷", capital: "Paris" }, { name: "Gabon", flag: "🇬🇦", capital: "Libreville" },
    { name: "Gambia", flag: "🇬🇲", capital: "Banjul" }, { name: "Georgia", flag: "🇬🇪", capital: "Tbilisi" }, { name: "Germany", flag: "🇩🇪", capital: "Berlin" }, { name: "Ghana", flag: "🇬🇭", capital: "Accra" }, { name: "Greece", flag: "🇬🇷", capital: "Athens" },
    { name: "Grenada", flag: "🇬🇩", capital: "Saint George's" }, { name: "Guatemala", flag: "🇬🇹", capital: "Guatemala City" }, { name: "Guinea", flag: "🇬🇳", capital: "Conakry" }, { name: "Guinea-Bissau", flag: "🇬🇼", capital: "Bissau" }, { name: "Guyana", flag: "🇬🇾", capital: "Georgetown" },
    { name: "Haiti", flag: "🇭🇹", capital: "Port-au-Prince" }, { name: "Honduras", flag: "🇭🇳", capital: "Tegucigalpa" }, { name: "Hungary", flag: "🇭🇺", capital: "Budapest" }, { name: "Iceland", flag: "🇮🇸", capital: "Reykjavik" }, { name: "India", flag: "🇮🇳", capital: "New Delhi" },
    { name: "Indonesia", flag: "🇮🇩", capital: "Jakarta" }, { name: "Iran", flag: "🇮🇷", capital: "Tehran" }, { name: "Iraq", flag: "🇮🇶", capital: "Baghdad" }, { name: "Ireland", flag: "🇮🇪", capital: "Dublin" }, { name: "Israel", flag: "🇮🇱", capital: "Jerusalem" },
    { name: "Italy", flag: "🇮🇹", capital: "Rome" }, { name: "Jamaica", flag: "🇯🇲", capital: "Kingston" }, { name: "Japan", flag: "🇯🇵", capital: "Tokyo" }, { name: "Jordan", flag: "🇯🇴", capital: "Amman" }, { name: "Kazakhstan", flag: "🇰🇿", capital: "Astana" },
    { name: "Kenya", flag: "🇰🇪", capital: "Nairobi" }, { name: "Kiribati", flag: "🇰🇮", capital: "Tarawa" }, { name: "Korea, North", flag: "🇰🇵", capital: "Pyongyang" }, { name: "Korea, South", flag: "🇰🇷", capital: "Seoul" }, { name: "Kuwait", flag: "🇰🇼", capital: "Kuwait City" },
    { name: "Kyrgyzstan", flag: "🇰🇬", capital: "Bishkek" }, { name: "Laos", flag: "🇱🇦", capital: "Vientiane" }, { name: "Latvia", flag: "🇱🇻", capital: "Riga" }, { name: "Lebanon", flag: "🇱🇧", capital: "Beirut" }, { name: "Lesotho", flag: "🇱🇸", capital: "Maseru" },
    { name: "Liberia", flag: "🇱🇷", capital: "Monrovia" }, { name: "Libya", flag: "🇱🇾", capital: "Tripoli" }, { name: "Liechtenstein", flag: "🇱🇮", capital: "Vaduz" }, { name: "Lithuania", flag: "🇱🇹", capital: "Vilnius" }, { name: "Luxembourg", flag: "🇱🇺", capital: "Luxembourg" },
    { name: "Madagascar", flag: "🇲🇬", capital: "Antananarivo" }, { name: "Malawi", flag: "🇲🇼", capital: "Lilongwe" }, { name: "Malaysia", flag: "🇲🇾", capital: "Kuala Lumpur" }, { name: "Maldives", flag: "🇲🇻", capital: "Male" }, { name: "Mali", flag: "🇲🇱", capital: "Bamako" },
    { name: "Malta", flag: "🇲🇹", capital: "Valletta" }, { name: "Marshall Islands", flag: "🇲🇭", capital: "Majuro" }, { name: "Mauritania", flag: "🇲🇷", capital: "Nouakchott" }, { name: "Mauritius", flag: "🇲🇺", capital: "Port Louis" }, { name: "Mexico", flag: "🇲🇽", capital: "Mexico City" },
    { name: "Micronesia", flag: "🇫🇲", capital: "Palikir" }, { name: "Moldova", flag: "🇲🇩", capital: "Chisinau" }, { name: "Monaco", flag: "🇲🇨", capital: "Monaco" }, { name: "Mongolia", flag: "🇲🇳", capital: "Ulaanbaatar" }, { name: "Montenegro", flag: "🇲🇪", capital: "Podgorica" },
    { name: "Morocco", flag: "🇲🇦", capital: "Rabat" }, { name: "Mozambique", flag: "🇲🇿", capital: "Maputo" }, { name: "Myanmar", flag: "🇲🇲", capital: "Naypyidaw" }, { name: "Namibia", flag: "🇳🇦", capital: "Windhoek" }, { name: "Nauru", flag: "🇳🇷", capital: "Yaren" },
    { name: "Nepal", flag: "🇳🇵", capital: "Kathmandu" }, { name: "Netherlands", flag: "🇳🇱", capital: "Amsterdam" }, { name: "New Zealand", flag: "🇳🇿", capital: "Wellington" }, { name: "Nicaragua", flag: "🇳🇮", capital: "Managua" }, { name: "Niger", flag: "🇳🇪", capital: "Niamey" },
    { name: "Nigeria", flag: "🇳🇬", capital: "Abuja" }, { name: "North Macedonia", flag: "🇲🇰", capital: "Skopje" }, { name: "Norway", flag: "🇳🇴", capital: "Oslo" }, { name: "Oman", flag: "🇴🇲", capital: "Muscat" }, { name: "Pakistan", flag: "🇵🇰", capital: "Islamabad" },
    { name: "Palau", flag: "🇵🇼", capital: "Ngerulmud" }, { name: "Panama", flag: "🇵🇦", capital: "Panama City" }, { name: "Papua New Guinea", flag: "🇵🇬", capital: "Port Moresby" }, { name: "Paraguay", flag: "🇵🇾", capital: "Asuncion" }, { name: "Peru", flag: "🇵🇪", capital: "Lima" },
    { name: "Philippines", flag: "🇵🇭", capital: "Manila" }, { name: "Poland", flag: "🇵🇱", capital: "Warsaw" }, { name: "Portugal", flag: "🇵🇹", capital: "Lisbon" }, { name: "Qatar", flag: "🇶🇦", capital: "Doha" }, { name: "Romania", flag: "🇷🇴", capital: "Bucharest" },
    { name: "Russia", flag: "🇷🇺", capital: "Moscow" }, { name: "Rwanda", flag: "🇷🇼", capital: "Kigali" }, { name: "Saint Kitts and Nevis", flag: "🇰🇳", capital: "Basseterre" }, { name: "Saint Lucia", flag: "🇱🇨", capital: "Castries" }, { name: "Saint Vincent and the Grenadines", flag: "🇻🇨", capital: "Kingstown" },
    { name: "Samoa", flag: "🇼🇸", capital: "Apia" }, { name: "San Marino", flag: "🇸🇲", capital: "San Marino" }, { name: "Sao Tome and Principe", flag: "🇸🇹", capital: "Sao Tome" }, { name: "Saudi Arabia", flag: "🇸🇦", capital: "Riyadh" }, { name: "Senegal", flag: "🇸🇳", capital: "Dakar" },
    { name: "Serbia", flag: "🇷🇸", capital: "Belgrade" }, { name: "Seychelles", flag: "🇸🇨", capital: "Victoria" }, { name: "Sierra Leone", flag: "🇸🇱", capital: "Freetown" }, { name: "Singapore", flag: "🇸🇬", capital: "Singapore" }, { name: "Slovakia", flag: "🇸🇰", capital: "Bratislava" },
    { name: "Slovenia", flag: "🇸🇮", capital: "Ljubljana" }, { name: "Solomon Islands", flag: "🇸🇧", capital: "Honiara" }, { name: "Somalia", flag: "🇸🇴", capital: "Mogadishu" }, { name: "South Africa", flag: "🇿🇦", capital: "Pretoria" }, { name: "South Sudan", flag: "🇸🇸", capital: "Juba" },
    { name: "Spain", flag: "🇪🇸", capital: "Madrid" }, { name: "Sri Lanka", flag: "🇱🇰", capital: "Colombo" }, { name: "Sudan", flag: "🇸🇩", capital: "Khartoum" }, { name: "Suriname", flag: "🇸🇷", capital: "Paramaribo" }, { name: "Sweden", flag: "🇸🇪", capital: "Stockholm" },
    { name: "Switzerland", flag: "🇨🇭", capital: "Bern" }, { name: "Syria", flag: "🇸🇾", capital: "Damascus" }, { name: "Tajikistan", flag: "🇹🇯", capital: "Dushanbe" }, { name: "Tanzania", flag: "🇹🇿", capital: "Dodoma" }, { name: "Thailand", flag: "🇹🇭", capital: "Bangkok" },
    { name: "Timor-Leste", flag: "🇹🇱", capital: "Dili" }, { name: "Togo", flag: "🇹🇬", capital: "Lome" }, { name: "Tonga", flag: "🇹🇴", capital: "Nuku'alofa" }, { name: "Trinidad and Tobago", flag: "🇹🇹", capital: "Port of Spain" }, { name: "Tunisia", flag: "🇹🇳", capital: "Tunis" },
    { name: "Turkey", flag: "🇹🇷", capital: "Ankara" }, { name: "Turkmenistan", flag: "🇹🇲", capital: "Ashgabat" }, { name: "Tuvalu", flag: "🇹🇻", capital: "Funafuti" }, { name: "Uganda", flag: "🇺🇬", capital: "Kampala" }, { name: "Ukraine", flag: "🇺🇦", capital: "Kyiv" },
    { name: "United Arab Emirates", flag: "🇦🇪", capital: "Abu Dhabi" }, { name: "United Kingdom", flag: "🇬🇧", capital: "London" }, { name: "USA", flag: "🇺🇸", capital: "Washington, D.C." }, { name: "Uruguay", flag: "🇺🇾", capital: "Montevideo" }, { name: "Uzbekistan", flag: "🇺🇿", capital: "Tashkent" },
    { name: "Vanuatu", flag: "🇻🇺", capital: "Port Vila" }, { name: "Vatican City", flag: "🇻🇦", capital: "Vatican City" }, { name: "Venezuela", flag: "🇻🇪", capital: "Caracas" }, { name: "Vietnam", flag: "🇻🇳", capital: "Hanoi" }, { name: "Yemen", flag: "🇾🇪", capital: "Sana'a" },
    { name: "Zambia", flag: "🇿🇲", capital: "Lusaka" }, { name: "Zimbabwe", flag: "🇿🇼", capital: "Harare" }
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
// 3. ИГРА 1: GEO QUIZ (ФЛАГИ + СТОЛИЦЫ)
// ==========================================
let quizScore = 0;
let quizCombo = 0;

function startQuizGame() {
    document.getElementById('games-menu-list').style.display = 'none';
    document.getElementById('active-game-zone').style.display = 'block';
    
    const container = document.getElementById('game-content');
    
    // Рисуем общий интерфейс с табло
    container.innerHTML = `
        <button onclick="backToGames()" class="back-link" style="background:none; border:none; color:var(--primary); cursor:pointer; margin-bottom:15px; display:block; font-weight:bold; font-size:14px;">← Quit to Menu</button>
        
        <div class="sorter-header">
            <div class="sorter-score-board">Score: <span id="quiz-score">0</span></div>
            <div class="sorter-combo-board">Combo: <span id="quiz-combo">0</span>🔥</div>
        </div>

        <div id="quiz-game-container" style="position: relative; padding-bottom: 10px;">
            <div id="quiz-question-area" style="text-align: center; min-height: 140px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
            </div>
            
            <div id="quiz-options-grid" style="display: grid; gap: 10px; margin-top: 15px;"></div>
        </div>
    `;
    
    quizScore = 0;
    quizCombo = 0;
    nextQuizRound();
}

function nextQuizRound() {
    const correct = countryList[Math.floor(Math.random() * countryList.length)];
    
    // Бросаем монетку: 50% шанс на флаг, 50% шанс на столицу
    const isFlagQuestion = Math.random() > 0.5; 
    
    let alternates;
    if (isFlagQuestion) {
        alternates = countryList.filter(c => c.name !== correct.name).sort(() => 0.5 - Math.random()).slice(0, 3);
    } else {
        alternates = countryList.filter(c => c.capital !== correct.capital).sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    
    const options = [correct, ...alternates].sort(() => 0.5 - Math.random());
    
    const questionArea = document.getElementById('quiz-question-area');
    const grid = document.getElementById('quiz-options-grid');
    
    // Перезапускаем анимацию вылета вопроса
    questionArea.className = '';
    void questionArea.offsetWidth;
    questionArea.className = 'slide-in';
    
    // Рисуем вопрос в зависимости от режима
    if (isFlagQuestion) {
        questionArea.innerHTML = `
            <div style="font-size: 100px; line-height: 1;">${correct.flag}</div>
            <p style="margin-top: 10px; font-weight: bold; color: var(--text-main);">Which country is this?</p>
        `;
    } else {
        questionArea.innerHTML = `
            <div style="font-size: 50px; line-height: 1;">🏙️</div>
            <h2 style="margin: 10px 0 5px 0;">${correct.name}</h2>
            <p style="color: var(--text-sub); margin:0; font-weight: bold;">What is the capital?</p>
        `;
    }
    
    grid.innerHTML = '';
    
    // Генерируем кнопки с ответами
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'secondary-button';
        btn.style.width = '100%';
        
        // В зависимости от режима, на кнопках пишем либо названия стран, либо названия столиц
        const answerText = isFlagQuestion ? opt.name : opt.capital;
        const correctAnswerText = isFlagQuestion ? correct.name : correct.capital;
        
        btn.innerText = answerText;
        
        btn.onclick = () => {
            const btns = grid.querySelectorAll('button');
            btns.forEach(b => b.style.pointerEvents = 'none'); // Блокируем клики
            
            if (answerText === correctAnswerText) {
                // ПРАВИЛЬНО
                btn.style.background = '#27ae60';
                btn.style.color = 'white';
                btn.style.borderColor = '#27ae60';
                
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
                btn.style.background = '#e74c3c';
                btn.style.color = 'white';
                btn.style.borderColor = '#e74c3c';
                
                quizCombo = 0;
                document.getElementById('quiz-combo').innerText = "0";
                questionArea.className = 'error-shake';
                
                btns.forEach(b => {
                    if (b.innerText === correctAnswerText) {
                        b.style.background = '#27ae60';
                        b.style.color = 'white';
                        b.style.borderColor = '#27ae60';
                    }
                });
            }
            setTimeout(nextQuizRound, 1200);
        };
        grid.appendChild(btn);
    });
}

// ==========================================
// 5. ИГРА 3: POST OFFICE SORTER
// ==========================================
let currentSorterContinent = "";
let sorterScore = 0;
let sorterCombo = 0;

function startSorterGame() {
    document.getElementById('games-menu-list').style.display = 'none';
    document.getElementById('active-game-zone').style.display = 'block';

    const container = document.getElementById('game-content');
    
    container.innerHTML = `
        <button onclick="backToGames()" class="back-link" style="background:none; border:none; color:var(--primary); cursor:pointer; margin-bottom:15px; display:block; font-weight:bold; font-size:14px;">← Quit to Menu</button>
        
        <div class="sorter-header">
            <div class="sorter-score-board">Score: <span id="sorter-score">0</span></div>
            <div class="sorter-combo-board">Combo: <span id="sorter-combo">0</span>🔥</div>
        </div>

        <div class="sorter-letter-zone" id="sorter-zone">
            <div id="sorter-letter" class="sorter-letter">
                <div style="font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Destination:</div>
                <div id="sorter-destination" class="sorter-destination">Loading...</div>
            </div>
        </div>

        <div class="sorter-bins">
            <button class="sorter-bin" onclick="checkSorterBin('Europe')">Europe</button>
            <button class="sorter-bin" onclick="checkSorterBin('Asia')">Asia</button>
            <button class="sorter-bin" onclick="checkSorterBin('Africa')">Africa</button>
            <button class="sorter-bin" onclick="checkSorterBin('North America')">N. America</button>
            <button class="sorter-bin" onclick="checkSorterBin('South America')">S. America</button>
            <button class="sorter-bin" onclick="checkSorterBin('Oceania')">Oceania</button>
        </div>
    `;
    
    sorterScore = 0;
    sorterCombo = 0;
    nextSorterLetter();
}

function nextSorterLetter() {
    const continents = Object.keys(SORTER_COUNTRIES);
    
    currentSorterContinent = continents[Math.floor(Math.random() * continents.length)];
    const countriesInContinent = SORTER_COUNTRIES[currentSorterContinent];
    const randomCountryFlag = countriesInContinent[Math.floor(Math.random() * countriesInContinent.length)];
    
    const letter = document.getElementById('sorter-letter');
    letter.className = 'sorter-letter'; 
    void letter.offsetWidth; 
    letter.className = 'sorter-letter slide-in'; 
    
    document.getElementById('sorter-destination').innerText = randomCountryFlag;

    // ИСПРАВЛЕНИЕ: Разблокируем кнопки для нового письма
    const btns = document.querySelectorAll('.sorter-bin');
    btns.forEach(b => b.style.pointerEvents = 'auto');
}

function checkSorterBin(selectedContinent) {
    const letter = document.getElementById('sorter-letter');
    
    // ИСПРАВЛЕНИЕ: Блокируем кнопки, пока идет анимация, чтобы избежать багов
    const btns = document.querySelectorAll('.sorter-bin');
    btns.forEach(b => b.style.pointerEvents = 'none');
    
    if (selectedContinent === currentSorterContinent) {
        // === ПРАВИЛЬНЫЙ ОТВЕТ ===
        sorterScore += 1;
        sorterCombo += 1;
        
        let earnedEnergy = 5;
        if (sorterCombo > 0 && sorterCombo % 5 === 0) {
            earnedEnergy += 15;
            showFloatingText("COMBO! +" + earnedEnergy + "⚡", "#e67e22", "sorter-zone");
        } else {
            showFloatingText("+" + earnedEnergy + "⚡", "#27ae60", "sorter-zone");
        }
        
        state.energy += earnedEnergy;
        
        const energyEl = document.getElementById('energy-display');
        if(energyEl) energyEl.textContent = state.energy;
        
        document.getElementById('sorter-score').innerText = sorterScore;
        document.getElementById('sorter-combo').innerText = sorterCombo;
        
        letter.className = 'sorter-letter success-out';
        
        // Выдаем новое письмо быстро (300мс)
        setTimeout(nextSorterLetter, 300);
        
    } else {
        // === НЕПРАВИЛЬНЫЙ ОТВЕТ ===
        sorterCombo = 0; 
        document.getElementById('sorter-combo').innerText = "0";
        letter.className = 'sorter-letter error-shake';

        // ИСПРАВЛЕНИЕ: Ждем 600мс (пока пройдет тряска) и АВТОМАТИЧЕСКИ даем новое письмо!
        setTimeout(nextSorterLetter, 600);
    }
}

// Универсальный визуальный эффект добавления энергии
function showFloatingText(text, color, targetContainerId = 'sorter-zone') {
    const zone = document.getElementById(targetContainerId);
    if (!zone) return;
    
    const floatEl = document.createElement('div');
    floatEl.className = 'energy-float';
    floatEl.innerText = text;
    floatEl.style.color = color;
    
    // Позиционируем случайным образом ближе к центру
    floatEl.style.left = (30 + Math.random() * 40) + '%';
    floatEl.style.top = '30%';
    
    zone.appendChild(floatEl);
    setTimeout(() => { floatEl.remove(); }, 800);
}

// ==========================================
// 6. ИГРА 3: CUSTOMS INSPECTOR (ПРАВДА / ЛОЖЬ)
// ==========================================
let customsScore = 0;
let customsCombo = 0;
let currentCustomsAnswer = true; // Хранит правильный ответ (Правда или Ложь)

function startCustomsGame() {
    document.getElementById('games-menu-list').style.display = 'none';
    document.getElementById('active-game-zone').style.display = 'block';

    const container = document.getElementById('game-content');
    
    container.innerHTML = `
        <button onclick="backToGames()" class="back-link" style="background:none; border:none; color:var(--primary); cursor:pointer; margin-bottom:15px; display:block; font-weight:bold; font-size:14px;">← Quit to Menu</button>
        
        <div class="sorter-header">
            <div class="sorter-score-board">Score: <span id="customs-score">0</span></div>
            <div class="sorter-combo-board">Combo: <span id="customs-combo">0</span>🔥</div>
        </div>

        <div id="customs-game-container" style="position: relative;">
            <div id="customs-card" class="customs-card slide-in">
                <div id="customs-content" style="text-align: center;"></div>
            </div>

            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button id="btn-customs-reject" class="secondary-button" style="flex: 1; border-color: #e74c3c; color: #e74c3c; font-weight: bold; font-size: 16px;" onclick="checkCustomsAnswer(false)">
                    ❌ REJECT
                </button>
                <button id="btn-customs-approve" class="secondary-button" style="flex: 1; border-color: #27ae60; color: #27ae60; font-weight: bold; font-size: 16px;" onclick="checkCustomsAnswer(true)">
                    ✅ APPROVE
                </button>
            </div>
        </div>
    `;
    
    customsScore = 0;
    customsCombo = 0;
    nextCustomsRound();
}

function nextCustomsRound() {
    // Вероятность 50/50: сделать утверждение правдивым или ложным
    currentCustomsAnswer = Math.random() > 0.5;
    
    const actualCountry = countryList[Math.floor(Math.random() * countryList.length)];
    let displayCountry = actualCountry;

    // Если ложь, берем случайную ДРУГУЮ страну
    if (!currentCustomsAnswer) {
        let wrongCountry;
        do {
            wrongCountry = countryList[Math.floor(Math.random() * countryList.length)];
        } while (wrongCountry.name === actualCountry.name);
        displayCountry = wrongCountry;
    }

    const content = document.getElementById('customs-content');
    const card = document.getElementById('customs-card');
    
    // === ИСПРАВЛЕНИЕ БАГА: УДАЛЯЕМ СТАРЫЕ ПЕЧАТИ ===
    const oldStamps = card.querySelectorAll('.stamp-effect');
    oldStamps.forEach(stamp => stamp.remove());

    // Сброс анимаций
    card.className = 'customs-card';
    void card.offsetWidth;
    card.className = 'customs-card slide-in';


    // 50% шанс спросить про флаг, 50% про столицу
    const isFlagQuestion = Math.random() > 0.5;

    if (isFlagQuestion) {
        content.innerHTML = `
            <div style="font-size: 80px; line-height: 1.2;">${actualCountry.flag}</div>
            <div style="font-size: 14px; color: var(--text-sub); margin-top: 10px;">This is the flag of</div>
            <div style="font-size: 24px; font-weight: 900; color: var(--text-main); margin-top: 5px;">${displayCountry.name}</div>
        `;
    } else {
        content.innerHTML = `
            <div style="font-size: 24px; font-weight: 900; color: var(--text-main); margin-bottom: 10px;">${actualCountry.name}</div>
            <div style="font-size: 14px; color: var(--text-sub);">Capital city is</div>
            <div style="font-size: 30px; font-weight: bold; color: var(--primary); margin-top: 5px;">${displayCountry.capital}</div>
        `;
    }

    // Разблокируем кнопки
    document.getElementById('btn-customs-reject').disabled = false;
    document.getElementById('btn-customs-approve').disabled = false;
}

function checkCustomsAnswer(playerAnswer) {
    // Блокируем кнопки от двойного клика
    document.getElementById('btn-customs-reject').disabled = true;
    document.getElementById('btn-customs-approve').disabled = true;

    const card = document.getElementById('customs-card');
    const isCorrect = (playerAnswer === currentCustomsAnswer);

    // Создаем элемент печати
    const stamp = document.createElement('div');
    stamp.className = 'stamp-effect';

    if (isCorrect) {
        // Успех
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

        // Зеленая печать, если игрок правильно сказал APPROVE, или зеленая печать на REJECT
        stamp.classList.add('stamp-approve');
        stamp.innerText = playerAnswer ? "APPROVED" : "REJECTED";
        
    } else {
        // Ошибка
        customsCombo = 0;
        document.getElementById('customs-combo').innerText = "0";
        card.classList.add('error-shake'); // Трясем карточку

        // Красная печать ОШИБКИ
        stamp.classList.add('stamp-reject');
        stamp.innerText = "WRONG!";
    }

    // Добавляем печать на карточку
    card.appendChild(stamp);

    // Ждем анимацию и запускаем следующий раунд
    setTimeout(nextCustomsRound, 1000);
}