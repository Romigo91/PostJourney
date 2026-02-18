// Простейшее состояние приложения
const state = {
    postcards: 5,
    energy: 500,
    tracking: [
      { to: "Japan", status: "In transit" },
      { to: "Brazil", status: "Delivered" },
      { to: "Germany", status: "Preparing" }
    ],
    leaderboard: [
      { name: "@Alex_Travels", sent: 110, countries: 45 },
      { name: "@PostcardLover", sent: 80, countries: 30 },
      { name: "@WorldWalker", sent: 60, countries: 25 }
    ],
    sentPostcards: [
      { countryFlag: "🇯🇵", to: "Japan, Tokyo", status: "In transit" },
      { countryFlag: "🇧🇷", to: "Brazil, Rio", status: "Delivered" },
      { countryFlag: "🇩🇪", to: "Germany, Berlin", status: "In transit" }
    ],
    receivedPostcards: [
      { countryFlag: "🇫🇮", to: "Finland, Helsinki", status: "Received" },
      { countryFlag: "🇵🇹", to: "Portugal, Porto", status: "Registered" }
    ]
  };
  
  // Список стран по континентам (флаги).
  // Здесь чуть больше 195 флагов, т.к. включены спорные территории вроде Kosovo, Taiwan, Palestine.
  const COUNTRIES_BY_CONTINENT = {
    "Africa": [
      "🇩🇿","🇦🇴","🇧🇯","🇧🇼","🇧🇫","🇧🇮","🇨🇻","🇨🇲","🇨🇫","🇹🇩","🇰🇲","🇨🇩",
      "🇨🇬","🇩🇯","🇪🇬","🇬🇶","🇪🇷","🇸🇿","🇪🇹","🇬🇦","🇬🇲","🇬🇭","🇬🇳","🇬🇼",
      "🇨🇮","🇰🇪","🇱🇸","🇱🇷","🇱🇾","🇲🇬","🇲🇼","🇲🇱","🇲🇷","🇲🇺","🇲🇦","🇲🇿",
      "🇳🇦","🇳🇪","🇳🇬","🇷🇼","🇸🇹","🇸🇳","🇸🇨","🇸🇱","🇸🇴","🇿🇦","🇸🇸","🇸🇩",
      "🇹🇿","🇹🇬","🇹🇳","🇺🇬","🇿🇲","🇿🇼"
    ],
    "Asia": [
      "🇦🇫","🇦🇲","🇦🇿","🇧🇭","🇧🇩","🇧🇹","🇧🇳","🇰🇭","🇨🇳","🇨🇾","🇬🇪","🇮🇳",
      "🇮🇩","🇮🇷","🇮🇶","🇮🇱","🇯🇵","🇯🇴","🇰🇿","🇰🇼","🇰🇬","🇱🇦","🇱🇧","🇲🇾",
      "🇲🇻","🇲🇳","🇲🇲","🇳🇵","🇰🇵","🇴🇲","🇵🇰","🇵🇸","🇵🇭","🇶🇦","🇸🇦","🇸🇬",
      "🇰🇷","🇱🇰","🇸🇾","🇹🇼","🇹🇯","🇹🇭","🇹🇱","🇹🇷","🇹🇲","🇦🇪","🇺🇿","🇻🇳",
      "🇾🇪"
    ],
    "Europe": [
      "🇦🇱","🇦🇩","🇦🇹","🇧🇾","🇧🇪","🇧🇦","🇧🇬","🇭🇷","🇨🇿","🇩🇰","🇪🇪","🇫🇮",
      "🇫🇷","🇩🇪","🇬🇷","🇭🇺","🇮🇸","🇮🇪","🇮🇹","🇽🇰","🇱🇻","🇱🇮","🇱🇹","🇱🇺",
      "🇲🇹","🇲🇩","🇲🇨","🇲🇪","🇳🇱","🇲🇰","🇳🇴","🇵🇱","🇵🇹","🇷🇴","🇷🇺","🇸🇲",
      "🇷🇸","🇸🇰","🇸🇮","🇪🇸","🇸🇪","🇨🇭","🇺🇦","🇬🇧","🇻🇦"
    ],
    "North America": [
      "🇦🇬","🇧🇸","🇧🇧","🇧🇿","🇨🇦","🇨🇷","🇨🇺","🇩🇲","🇩🇴","🇸🇻","🇬🇩","🇬🇹",
      "🇭🇹","🇭🇳","🇯🇲","🇲🇽","🇳🇮","🇵🇦","🇰🇳","🇱🇨","🇻🇨","🇹🇹","🇺🇸"
    ],
    "South America": [
      "🇦🇷","🇧🇴","🇧🇷","🇨🇱","🇨🇴","🇪🇨","🇬🇾","🇵🇾","🇵🇪","🇸🇷","🇺🇾","🇻🇪"
    ],
    "Oceania": [
      "🇦🇺","🇫🇯","🇰🇮","🇲🇭","🇫🇲","🇳🇷","🇳🇿","🇵🇼","🇵🇬","🇼🇸","🇸🇧","🇹🇴",
      "🇹🇻","🇻🇺"
    ]
  };
  
  // Отрисовка трекинга на главном экране
  function renderTracking() {
    const list = document.getElementById("tracking-list");
    if (!list) return;
  
    list.innerHTML = "";
    state.tracking.forEach(item => {
      const card = document.createElement("div");
      card.className = "tracking-card";
  
      const info = document.createElement("div");
      info.className = "tracking-info";
  
      const title = document.createElement("div");
      title.className = "tracking-title";
      title.textContent = `To ${item.to}`;
  
      const subtitle = document.createElement("div");
      subtitle.className = "tracking-subtitle";
      subtitle.textContent =
        item.status === "Delivered" ? "Delivered" : "In Transit";
  
      info.appendChild(title);
      info.appendChild(subtitle);
  
      const status = document.createElement("div");
      status.className = "tracking-status";
      status.textContent = item.status;
  
      card.appendChild(info);
      card.appendChild(status);
      list.appendChild(card);
    });
  }
  
  // Синхронизация цифр по открыткам и энергии
  function syncAssets() {
    const p = state.postcards;
    const e = state.energy;
  
    const postcardIds = ["asset-postcards", "create-postcards"];
    postcardIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = p;
    });
  
    const energyIds = ["asset-energy", "create-energy"];
    energyIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = e;
    });
  }
  
  function renderMapSection(mode, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    container.innerHTML = "";
  
    Object.keys(COUNTRIES_BY_CONTINENT).forEach(continent => {
      const flags = COUNTRIES_BY_CONTINENT[continent];
  
      const row = document.createElement("div");
      row.className = "continent-row";
  
      const header = document.createElement("div");
      header.className = "continent-header";
  
      const name = document.createElement("span");
      name.className = "continent-name";
      name.textContent = continent;
  
      const progress = document.createElement("span");
      progress.className = "continent-progress";
      // Сейчас просто показываем кол-во стран в континенте.
      progress.textContent = `${flags.length} countries`;
  
      header.appendChild(name);
      header.appendChild(progress);
  
      const flagGrid = document.createElement("div");
      flagGrid.className = "flag-grid";
  
      flags.forEach(flag => {
        const circle = document.createElement("div");
        circle.className = "flag-circle";
        circle.textContent = flag;
        flagGrid.appendChild(circle);
      });
  
      row.appendChild(header);
      row.appendChild(flagGrid);
      container.appendChild(row);
    });
  }
  
  // Таблица лидеров
  function renderLeaderboard() {
    const list = document.getElementById("leaderboard-list");
    if (!list) return;
  
    list.innerHTML = "";
    state.leaderboard.forEach(player => {
      const li = document.createElement("li");
      li.className = "leaderboard-item";
  
      const name = document.createElement("span");
      name.className = "leaderboard-name";
      name.textContent = player.name;
  
      const stats = document.createElement("span");
      stats.className = "leaderboard-stats";
      stats.textContent = `${player.sent} sent • ${player.countries} countries`;
  
      li.appendChild(name);
      li.appendChild(stats);
      list.appendChild(li);
    });
  }
  
  // Переключение экранов через нижнее меню
  function setupNavigation() {
    const buttons = document.querySelectorAll(".nav-item");
    const screens = document.querySelectorAll(".screen");
  
    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.target;
  
        screens.forEach(scr => {
          scr.classList.toggle(
            "screen-active",
            scr.dataset.screen === target
          );
        });
  
        buttons.forEach(b =>
          b.classList.toggle("nav-active", b === btn)
        );
      });
    });
  }

  function renderPostcardCollection(type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
  
    const list = state[type]; // "sentPostcards" или "receivedPostcards"
    container.innerHTML = "";
  
    list.forEach(cardData => {
      const card = document.createElement("div");
      card.className = "postcard-card";
  
      const header = document.createElement("div");
      header.className = "postcard-card-header";
  
      const flag = document.createElement("span");
      flag.className = "postcard-flag";
      flag.textContent = cardData.countryFlag;
  
      const dest = document.createElement("span");
      dest.className = "postcard-destination";
      dest.textContent = cardData.to;
  
      header.appendChild(flag);
      header.appendChild(dest);
  
      const meta = document.createElement("div");
      meta.className = "postcard-meta";
      meta.textContent = cardData.status;
  
      card.appendChild(header);
      card.appendChild(meta);
      container.appendChild(card);
    });
  }
  
  function setupConstructorToggle() {
    const modes = document.querySelectorAll(".constructor-mode");
    const panels = document.querySelectorAll(".constructor-panel");
  
    if (!modes.length || !panels.length) return;
  
    modes.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
  
        modes.forEach(b =>
          b.classList.toggle("constructor-mode-active", b === btn)
        );
  
        panels.forEach(panel => {
          const panelMode = panel.dataset.panel;
          panel.classList.toggle(
            "constructor-panel-hidden",
            panelMode !== mode
          );
        });
      });
    });
  }

  function setupExpandableBlocks() {
    const homeScreen = document.getElementById('home-screen');
    const blocks = document.querySelectorAll('.clickable-block');
  
    blocks.forEach(block => {
      let startY = 0;
      const handle = block.querySelector('.gesture-handle');
      if (!handle) return;
  
      // ОБРАБОТКА ДЛЯ ТЕЛЕФОНОВ (Touch)
      handle.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
      }, { passive: true });
  
      handle.addEventListener('touchend', (e) => {
        const endY = e.changedTouches[0].clientY;
        handleGesture(startY, endY, block, blocks, homeScreen);
      }, { passive: true });
  
      // ОБРАБОТКА ДЛЯ МЫШКИ (Mouse) - чтобы работало прямо в браузере
      handle.addEventListener('mousedown', (e) => {
        startY = e.clientY;
        
        const onMouseMove = (moveEvent) => {
          // Можно добавить визуальный сдвиг при движении, если нужно
        };
  
        const onMouseUp = (upEvent) => {
          const endY = upEvent.clientY;
          handleGesture(startY, endY, block, blocks, homeScreen);
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
  
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
    });
  }
  
  // Вынесем логику в отдельную функцию, чтобы не дублировать
  function handleGesture(startY, endY, block, blocks, homeScreen) {
    const diffY = endY - startY;
    const threshold = 30; // Чувствительность
    const isExpanded = block.classList.contains('expanded');
  
    // Свайп ВНИЗ (открываем)
    if (diffY > threshold && !isExpanded) {
      blocks.forEach(b => b.classList.remove('expanded'));
      block.classList.add('expanded');
      homeScreen.classList.add('has-expanded');
    } 
    // Свайп ВВЕРХ (закрываем)
    else if (diffY < -threshold && isExpanded) {
      block.classList.remove('expanded');
      homeScreen.classList.remove('has-expanded');
    }
  }
  
function setupProfileEditing() {
  const btn = document.getElementById('edit-profile-btn');
  
  // Элементы отображения
  const nameDisp = document.getElementById('display-name');
  const aboutDisp = document.getElementById('display-about');
  
  // Элементы ввода
  const nameInput = document.getElementById('edit-name-input');
  const aboutInput = document.getElementById('edit-about-input');

  let isEditing = false;

  btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Чтобы блок не закрывался при клике на кнопку

      if (!isEditing) {
          // Переходим в режим редактирования
          isEditing = true;
          btn.textContent = "Save Changes";
          btn.style.background = "#4CAF50"; // Зеленый цвет для сохранения

          // Подставляем текущие значения в инпуты
          nameInput.value = nameDisp.textContent;
          aboutInput.value = aboutDisp.textContent;

          // Переключаем видимость
          nameDisp.style.display = "none";
          aboutDisp.style.display = "none";
          nameInput.style.display = "block";
          aboutInput.style.display = "block";
      } else {
          // Сохраняем и выходим из режима
          isEditing = false;
          btn.textContent = "Edit Profile";
          btn.style.background = "#f28b68"; // Возвращаем исходный цвет

          // Обновляем текст из инпутов
          nameDisp.textContent = nameInput.value;
          aboutDisp.textContent = aboutInput.value;
          
          // Также меняем букву в аватаре (первая буква имени)
          document.getElementById('display-avatar').textContent = nameInput.value.charAt(0).toUpperCase();

          // Переключаем видимость обратно
          nameDisp.style.display = "block";
          aboutDisp.style.display = "block";
          nameInput.style.display = "none";
          aboutInput.style.display = "none";
      }
  });
}

  // Инициализация
  document.addEventListener("DOMContentLoaded", () => {
    renderTracking();
    syncAssets();
    setupNavigation();
  
    renderMapSection("sent", "sent-by-continent");
    renderMapSection("received", "received-by-continent");
    renderLeaderboard();
  
    // Коллекции открыток
    renderPostcardCollection("sentPostcards", "sent-postcards-grid");
    renderPostcardCollection("receivedPostcards", "received-postcards-grid");
  
    // Переключение режимов конструктора
    setupConstructorToggle();

    // Функция раскрытия блоков (аккордеон)
    setupExpandableBlocks();

    // ВОТ ЭТУ СТРОЧКУ НУЖНО ДОБАВИТЬ:
    setupProfileEditing(); 
  });

  