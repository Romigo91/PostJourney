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

    // --- ФУНКЦИЯ ОБНОВЛЕНИЯ ПРЕДПРОСМОТРА ---
    const updateDisplay = () => {
        previewContent.innerHTML = ''; 

        if (postcardData.currentSide === 'front') {
            // ЛИЦО
            stampArea.style.display = 'none'; 
            if (postcardData.frontImage) {
                previewContent.innerHTML = `<img src="${postcardData.frontImage}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
            } else {
                previewContent.innerHTML = `<span style="color: #ccc;">Front Side Preview</span>`;
            }
        } else {
            // ОБОРОТ
            stampArea.style.display = 'none'; 

            const textContainer = document.createElement('div');
            textContainer.style.width = '100%';
            textContainer.style.height = '100%';
            textContainer.style.padding = '15px';
            textContainer.style.boxSizing = 'border-box';
            textContainer.style.fontFamily = postcardData.font;
            textContainer.style.color = '#333';
            textContainer.style.overflow = 'hidden';
            textContainer.style.whiteSpace = 'pre-wrap';
            textContainer.style.wordBreak = 'break-word';
            textContainer.style.position = 'relative';

            // Создаем марку внутри текстового контейнера для обтекания
            const innerStamp = document.createElement('div');
            innerStamp.innerHTML = '📬';
            innerStamp.style.float = 'right'; 
            innerStamp.style.width = '55px';
            innerStamp.style.height = '70px';
            innerStamp.style.marginLeft = '12px';
            innerStamp.style.marginBottom = '5px';
            innerStamp.style.border = '2px dashed #ccc';
            innerStamp.style.display = 'flex';
            innerStamp.style.alignItems = 'center';
            innerStamp.style.justifyContent = 'center';
            innerStamp.style.background = '#fafafa';
            innerStamp.style.fontSize = '24px';

            textContainer.appendChild(innerStamp);
            
            const textSpan = document.createElement('span');
            textSpan.innerText = postcardData.message || "Write your message here...";
            textContainer.appendChild(textSpan);
            
            previewContent.appendChild(textContainer);

            // --- МАГИЯ АВТОПОДБОРА ШРИФТА ---
            let fontSize = 18; 
            textContainer.style.fontSize = fontSize + 'px';

            while (textContainer.scrollHeight > textContainer.offsetHeight && fontSize > 12) {
                fontSize -= 0.5;
                textContainer.style.fontSize = fontSize + 'px';
            }
        }
    };

   // --- ЛОГИКА AI ГЕНЕРАЦИИ ---
   btnGenerateAI.onclick = () => {
    const promptText = aiPrompt.value.trim();
    if (!promptText) return alert("Please enter a prompt!");

    // 1. Подготовка UI
    btnGenerateAI.disabled = true;
    progressContainer.style.display = 'block';
    let progress = 0;
    progressBar.style.width = '0%';
    progressPercent.innerText = '0%';

    // 2. Анимация полоски (плавное заполнение)
    const progressInterval = setInterval(() => {
        if (progress < 95) {
            progress += Math.random() * 2;
            if (progress > 95) progress = 95;
            progressBar.style.width = progress + '%';
            progressPercent.innerText = Math.round(progress) + '%';
        }
    }, 150);

    // 3. Формируем ссылку
    const seed = Math.floor(Math.random() * 1000000);
    // Используем простую ссылку, она лучше всего работает в локальных файлах
    const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(promptText)}?width=1200&height=800&seed=${seed}&nologo=true`;

    // 4. Мгновенно обновляем данные и переключаем экран
    // Мы не ждем загрузки в памяти, а доверяем это самому браузеру в функции updateDisplay
    postcardData.frontImage = imageUrl;
    postcardData.currentSide = 'front';
    
    // Визуально переключаем вкладки
    btnFront.classList.add('constructor-mode-active');
    btnBack.classList.remove('constructor-mode-active');
    panelFront.style.display = 'block';
    panelBack.style.display = 'none';

    // Вызываем отрисовку — тег <img> в превью сам начнет подгружать картинку по URL
    updateDisplay();

    // 5. Завершаем анимацию загрузки через паузу (имитируем работу AI)
    setTimeout(() => {
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        progressPercent.innerText = '100%';

        setTimeout(() => {
            progressContainer.style.display = 'none';
            btnGenerateAI.disabled = false;
        }, 600);
    }, 4000); // 4 секунды обычно хватает для генерации на сервере
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