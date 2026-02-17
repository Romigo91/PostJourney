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
  
  // Карта: отрисовка блоков по континентам (и для отправленных, и для полученных)
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

  // Home: раскрывающийся главный блок
function setupHomeMainToggle() {
  const homeMain = document.getElementById("home-main");
  if (!homeMain) return;

  // Начальное состояние: свернуто
  homeMain.classList.add("home-main-collapsed");

  homeMain.addEventListener("click", () => {
    const isExpanded = homeMain.classList.contains("home-main-expanded");

    // Если был раскрыт — свернуть, если был свернут — раскрыть
    homeMain.classList.toggle("home-main-expanded", !isExpanded);
    homeMain.classList.toggle("home-main-collapsed", isExpanded);
  });
}

// Home: три раскрывающихся блока
function setupHomeBlocksToggle() {
  const profileBlock = document.querySelector(".profile-card");
  const assetsBlock = document.querySelector(".home-assets");
  const trackingBlock = document.querySelector(".home-tracking");

  const blocks = [profileBlock, assetsBlock, trackingBlock].filter(Boolean);

  if (!blocks.length) return;

  blocks.forEach(block => {
    // класс home-expandable мы уже добавили в HTML, но можно продублировать
    block.classList.add("home-expandable");

    block.addEventListener("click", () => {
      const alreadyExpanded = block.classList.contains("home-block-expanded");

      if (alreadyExpanded) {
        // Был раскрыт — вернуть всё как было: показать все три
        blocks.forEach(b => {
          b.classList.remove("home-block-expanded", "home-block-hidden");
        });
      } else {
        // Раскрыть только текущий, остальные спрятать
        blocks.forEach(b => {
          const isCurrent = b === block;
          b.classList.toggle("home-block-expanded", isCurrent);
          b.classList.toggle("home-block-hidden", !isCurrent);
        });
      }
    });
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
    // Home: три раскрывающихся блока
  setupHomeBlocksToggle();
  });

  