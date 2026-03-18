// ==========================================================================
// 1. ИДЕАЛЬНО СИНХРОНИЗИРОВАННАЯ БАЗА КООРДИНАТ (СТРОГО ПО ТВОИМ СПИСКАМ)
// ==========================================================================
const FLAG_COORDS = {
    // === Africa (54) ===
    "🇩🇿":{lat:28.0,lon:1.6}, "🇦🇴":{lat:-11.2,lon:17.8}, "🇧🇯":{lat:9.3,lon:2.3}, "🇧🇼":{lat:-22.3,lon:24.6},
    "🇧🇫":{lat:12.2,lon:-1.5}, "🇧🇮":{lat:-3.3,lon:29.9}, "🇨🇻":{lat:16.5,lon:-23.0}, "🇨🇲":{lat:3.8,lon:11.5},
    "🇨🇫":{lat:6.6,lon:20.9}, "🇹🇩":{lat:15.4,lon:18.7}, "🇰🇲":{lat:-11.8,lon:43.8}, "🇨🇩":{lat:-4.0,lon:21.7},
    "🇨🇬":{lat:-0.2,lon:15.8}, "🇩🇯":{lat:11.8,lon:42.5}, "🇪🇬":{lat:26.8,lon:30.8}, "🇬🇶":{lat:1.6,lon:10.2},
    "🇪🇷":{lat:15.1,lon:39.7}, "🇸🇿":{lat:-26.5,lon:31.4}, "🇪🇹":{lat:9.1,lon:40.4}, "🇬🇦":{lat:-0.8,lon:11.6},
    "🇬🇲":{lat:13.4,lon:-15.3}, "🇬🇭":{lat:7.9,lon:-1.0}, "🇬🇳":{lat:9.9,lon:-9.6}, "🇬🇼":{lat:11.8,lon:-15.1},
    "🇨🇮":{lat:7.5,lon:-5.5}, "🇰🇪":{lat:-0.0,lon:37.9}, "🇱🇸":{lat:-29.6,lon:28.2}, "🇱🇷":{lat:6.4,lon:-9.4},
    "🇱🇾":{lat:26.3,lon:17.2}, "🇲🇬":{lat:-18.7,lon:46.8}, "🇲🇼":{lat:-13.2,lon:34.3}, "🇲🇱":{lat:17.5,lon:-3.9},
    "🇲🇷":{lat:21.0,lon:-10.9}, "🇲🇺":{lat:-20.3,lon:57.5}, "🇲🇦":{lat:31.7,lon:-7.0}, "🇲🇿":{lat:-18.6,lon:35.5},
    "🇳🇦":{lat:-22.9,lon:18.4}, "🇳🇪":{lat:17.6,lon:8.0}, "🇳🇬":{lat:9.0,lon:8.6}, "🇷🇼":{lat:-1.9,lon:29.8},
    "🇸🇹":{lat:0.1,lon:6.6}, "🇸🇳":{lat:14.4,lon:-14.4}, "🇸🇨":{lat:-4.6,lon:55.4}, "🇸🇱":{lat:8.4,lon:-11.7},
    "🇸🇴":{lat:5.1,lon:46.1}, "🇿🇦":{lat:-30.5,lon:22.9}, "🇸🇸":{lat:6.8,lon:31.3}, "🇸🇩":{lat:12.8,lon:30.2},
    "🇹🇿":{lat:-6.3,lon:34.8}, "🇹🇬":{lat:8.6,lon:0.8}, "🇹🇳":{lat:33.8,lon:9.5}, "🇺🇬":{lat:1.3,lon:32.2},
    "🇿🇲":{lat:-13.1,lon:27.8}, "🇿🇼":{lat:-19.0,lon:29.1},

    // === Asia (49) ===
    "🇦🇫":{lat:33.9,lon:67.7}, "🇦🇲":{lat:40.0,lon:45.0}, "🇦🇿":{lat:40.1,lon:47.5}, "🇧🇭":{lat:26.0,lon:50.5},
    "🇧🇩":{lat:23.6,lon:90.3}, "🇧🇹":{lat:27.5,lon:90.4}, "🇧🇳":{lat:4.5,lon:114.7}, "🇰🇭":{lat:12.5,lon:104.9},
    "🇨🇳":{lat:35.8,lon:104.1}, "🇨🇾":{lat:35.1,lon:33.4}, "🇬🇪":{lat:42.3,lon:43.3}, "🇮🇳":{lat:20.5,lon:78.9},
    "🇮🇩":{lat:-0.7,lon:113.9}, "🇮🇷":{lat:32.4,lon:53.6}, "🇮🇶":{lat:33.2,lon:43.6}, "🇮🇱":{lat:31.0,lon:34.8},
    "🇯🇵":{lat:36.2,lon:138.2}, "🇯🇴":{lat:30.5,lon:36.2}, "🇰🇿":{lat:48.0,lon:66.9}, "🇰🇼":{lat:29.3,lon:47.4},
    "🇰🇬":{lat:41.2,lon:74.7}, "🇱🇦":{lat:19.8,lon:102.4}, "🇱🇧":{lat:33.8,lon:35.8}, "🇲🇾":{lat:4.2,lon:101.9},
    "🇲🇻":{lat:3.2,lon:73.2}, "🇲🇳":{lat:46.8,lon:103.8}, "🇲🇲":{lat:21.9,lon:95.9}, "🇳🇵":{lat:28.3,lon:84.1},
    "🇰🇵":{lat:40.3,lon:127.5}, "🇴🇲":{lat:21.5,lon:55.9}, "🇵🇰":{lat:30.3,lon:69.3}, "🇵🇸":{lat:31.9,lon:35.2},
    "🇵🇭":{lat:12.8,lon:121.7}, "🇶🇦":{lat:25.3,lon:51.1}, "🇸🇦":{lat:23.8,lon:45.0}, "🇸🇬":{lat:1.3,lon:103.8},
    "🇰🇷":{lat:35.9,lon:127.7}, "🇱🇰":{lat:7.8,lon:80.7}, "🇸🇾":{lat:34.8,lon:38.9}, "🇹🇼":{lat:23.6,lon:120.9},
    "🇹🇯":{lat:38.8,lon:71.2}, "🇹🇭":{lat:15.8,lon:100.9}, "🇹🇱":{lat:-8.8,lon:125.7}, "🇹🇷":{lat:38.9,lon:35.2},
    "🇹🇲":{lat:38.9,lon:59.5}, "🇦🇪":{lat:23.4,lon:53.8}, "🇺🇿":{lat:41.3,lon:64.5}, "🇻🇳":{lat:14.0,lon:108.2},
    "🇾🇪":{lat:15.5,lon:48.5},

    // === Europe (45) ===
    "🇦🇱":{lat:41.1,lon:20.1}, "🇦🇩":{lat:42.5,lon:1.5}, "🇦🇹":{lat:47.5,lon:14.5}, "🇧🇾":{lat:53.7,lon:27.9},
    "🇧🇪":{lat:50.5,lon:4.4}, "🇧🇦":{lat:43.9,lon:17.6}, "🇧🇬":{lat:42.7,lon:25.4}, "🇭🇷":{lat:45.1,lon:15.2},
    "🇨🇿":{lat:49.8,lon:15.4}, "🇩🇰":{lat:56.2,lon:9.5}, "🇪🇪":{lat:58.5,lon:25.0}, "🇫🇮":{lat:61.9,lon:25.7},
    "🇫🇷":{lat:46.2,lon:2.2}, "🇩🇪":{lat:51.1,lon:10.4}, "🇬🇷":{lat:39.0,lon:21.8}, "🇭🇺":{lat:47.1,lon:19.5},
    "🇮🇸":{lat:64.9,lon:-19.0}, "🇮🇪":{lat:53.1,lon:-7.6}, "🇮🇹":{lat:41.8,lon:12.5}, "🇽🇰":{lat:42.6,lon:20.9},
    "🇱🇻":{lat:56.8,lon:24.6}, "🇱🇮":{lat:47.1,lon:9.5}, "🇱🇹":{lat:55.1,lon:23.8}, "🇱🇺":{lat:49.8,lon:6.1},
    "🇲🇹":{lat:35.9,lon:14.3}, "🇲🇩":{lat:47.4,lon:28.3}, "🇲🇨":{lat:43.7,lon:7.4}, "🇲🇪":{lat:42.7,lon:19.3},
    "🇳🇱":{lat:52.1,lon:5.2}, "🇲🇰":{lat:41.6,lon:21.7}, "🇳🇴":{lat:60.4,lon:8.4}, "🇵🇱":{lat:51.9,lon:19.1},
    "🇵🇹":{lat:39.3,lon:-8.2}, "🇷🇴":{lat:45.9,lon:24.9}, "🇷🇺":{lat:61.5,lon:105.3}, "🇸🇲":{lat:43.9,lon:12.4},
    "🇷🇸":{lat:44.0,lon:21.0}, "🇸🇰":{lat:48.6,lon:19.6}, "🇸🇮":{lat:46.1,lon:14.9}, "🇪🇸":{lat:40.4,lon:-3.7},
    "🇸🇪":{lat:60.1,lon:18.6}, "🇨🇭":{lat:46.8,lon:8.2}, "🇺🇦":{lat:48.3,lon:31.1}, "🇬🇧":{lat:55.3,lon:-3.4},
    "🇻🇦":{lat:41.9,lon:12.4},

    // === North America (23) ===
    "🇦🇬":{lat:17.0,lon:-61.7}, "🇧🇸":{lat:25.0,lon:-77.3}, "🇧🇧":{lat:13.1,lon:-59.5}, "🇧🇿":{lat:17.1,lon:-88.4},
    "🇨🇦":{lat:56.1,lon:-106.3}, "🇨🇷":{lat:9.7,lon:-83.7}, "🇨🇺":{lat:21.5,lon:-77.7}, "🇩🇲":{lat:15.4,lon:-61.3},
    "🇩🇴":{lat:18.7,lon:-70.1}, "🇸🇻":{lat:13.7,lon:-88.8}, "🇬🇩":{lat:12.1,lon:-61.6}, "🇬🇹":{lat:15.7,lon:-90.2},
    "🇭🇹":{lat:18.9,lon:-72.2}, "🇭🇳":{lat:15.2,lon:-86.2}, "🇯🇲":{lat:18.1,lon:-77.2}, "🇲🇽":{lat:23.6,lon:-102.5},
    "🇳🇮":{lat:12.8,lon:-85.2}, "🇵🇦":{lat:8.5,lon:-80.7}, "🇰🇳":{lat:17.3,lon:-62.7}, "🇱🇨":{lat:13.9,lon:-60.9},
    "🇻🇨":{lat:13.2,lon:-61.1}, "🇹🇹":{lat:10.6,lon:-61.2}, "🇺🇸":{lat:37.0,lon:-95.7},

    // === South America (12) ===
    "🇦🇷":{lat:-38.4,lon:-63.6}, "🇧🇴":{lat:-16.2,lon:-63.5}, "🇧🇷":{lat:-14.2,lon:-51.9}, "🇨🇱":{lat:-35.6,lon:-71.5},
    "🇨🇴":{lat:4.5,lon:-74.2}, "🇪🇨":{lat:-1.8,lon:-78.1}, "🇬🇾":{lat:4.8,lon:-58.9}, "🇵🇾":{lat:-23.4,lon:-58.4},
    "🇵🇪":{lat:-9.1,lon:-75.0}, "🇸🇷":{lat:3.9,lon:-56.0}, "🇺🇾":{lat:-32.5,lon:-55.7}, "🇻🇪":{lat:6.4,lon:-66.5},

    // === Oceania (14) ===
    "🇦🇺":{lat:-25.2,lon:133.7}, "🇫🇯":{lat:-17.7,lon:178.0}, "🇰🇮":{lat:-3.3,lon:-168.7}, "🇲🇭":{lat:7.1,lon:171.1},
    "🇫🇲":{lat:7.4,lon:150.5}, "🇳🇷":{lat:-0.5,lon:166.9}, "🇳🇿":{lat:-40.9,lon:174.8}, "🇵🇼":{lat:7.5,lon:134.5},
    "🇵🇬":{lat:-6.3,lon:143.9}, "🇼🇸":{lat:-13.7,lon:-172.1}, "🇸🇧":{lat:-9.6,lon:160.1}, "🇹🇴":{lat:-21.1,lon:-175.1},
    "🇹🇻":{lat:-7.1,lon:177.6}, "🇻🇺":{lat:-15.3,lon:166.9}
};

// ==========================================================================
// 2. ДИНАМИЧЕСКИЕ ГОРОДА (ТОЛЬКО ДЛЯ ТЕКСТА)
// ==========================================================================
let worldCitiesDb = {}; 
async function fetchCitiesData() {
    try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data = await response.json();
        if (!data.error && data.data) {
            data.data.forEach(item => { worldCitiesDb[item.country] = item.cities; });
        }
    } catch (e) { console.warn("API городов недоступен"); }
}
fetchCitiesData(); 

window.getRandomCity = function(countryName) {
    if (!countryName) return "Capital";
    const cities = worldCitiesDb[countryName.trim()];
    return (cities && cities.length > 0) ? cities[Math.floor(Math.random() * cities.length)] : "Capital"; 
};

// ==========================================================================
// 3. ЖЕЛЕЗОБЕТОННАЯ ЛОГИСТИКА ПО ЭМОДЗИ-ФЛАГАМ
// ==========================================================================

// Умная переменная: теперь она находит ТВОЙ ФЛАГ из профиля
Object.defineProperty(window, 'MY_HOME_FLAG', {
    get: function() {
        if (typeof state !== 'undefined' && state.profile) {
            if (state.profile.country && typeof countryList !== 'undefined') {
                const found = countryList.find(c => c.name === state.profile.country);
                if (found) return found.flag; // Возвращаем эмодзи-флаг твоей страны!
            }
        }
        return "🇫🇷"; // Страховка
    }
});

function getFallbackDistanceKm(flag1, flag2) {
    const str = flag1 < flag2 ? flag1 + flag2 : flag2 + flag1;
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
    return 1500 + (Math.abs(hash) % 17000);
}

// Расчет дистанции ИСКЛЮЧИТЕЛЬНО по флагам!
function getRealDistanceKm(flag1, flag2) {
    if (!flag1 || !flag2) return 5000;
    
    // Если флаги идентичны - это одна страна (0 км)
    if (flag1 === flag2) return 0;

    const c1 = FLAG_COORDS[flag1];
    const c2 = FLAG_COORDS[flag2];

    if (!c1 || !c2) {
        console.warn(`⚠️ Флаг не найден в базе! Откуда: ${flag1}, Куда: ${flag2}`);
        return getFallbackDistanceKm(flag1, flag2);
    }

    const R = 6371; 
    const dLat = (c2.lat - c1.lat) * Math.PI / 180;
    const dLon = (c2.lon - c1.lon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.floor(R * c);
}

// Теперь функция принимает ФЛАГИ, а не названия стран
window.calculateDeliveryTime = function(fromFlag, toFlag) {
    const distanceKm = getRealDistanceKm(fromFlag, toFlag);
    
    const minHours = 12;
    const maxHours = 72;
    const maxEarthDistance = 20000; 
    
    let baseDeliveryHours = minHours + (distanceKm / maxEarthDistance) * (maxHours - minHours);
    if (baseDeliveryHours > maxHours) baseDeliveryHours = maxHours;
    if (baseDeliveryHours < minHours) baseDeliveryHours = minHours;

    const deliveryHours = Math.floor(baseDeliveryHours);
    const randomMinutes = Math.floor(Math.random() * 60);
    return new Date().getTime() + (deliveryHours * 60 * 60 * 1000) + (randomMinutes * 60 * 1000);
};