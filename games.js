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

// ==========================================
// 2. УПРАВЛЕНИЕ ЭКРАНАМИ
// ==========================================
function startGame(type) {
    document.getElementById('games-menu-list').style.display = 'none';
    document.getElementById('active-game-zone').style.display = 'block';
    document.getElementById('game-content').innerHTML = '';

    if (type === 'flags') {
        runFlagGame();
    } else if (type === 'capitals') {
        runCapitalGame();
    }
}

function backToGames() {
    document.getElementById('games-menu-list').style.display = 'block';
    document.getElementById('active-game-zone').style.display = 'none';
}

// ==========================================
// 3. ИГРА 1: GUESS THE FLAG (ОТДЕЛЬНЫЙ КОД)
// ==========================================
function runFlagGame() {
    const container = document.getElementById('game-content');
    const correct = countryList[Math.floor(Math.random() * countryList.length)];
    const alternates = countryList.filter(c => c.name !== correct.name).sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [correct, ...alternates].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div style="font-size: 100px; margin: 20px 0; line-height: 1;">${correct.flag}</div>
        <p style="margin-bottom: 20px; font-weight: bold;">Which country is this?</p>
        <div id="flag-options-grid" style="display: grid; gap: 10px;"></div>
    `;

    const grid = document.getElementById('flag-options-grid');

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'secondary-button';
        btn.style.width = '100%';
        btn.innerText = opt.name;
        
        btn.onclick = () => {
            const btns = grid.querySelectorAll('button');
            btns.forEach(b => b.style.pointerEvents = 'none');

            if (opt.name === correct.name) {
                btn.style.background = '#4CAF50';
                btn.style.color = 'white';
            } else {
                btn.style.background = '#F44336';
                btn.style.color = 'white';
                btns.forEach(b => {
                    if (b.innerText === correct.name) {
                        b.style.background = '#4CAF50';
                        b.style.color = 'white';
                    }
                });
            }
            setTimeout(runFlagGame, 1100);
        };
        grid.appendChild(btn);
    });
}

// ==========================================
// 4. ИГРА 2: GUESS THE CAPITAL (ОТДЕЛЬНЫЙ КОД)
// ==========================================
function runCapitalGame() {
    const container = document.getElementById('game-content');
    const correct = countryList[Math.floor(Math.random() * countryList.length)];
    
    // Берем 3 случайные страны для неправильных столиц
    const alternates = countryList
        .filter(c => c.capital !== correct.capital)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    const options = [correct, ...alternates].sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div style="font-size: 60px; margin: 20px 0;">🏙️</div>
        <h2 style="margin-bottom: 10px;">${correct.name}</h2>
        <p style="margin-bottom: 20px; color: var(--text-sub);">What is the capital?</p>
        <div id="capital-options-grid" style="display: grid; gap: 10px;"></div>
    `;

    const grid = document.getElementById('capital-options-grid');

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'secondary-button';
        btn.style.width = '100%';
        btn.innerText = opt.capital;
        
        btn.onclick = () => {
            const btns = grid.querySelectorAll('button');
            btns.forEach(b => b.style.pointerEvents = 'none');

            if (opt.capital === correct.capital) {
                btn.style.background = '#4CAF50';
                btn.style.color = 'white';
            } else {
                btn.style.background = '#F44336';
                btn.style.color = 'white';
                btns.forEach(b => {
                    if (b.innerText === correct.capital) {
                        b.style.background = '#4CAF50';
                        b.style.color = 'white';
                    }
                });
            }
            setTimeout(runCapitalGame, 1100);
        };
        grid.appendChild(btn);
    });
}