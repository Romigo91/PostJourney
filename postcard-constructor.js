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
        font: "'Brush Script MT', cursive", // Шрифт по умолчанию
        currentSide: 'front'
    };

    const updateDisplay = () => {
        previewContent.innerHTML = ''; 
    
        if (postcardData.currentSide === 'front') {
            // --- ЛИЦЕВАЯ СТОРОНА ---
            stampArea.style.display = 'none'; 
            if (postcardData.frontImage) {
                // Убираем все отступы и ставим display: block для идеального прилегания
                previewContent.innerHTML = `<img src="${postcardData.frontImage}" style="width: 100%; height: 100%; object-fit: cover; display: block; margin: 0; padding: 0; border: none; object-position: center;">`;
            } else {
                previewContent.innerHTML = `<span style="color: #ccc;">Front Side Preview</span>`;
            }
        } else {
            // --- ОБОРОТНАЯ СТОРОНА ---
            stampArea.style.display = 'none'; 
    
            const textContainer = document.createElement('div');
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
                background: #fff;
                display: block;
                line-height: 1.4;
            `;
    
            // СОЗДАЕМ МАРКУ С FLOAT
            const innerStamp = document.createElement('div');
            innerStamp.innerHTML = '📬';
            innerStamp.style.cssText = `
                float: right;
                width: 50px;
                height: 65px;
                border: 2px dashed #ccc;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #fafafa;
                font-size: 24px;
                margin-left: 15px;
                margin-bottom: 5px;
                font-family: sans-serif;
            `;
    
            const textContent = document.createTextNode(postcardData.message || "Write your message here...");
            
            textContainer.appendChild(innerStamp);
            textContainer.appendChild(textContent);
            previewContent.appendChild(textContainer);
    
            // --- МАГИЯ АВТОПОДБОРА ШРИФТА ---
            let fontSize = 20; 
            textContainer.style.fontSize = fontSize + 'px';
    
            while (textContainer.scrollHeight > textContainer.offsetHeight && fontSize > 10) {
                fontSize -= 0.5;
                textContainer.style.fontSize = fontSize + 'px';
            }
        }
    };

    btnGenerateAI.onclick = async () => {
        const promptText = aiPrompt.value.trim();
        if (!promptText) return alert("Введите описание!");
    
        btnGenerateAI.disabled = true;
        progressContainer.style.display = 'block';
        
        // Эмуляция прогресса
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 95) {
                progress += (95 - progress) * 0.05;
                progressBar.style.width = Math.round(progress) + '%';
                progressPercent.innerText = Math.round(progress) + '%';
            }
        }, 400);
    
        const seed = Math.floor(Math.random() * 1000000);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?seed=${seed}&width=1024&height=768&model=flux&nologo=true`;
    
        // Функция-обертка для загрузки через Image объект
        const loadImage = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous"; // Важно для работы с Canvas
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error("Ошибка загрузки изображения"));
                img.src = url;
            });
        };
    
        try {
            // Пробуем загрузить
            const img = await loadImage(imageUrl);
    
            // Если успешно, сохраняем URL (или конвертируем в Base64/Blob если нужно)
            postcardData.frontImage = imageUrl; 
            postcardData.currentSide = 'front';
    
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressPercent.innerText = '100%';
    
            if (btnFront) {
                btnFront.classList.add('constructor-mode-active');
                panelFront.style.display = 'block';
                panelBack.style.display = 'none';
            }
    
            updateDisplay();
    
        } catch (e) {
            clearInterval(progressInterval);
            console.error("Генерация не удалась:", e);
            alert("Похоже, сервер генерации занят. Попробуйте еще раз через пару секунд — иногда помогает просто повторный клик.");
        } finally {
            setTimeout(() => {
                progressContainer.style.display = 'none';
                btnGenerateAI.disabled = false;
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

    // Изменение шрифта
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