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
        font: "'Caveat', cursive", // Ставим новый шрифт по умолчанию
        color: '#1e3799', // Синий цвет чернил по умолчанию
        currentSide: 'front'
    };

    // Функция обновления состояния иконки 3D
    function update3DButtonState() {
        const btn3D = document.getElementById('btn-view-3d');
        if (!btn3D) return; // Защита от ошибок, если элемента нет

        const hasFront = !!postcardData.frontImage; 
        const hasBack = postcardData.message && postcardData.message.trim().length > 0;

        if (hasFront && hasBack) {
            btn3D.classList.remove('disabled');
        } else {
            btn3D.classList.add('disabled');
        }
    }

    const updateDisplay = () => {
        previewContent.innerHTML = ''; 
    
        if (postcardData.currentSide === 'front') {
            stampArea.style.display = 'none'; 
            if (postcardData.frontImage) {
                previewContent.innerHTML = `<img src="${postcardData.frontImage}" style="width: 100%; height: 100%; object-fit: cover; display: block; margin: 0; padding: 0; border: none; object-position: center;">`;
            } else {
                previewContent.innerHTML = `<span style="color: #ccc;">Front Side Preview</span>`;
            }
        } else {
            stampArea.style.display = 'none'; 
    
            const textContainer = document.createElement('div');
            textContainer.style.cssText = `
                width: 100%; 
                height: 100%; 
                padding: 20px; 
                box-sizing: border-box; 
                font-family: ${postcardData.font}; 
                color: ${postcardData.color};
                overflow: hidden; 
                white-space: pre-wrap; 
                word-break: break-word; 
                background: #fff;
                display: block;
                line-height: 1.4;
            `;
    
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
    
            let fontSize = 20; 
            textContainer.style.fontSize = fontSize + 'px';
    
            while (textContainer.scrollHeight > textContainer.offsetHeight && fontSize > 10) {
                fontSize -= 0.5;
                textContainer.style.fontSize = fontSize + 'px';
            }
        }
        update3DButtonState(); // <--- ОБНОВЛЯЕМ ПРИ КАЖДОЙ ПЕРЕРИСОВКЕ
    };

    btnGenerateAI.onclick = async () => {
        const promptText = aiPrompt.value.trim();
        if (!promptText) return alert("Введите описание!");
    
        const API_KEY = 'sk_Q94e3xilY3hHcZKbWZvLuIUosJXgSKMF'; 
        
        const container = document.getElementById('ai-progress-container');
        const bar = document.getElementById('ai-progress-bar');
        const percentText = document.getElementById('ai-progress-percent');
    
        btnGenerateAI.disabled = true;
        container.style.display = 'block';
        bar.style.width = '0%';
        percentText.innerText = "0%";
    
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 3; 
                const rounded = Math.floor(progress);
                bar.style.width = rounded + '%';
                percentText.innerText = rounded + '%';
            }
        }, 400);
    
        try {
            const encodedPrompt = encodeURIComponent(promptText);
            const url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=gptimage&width=1200&height=800&seed=-1`;
    
            const response = await fetch(url, {
                method: "GET",
                headers: { "Authorization": `Bearer ${API_KEY}` }
            });
    
            if (!response.ok) throw new Error("Ошибка API");
    
            const imageBlob = await response.blob();
            
            clearInterval(progressInterval);
            bar.style.width = '100%';
            percentText.innerText = '100%';
    
            const imageUrl = URL.createObjectURL(imageBlob);
            postcardData.frontImage = imageUrl;
            
            updateDisplay();
            update3DButtonState(); // <--- ОБНОВЛЯЕМ ПОСЛЕ ГЕНЕРАЦИИ AI

        } catch (e) {
            clearInterval(progressInterval);
            console.error(e);
            alert("Ошибка генерации: " + e.message);
        } finally {
            btnGenerateAI.disabled = false;
            setTimeout(() => {
                container.style.display = 'none';
            }, 1000);
        }
    };

    cardMessage.addEventListener('input', (e) => {
        const text = e.target.value;
        postcardData.message = text;
        
        const currentLen = text.length;
        charCount.innerText = `${currentLen} / 150`;
        charCount.style.color = currentLen >= 130 ? '#ff4d4d' : 'var(--text-sub)';
        
        updateDisplay();
        update3DButtonState(); // <--- ОБНОВЛЯЕМ ПРИ КАЖДОМ СИМВОЛЕ
    });

    fontSelect.addEventListener('change', (e) => {
        postcardData.font = e.target.value;
        updateDisplay();
    });

    // Обработка клика по кружочкам цвета
    const inkButtons = document.querySelectorAll('.ink-btn');
    inkButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Убираем класс active у всех кнопок
            inkButtons.forEach(b => b.classList.remove('active'));
            // Добавляем класс active той кнопке, на которую нажали
            e.target.classList.add('active');
            
            // Сохраняем цвет и обновляем картинку
            postcardData.color = e.target.getAttribute('data-color');
            updateDisplay();
        });
    });

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

    frontUpload.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                postcardData.frontImage = event.target.result;
                updateDisplay();
                update3DButtonState(); // <--- ОБНОВЛЯЕМ ПОСЛЕ ЗАГРУЗКИ ФАЙЛА
            };
            reader.readAsDataURL(file);
        }
    };

    // Открытие 3D вида
    document.getElementById('btn-view-3d').onclick = function() {
        if (this.classList.contains('disabled')) return;

        const modal = document.getElementById('modal-3d');
        const frontDiv = document.getElementById('3d-front');
        const backDiv = document.getElementById('3d-back');

        // Наполняем контентом (всегда лицевая сторона на фронт)
        frontDiv.innerHTML = `<img src="${postcardData.frontImage}" style="width:100%; height:100%; object-fit:cover;">`;
        
        // Рендерим оборот для 3D
        postcardData.currentSide = 'back'; // Временно переключаем для генерации контента
        updateDisplay(); 
        const previewClone = previewContent.cloneNode(true);
        backDiv.innerHTML = '';
        backDiv.appendChild(previewClone);
        
        // Возвращаем как было в превью
        postcardData.currentSide = 'front'; 
        updateDisplay();

        modal.style.display = 'flex';
    };

// === ЛОГИКА 3D PARALLAX ЭФФЕКТА ===
const wrapper = document.querySelector('.card-3d-wrapper');
const inner = document.getElementById('card-3d-inner');

// 1. Следим за движением мыши
wrapper.addEventListener('mousemove', (e) => {
    // Высчитываем, где находится курсор относительно карточки
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Считаем угол наклона (максимум 15 градусов)
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;

    // Проверяем, перевернута ли сейчас открытка
    const isFlipped = inner.classList.contains('flipped');
    const baseRotateY = isFlipped ? 180 : 0;
    
    // Умножаем на -1 для обратной стороны, чтобы она не "зеркалила" движения
    const finalRotateY = baseRotateY + (isFlipped ? -rotateY : rotateY);

    // Отключаем плавную анимацию на время движения, чтобы наклон был мгновенным
    inner.style.transition = 'none'; 
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${finalRotateY}deg)`;
});

// 2. Возвращаем карточку на место, когда мышка уходит
wrapper.addEventListener('mouseleave', () => {
    const isFlipped = inner.classList.contains('flipped');
    // Включаем плавную анимацию обратно
    inner.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease';
    // Сбрасываем углы наклона, оставляя только нужную сторону (0 или 180 градусов)
    inner.style.transform = `rotateX(0deg) rotateY(${isFlipped ? 180 : 0}deg)`;
});

// 3. Переворот карточки по клику
inner.onclick = function() {
    this.classList.toggle('flipped');
    const isFlipped = this.classList.contains('flipped');
    
    // В момент клика возвращаем плавность и переворачиваем
    this.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease';
    this.style.transform = `rotateX(0deg) rotateY(${isFlipped ? 180 : 0}deg)`;
};

    document.getElementById('close-3d-btn').onclick = () => {
        document.getElementById('modal-3d').style.display = 'none';
    };

    // Инициализация
    updateDisplay();
    update3DButtonState(); // <--- ПРОВЕРКА ПРИ ЗАГРУЗКЕ
});