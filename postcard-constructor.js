document.addEventListener('DOMContentLoaded', () => {
    // 1. ЭЛЕМЕНТЫ УПРАВЛЕНИЯ
    const btnFront = document.getElementById('btn-front-side');
    const btnBack = document.getElementById('btn-back-side');
    const panelFront = document.getElementById('panel-front');
    const panelBack = document.getElementById('panel-back');

    const modeButtons = document.querySelectorAll('.constructor-toggle .constructor-mode');
    const panels = document.querySelectorAll('.constructor-panel');

    const frontUpload = document.getElementById('front-upload');
    const previewContent = document.getElementById('preview-content');
    const stampArea = document.getElementById('stamp-area');
    
    const cardMessage = document.getElementById('card-message');
    const fontSelect = document.getElementById('font-select');
    const charCount = document.getElementById('char-count');

    // Элементы AI генерации
    const btnGenerateAI = document.getElementById('btn-generate-ai');
    const aiPrompt = document.getElementById('ai-prompt');
    const progressContainer = document.getElementById('ai-progress-container');
    const progressBar = document.getElementById('ai-progress-bar');
    const progressPercent = document.getElementById('ai-progress-percent');

    // 2. ХРАНИЛИЩЕ ДАННЫХ
    let postcardData = {
        frontImage: null,
        message: '',
        font: "'Brush Script MT', cursive",
        currentSide: 'front'
    };

    const updateDisplay = () => {
        previewContent.innerHTML = ''; 
    
        if (postcardData.currentSide === 'front') {
            // --- ЛИЦЕВАЯ СТОРОНА ---
            stampArea.style.display = 'none'; 
            if (postcardData.frontImage) {
                // Используем object-fit: cover, чтобы картинка не ломала пропорции
                previewContent.innerHTML = `<img src="${postcardData.frontImage}" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
            } else {
                previewContent.innerHTML = `<span style="color: #ccc;">Front Side Preview</span>`;
            }
        } else {
            // --- ОБОРОТНАЯ СТОРОНА ---
            // Скрываем внешнюю марку, будем использовать внутреннюю
            stampArea.style.display = 'none'; 
    
            const textContainer = document.createElement('div');
            // Стили контейнера: ВАЖНО добавить display: block и убрать любые float
            textContainer.style.cssText = `
                width: 100%; 
                height: 100%; 
                padding: 20px; 
                box-sizing: border-box; 
                font-family: ${postcardData.font}; 
                color: #333; 
                overflow: hidden; 
                white-space: pre-wrap; 
                word-break: break-word; 
                position: relative;
                background: #fff;
                display: block;
            `;
    
            // Создаем марку. Используем position: absolute вместо float!
            // Это гарантирует, что она не сдвинет блоки ВНЕ превью.
            const innerStamp = document.createElement('div');
            innerStamp.innerHTML = '📬';
            innerStamp.style.cssText = `
                position: absolute;
                top: 15px;
                right: 15px;
                width: 50px;
                height: 65px;
                border: 2px dashed #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #fafafa;
                font-size: 24px;
                z-index: 2;
            `;
    
            // Чтобы текст не заходил ПОД марку, добавим обертку для текста с отступом справа
            const textSpan = document.createElement('div');
            textSpan.innerText = postcardData.message || "Write your message here...";
            textSpan.style.cssText = `
                width: 100%;
                height: 100%;
                padding-right: 60px; /* Резервируем место под марку, чтобы текст ее не перекрывал */
                display: block;
            `;
    
            textContainer.appendChild(innerStamp);
            textContainer.appendChild(textSpan);
            previewContent.appendChild(textContainer);
    
            // --- МАГИЯ АВТОПОДБОРА ШРИФТА ---
            let fontSize = 20; 
            textContainer.style.fontSize = fontSize + 'px';
    
            // Проверка: пока текст не влезает в контейнер, уменьшаем шрифт
            // Используем scrollHeight, чтобы понимать реальный размер текста
            while (textSpan.scrollHeight > textContainer.offsetHeight - 40 && fontSize > 10) {
                fontSize -= 0.5;
                textContainer.style.fontSize = fontSize + 'px';
            }
        }
    };
   // --- ЛОГИКА AI ГЕНЕРАЦИИ ---
   btnGenerateAI.onclick = async () => {
    const promptText = aiPrompt.value.trim();
    if (!promptText) return alert("Please enter a prompt!");

    // 1. UI и Прогресс
    btnGenerateAI.disabled = true;
    progressContainer.style.display = 'block';
    let progress = 0;
    progressBar.style.width = '0%';
    
    const progressInterval = setInterval(() => {
        if (progress < 90) {
            progress += 1;
            progressBar.style.width = progress + '%';
            progressPercent.innerText = Math.round(progress) + '%';
        }
    }, 100);

    // 2. ИСПОЛЬЗУЕМ НОВЫЙ СЕРВИС (Stable Diffusion / Flux)
    // Этот URL напрямую обращается к генератору, который возвращает JPG/PNG
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=1024&height=768&seed=${seed}&nologo=true&enhance=false`;

    // 3. ПРОВЕРКА ЧЕРЕЗ FETCH (с обходом кэша)
    try {
        // Мы просто пытаемся "простучать" ссылку
        const response = await fetch(imageUrl, { mode: 'no-cors' });
        
        // Ждем небольшую паузу для генерации на стороне сервера
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 4. Отрисовка
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        progressPercent.innerText = '100%';

        postcardData.frontImage = imageUrl;
        postcardData.currentSide = 'front';
        
        if (btnFront) btnFront.click();

        const previewContent = document.getElementById('preview-content');
        if (previewContent) {
            // 1. Полная очистка контейнера и сброс мешающих стилей
            previewContent.innerHTML = '';
            previewContent.style.padding = '0'; 
            previewContent.style.margin = '0';
            previewContent.style.overflow = 'hidden';
            
            // Используем flex, чтобы картинка центрировалась мертво
            previewContent.style.display = 'flex'; 
            previewContent.style.alignItems = 'center';
            previewContent.style.justifyContent = 'center';

            const finalImg = new Image();
            
            finalImg.onload = () => {
                // Очищаем еще раз перед вставкой, чтобы убрать возможные тексты ошибок
                previewContent.innerHTML = ''; 
                previewContent.appendChild(finalImg);
            };
            
            finalImg.onerror = () => {
                const fallback = `https://loremflickr.com/1200/800/${encodeURIComponent(promptText)}`;
                // Если сработала ошибка, подменяем источник. Onload сработает для fallback автоматически.
                finalImg.src = fallback;
                previewContent.innerHTML = `<p style="color:red; font-size:10px; position:absolute;">AI Load Error. Trying fallback...</p>`;
            };

            // Устанавливаем адрес картинки
            finalImg.src = imageUrl;

            // 2. ЖЕСТКИЕ стили для картинки, чтобы она не "гуляла"
            finalImg.style.width = '100%';
            finalImg.style.height = '100%';
            finalImg.style.objectFit = 'cover';    // Заполнение без пустых мест
            finalImg.style.objectPosition = 'center'; 
            finalImg.style.display = 'block';       // Убирает системный отступ снизу
            finalImg.style.margin = '0';            // Убирает внешние отступы
            finalImg.style.border = 'none';         // На всякий случай
        }

    } catch (e) {
        console.error("Critical error:", e);
    } finally {
        setTimeout(() => {
            if (progressContainer) progressContainer.style.display = 'none';
            if (btnGenerateAI) btnGenerateAI.disabled = false;
        }, 1000);
    }
};

    // --- ОБРАБОТКА ТЕКСТА ---
    cardMessage.addEventListener('input', (e) => {
        const text = e.target.value;
        postcardData.message = text;
        
        const currentLen = text.length;
        charCount.innerText = `${currentLen} / 150`;
        
        charCount.style.color = currentLen >= 130 ? '#ff4d4d' : 'var(--text-sub)';
    
        if (postcardData.currentSide === 'back') updateDisplay();
    });

    fontSelect.addEventListener('change', (e) => {
        postcardData.font = e.target.value;
        if (postcardData.currentSide === 'back') updateDisplay();
    });

    // --- ПЕРЕКЛЮЧЕНИЕ СТОРОН ---
    btnFront.onclick = () => {
        postcardData.currentSide = 'front';
        btnFront.classList.add('constructor-mode-active');
        btnBack.classList.remove('constructor-mode-active');
        panelFront.style.display = 'block';
        panelBack.style.display = 'none';
        updateDisplay();
    };

    btnBack.onclick = () => {
        postcardData.currentSide = 'back';
        btnBack.classList.add('constructor-mode-active');
        btnFront.classList.remove('constructor-mode-active');
        panelBack.style.display = 'block';
        panelFront.style.display = 'none';
        updateDisplay();
    };

    // --- AI VS UPLOAD PANELS ---
    modeButtons.forEach(btn => {
        btn.onclick = () => {
            const mode = btn.getAttribute('data-mode');
            modeButtons.forEach(b => b.classList.remove('constructor-mode-active'));
            btn.classList.add('constructor-mode-active');
            panels.forEach(p => {
                p.style.display = (p.getAttribute('data-panel') === mode) ? 'block' : 'none';
            });
        };
    });

    // --- ЗАГРУЗКА ФОТО ---
    frontUpload.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                postcardData.frontImage = event.target.result;
                postcardData.currentSide = 'front';
                updateDisplay();
            };
            reader.readAsDataURL(file);
        }
    };

    // Инициализация
    updateDisplay();
});