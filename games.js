// 1. ПОЛНАЯ БАЗА СТРАН (195 стран ООН)
const countryList = [
    { name: "Afghanistan", flag: "🇦🇫" }, { name: "Albania", flag: "🇦🇱" }, { name: "Algeria", flag: "🇩🇿" }, { name: "Andorra", flag: "🇦🇩" }, { name: "Angola", flag: "🇦🇴" },
    { name: "Antigua and Barbuda", flag: "🇦🇬" }, { name: "Argentina", flag: "🇦🇷" }, { name: "Armenia", flag: "🇦🇲" }, { name: "Australia", flag: "🇦🇺" }, { name: "Austria", flag: "🇦🇹" },
    { name: "Azerbaijan", flag: "🇦🇿" }, { name: "Bahamas", flag: "🇧🇸" }, { name: "Bahrain", flag: "🇧🇭" }, { name: "Bangladesh", flag: "🇧🇩" }, { name: "Barbados", flag: "🇧🇧" },
    { name: "Belarus", flag: "🇧🇾" }, { name: "Belgium", flag: "🇧🇪" }, { name: "Belize", flag: "🇧🇿" }, { name: "Benin", flag: "🇧🇯" }, { name: "Bhutan", flag: "🇧🇹" },
    { name: "Bolivia", flag: "🇧🇴" }, { name: "Bosnia and Herzegovina", flag: "🇧🇦" }, { name: "Botswana", flag: "🇧🇼" }, { name: "Brazil", flag: "🇧🇷" }, { name: "Brunei", flag: "🇧🇳" },
    { name: "Bulgaria", flag: "🇧🇬" }, { name: "Burkina Faso", flag: "🇧🇫" }, { name: "Burundi", flag: "🇧🇮" }, { name: "Cabo Verde", flag: "🇨🇻" }, { name: "Cambodia", flag: "🇰🇭" },
    { name: "Cameroon", flag: "🇨🇲" }, { name: "Canada", flag: "🇨🇦" }, { name: "Central African Republic", flag: "🇨🇫" }, { name: "Chad", flag: "🇹🇩" }, { name: "Chile", flag: "🇨🇱" },
    { name: "China", flag: "🇨🇳" }, { name: "Colombia", flag: "🇨🇴" }, { name: "Comoros", flag: "🇰🇲" }, { name: "Congo", flag: "🇨🇬" }, { name: "Costa Rica", flag: "🇨🇷" },
    { name: "Croatia", flag: "🇭🇷" }, { name: "Cuba", flag: "🇨🇺" }, { name: "Cyprus", flag: "🇨🇾" }, { name: "Czech Republic", flag: "🇨🇿" }, { name: "Denmark", flag: "🇩🇰" },
    { name: "Djibouti", flag: "🇩🇯" }, { name: "Dominica", flag: "🇩🇲" }, { name: "Dominican Republic", flag: "🇩🇴" }, { name: "Ecuador", flag: "🇪🇨" }, { name: "Egypt", flag: "🇪🇬" },
    { name: "El Salvador", flag: "🇸🇻" }, { name: "Equatorial Guinea", flag: "🇬🇶" }, { name: "Eritrea", flag: "🇪🇷" }, { name: "Estonia", flag: "🇪🇪" }, { name: "Eswatini", flag: "🇸🇿" },
    { name: "Ethiopia", flag: "🇪🇹" }, { name: "Fiji", flag: "🇫🇯" }, { name: "Finland", flag: "🇫🇮" }, { name: "France", flag: "🇫🇷" }, { name: "Gabon", flag: "🇬🇦" },
    { name: "Gambia", flag: "🇬🇲" }, { name: "Georgia", flag: "🇬🇪" }, { name: "Germany", flag: "🇩🇪" }, { name: "Ghana", flag: "🇬🇭" }, { name: "Greece", flag: "🇬🇷" },
    { name: "Grenada", flag: "🇬🇩" }, { name: "Guatemala", flag: "🇬🇹" }, { name: "Guinea", flag: "🇬🇳" }, { name: "Guinea-Bissau", flag: "🇬🇼" }, { name: "Guyana", flag: "🇬🇾" },
    { name: "Haiti", flag: "🇭🇹" }, { name: "Honduras", flag: "🇭🇳" }, { name: "Hungary", flag: "🇭🇺" }, { name: "Iceland", flag: "🇮🇸" }, { name: "India", flag: "🇮🇳" },
    { name: "Indonesia", flag: "🇮🇩" }, { name: "Iran", flag: "🇮🇷" }, { name: "Iraq", flag: "🇮🇶" }, { name: "Ireland", flag: "🇮🇪" }, { name: "Israel", flag: "🇮🇱" },
    { name: "Italy", flag: "🇮🇹" }, { name: "Jamaica", flag: "🇯🇲" }, { name: "Japan", flag: "🇯🇵" }, { name: "Jordan", flag: "🇯🇴" }, { name: "Kazakhstan", flag: "🇰🇿" },
    { name: "Kenya", flag: "🇰🇪" }, { name: "Kiribati", flag: "🇰🇮" }, { name: "Korea, North", flag: "🇰🇵" }, { name: "Korea, South", flag: "🇰🇷" }, { name: "Kuwait", flag: "🇰🇼" },
    { name: "Kyrgyzstan", flag: "🇰🇬" }, { name: "Laos", flag: "🇱🇦" }, { name: "Latvia", flag: "🇱🇻" }, { name: "Lebanon", flag: "🇱🇧" }, { name: "Lesotho", flag: "🇱🇸" },
    { name: "Liberia", flag: "🇱🇷" }, { name: "Libya", flag: "🇱🇾" }, { name: "Liechtenstein", flag: "🇱🇮" }, { name: "Lithuania", flag: "🇱🇹" }, { name: "Luxembourg", flag: "🇱🇺" },
    { name: "Madagascar", flag: "🇲🇬" }, { name: "Malawi", flag: "🇲🇼" }, { name: "Malaysia", flag: "🇲🇾" }, { name: "Maldives", flag: "🇲🇻" }, { name: "Mali", flag: "🇲🇱" },
    { name: "Malta", flag: "🇲🇹" }, { name: "Marshall Islands", flag: "🇲🇭" }, { name: "Mauritania", flag: "🇲🇷" }, { name: "Mauritius", flag: "🇲🇺" }, { name: "Mexico", flag: "🇲🇽" },
    { name: "Micronesia", flag: "🇫🇲" }, { name: "Moldova", flag: "🇲🇩" }, { name: "Monaco", flag: "🇲🇨" }, { name: "Mongolia", flag: "🇲🇳" }, { name: "Montenegro", flag: "🇲🇪" },
    { name: "Morocco", flag: "🇲🇦" }, { name: "Mozambique", flag: "🇲🇿" }, { name: "Myanmar", flag: "🇲🇲" }, { name: "Namibia", flag: "🇳🇦" }, { name: "Nauru", flag: "🇳🇷" },
    { name: "Nepal", flag: "🇳🇵" }, { name: "Netherlands", flag: "🇳🇱" }, { name: "New Zealand", flag: "🇳🇿" }, { name: "Nicaragua", flag: "🇳🇮" }, { name: "Niger", flag: "🇳🇪" },
    { name: "Nigeria", flag: "🇳🇬" }, { name: "North Macedonia", flag: "🇲🇰" }, { name: "Norway", flag: "🇳🇴" }, { name: "Oman", flag: "🇴🇲" }, { name: "Pakistan", flag: "🇵🇰" },
    { name: "Palau", flag: "🇵🇼" }, { name: "Panama", flag: "🇵🇦" }, { name: "Papua New Guinea", flag: "🇵🇬" }, { name: "Paraguay", flag: "🇵🇾" }, { name: "Peru", flag: "🇵🇪" },
    { name: "Philippines", flag: "🇵🇭" }, { name: "Poland", flag: "🇵🇱" }, { name: "Portugal", flag: "🇵🇹" }, { name: "Qatar", flag: "🇶🇦" }, { name: "Romania", flag: "🇷🇴" },
    { name: "Russia", flag: "🇷🇺" }, { name: "Rwanda", flag: "🇷🇼" }, { name: "Saint Kitts and Nevis", flag: "🇰🇳" }, { name: "Saint Lucia", flag: "🇱🇨" }, { name: "Samoa", flag: "🇼🇸" },
    { name: "San Marino", flag: "🇸🇲" }, { name: "Sao Tome and Principe", flag: "🇸🇹" }, { name: "Saudi Arabia", flag: "🇸🇦" }, { name: "Senegal", flag: "🇸🇳" }, { name: "Serbia", flag: "🇷🇸" },
    { name: "Seychelles", flag: "🇸🇨" }, { name: "Sierra Leone", flag: "🇸🇱" }, { name: "Singapore", flag: "🇸🇬" }, { name: "Slovakia", flag: "🇸🇰" }, { name: "Slovenia", flag: "🇸🇮" },
    { name: "Solomon Islands", flag: "🇸🇧" }, { name: "Somalia", flag: "🇸🇴" }, { name: "South Africa", flag: "🇿🇦" }, { name: "South Sudan", flag: "🇸🇸" }, { name: "Spain", flag: "🇪🇸" },
    { name: "Sri Lanka", flag: "🇱🇰" }, { name: "Sudan", flag: "🇸🇩" }, { name: "Suriname", flag: "🇸🇷" }, { name: "Sweden", flag: "🇸🇪" }, { name: "Switzerland", flag: "🇨🇭" },
    { name: "Syria", flag: "🇸🇾" }, { name: "Tajikistan", flag: "🇹🇯" }, { name: "Tanzania", flag: "🇹🇿" }, { name: "Thailand", flag: "🇹🇭" }, { name: "Timor-Leste", flag: "🇹🇱" },
    { name: "Togo", flag: "🇹🇬" }, { name: "Tonga", flag: "🇹🇴" }, { name: "Trinidad and Tobago", flag: "🇹🇹" }, { name: "Tunisia", flag: "🇹🇳" }, { name: "Turkey", flag: "🇹🇷" },
    { name: "Turkmenistan", flag: "🇹🇲" }, { name: "Tuvalu", flag: "🇹🇻" }, { name: "Uganda", flag: "🇺🇬" }, { name: "Ukraine", flag: "🇺🇦" }, { name: "UAE", flag: "🇦🇪" },
    { name: "United Kingdom", flag: "🇬🇧" }, { name: "USA", flag: "🇺🇸" }, { name: "Uruguay", flag: "🇺🇾" }, { name: "Uzbekistan", flag: "🇺🇿" }, { name: "Vanuatu", flag: "🇻🇺" },
    { name: "Vatican City", flag: "🇻🇦" }, { name: "Venezuela", flag: "🇻🇪" }, { name: "Vietnam", flag: "🇻🇳" }, { name: "Yemen", flag: "🇾🇪" }, { name: "Zambia", flag: "🇿🇲" },
    { name: "Zimbabwe", flag: "🇿🇼" }
];

/**
 * ЗАПУСК ИГРЫ
 */
function startGame(type) {
    const menu = document.getElementById('games-menu-list');
    const zone = document.getElementById('active-game-zone');
    
    if (menu) menu.style.display = 'none';
    if (zone) zone.style.display = 'block';
    
    if (type === 'flags') {
        generateFlagQuestion();
    }
}

/**
 * ГЕНЕРАЦИЯ ВОПРОСА ДЛЯ ФЛАГОВ
 */
function generateFlagQuestion() {
    const container = document.getElementById('game-content');
    if (!container) return;

    // Выбираем правильный ответ
    const correct = countryList[Math.floor(Math.random() * countryList.length)];
    
    // Выбираем 3 случайных неправильных ответа
    const wrongAnswers = countryList
        .filter(c => c.name !== correct.name)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    
    // Перемешиваем все 4 варианта
    const allOptions = [correct, ...wrongAnswers].sort(() => 0.5 - Math.random());

    // Создаем интерфейс
    container.innerHTML = `
        <div style="font-size: 100px; margin: 20px 0; line-height: 1;">${correct.flag}</div>
        <p style="margin-bottom: 20px; font-weight: bold; color: var(--text-main);">Which country is this?</p>
        <div id="options-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px;"></div>
    `;

    const grid = document.getElementById('options-grid');

    allOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'secondary-button';
        btn.style.width = '100%';
        btn.innerText = option.name;
        
        btn.onclick = () => {
            const buttons = grid.querySelectorAll('button');
            buttons.forEach(b => b.style.pointerEvents = 'none'); // Блокируем клики

            if (option.name === correct.name) {
                btn.style.background = '#4CAF50';
                btn.style.color = 'white';
                btn.style.borderColor = '#4CAF50';
            } else {
                btn.style.background = '#F44336';
                btn.style.color = 'white';
                btn.style.borderColor = '#F44336';
                
                // Подсвечиваем правильный, чтобы игрок учился
                buttons.forEach(b => {
                    if (b.innerText === correct.name) {
                        b.style.background = '#4CAF50';
                        b.style.color = 'white';
                    }
                });
            }

            // Переход к следующему через 0.6 сек
            setTimeout(generateFlagQuestion, 600);
        };
        grid.appendChild(btn);
    });
}

/**
 * ВОЗВРАТ В МЕНЮ
 */
function backToGames() {
    document.getElementById('games-menu-list').style.display = 'block';
    document.getElementById('active-game-zone').style.display = 'none';
    document.getElementById('game-content').innerHTML = '';
}