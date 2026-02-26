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
        font: "'Caveat', cursive", 
        color: '#1e3799', 
        currentSide: 'front',
        imagePosX: 50, // НОВОЕ: Позиция картинки по X (50% = центр)
        imagePosY: 50  // НОВОЕ: Позиция картинки по Y (50% = центр)
    };

    // Функция обновления состояния иконки 3D
    function update3DButtonState() {
        const btn3D = document.getElementById('btn-view-3d');
        if (!btn3D) return; 

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
            previewContent.style.cursor = postcardData.frontImage ? 'grab' : 'default';

            if (postcardData.frontImage) {
                // НОВОЕ: Добавлен object-position и подсказка "Drag to reposition"
                previewContent.innerHTML = `
                    <img src="${postcardData.frontImage}" style="width: 100%; height: 100%; object-fit: cover; display: block; margin: 0; padding: 0; border: none; object-position: ${postcardData.imagePosX}% ${postcardData.imagePosY}%; pointer-events: none;">
                    <div id="drag-hint" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; pointer-events: none; backdrop-filter: blur(4px); box-shadow: 0 2px 8px rgba(0,0,0,0.2);">👆 Drag to reposition</div>
                `;
            } else {
                previewContent.innerHTML = `<span style="color: #ccc;">Front Side Preview</span>`;
            }
        } else {
            stampArea.style.display = 'none'; 
            previewContent.style.cursor = 'default';
    
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
        update3DButtonState(); 
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
            
            // НОВОЕ: Сбрасываем позицию в центр при новой генерации
            postcardData.imagePosX = 50;
            postcardData.imagePosY = 50;
            
            updateDisplay();
            update3DButtonState(); 

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
        update3DButtonState(); 
    });

    fontSelect.addEventListener('change', (e) => {
        postcardData.font = e.target.value;
        updateDisplay();
    });

    // Обработка клика по кружочкам цвета
    const inkButtons = document.querySelectorAll('.ink-btn');
    inkButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            inkButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
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
                // НОВОЕ: Сбрасываем позицию в центр при загрузке нового фото
                postcardData.imagePosX = 50;
                postcardData.imagePosY = 50;
                updateDisplay();
                update3DButtonState(); 
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

        // НОВОЕ: Передаем смещение картинки в 3D сцену
        frontDiv.innerHTML = `<img src="${postcardData.frontImage}" style="width:100%; height:100%; object-fit:cover; object-position: ${postcardData.imagePosX}% ${postcardData.imagePosY}%;">`;
        
        postcardData.currentSide = 'back'; 
        updateDisplay(); 
        const previewClone = previewContent.cloneNode(true);
        backDiv.innerHTML = '';
        backDiv.appendChild(previewClone);
        
        postcardData.currentSide = 'front'; 
        updateDisplay();

        modal.style.display = 'flex';
    };

    // Закрытие 3D вида
    document.getElementById('close-3d-btn').onclick = () => {
        document.getElementById('modal-3d').style.display = 'none';
    };

    // ====================================================================
    // НОВОЕ: ЛОГИКА КАДРИРОВАНИЯ (DRAG TO REPOSITION)
    // ====================================================================
    let isDraggingImg = false;
    let imgStartX = 0, imgStartY = 0;
    let imgStartPosX = 50, imgStartPosY = 50;

    function getImgCoords(e) {
        if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }

    function imgDragStart(e) {
        // Запускаем перетаскивание только если открыта лицевая сторона с загруженным фото
        if (postcardData.currentSide !== 'front' || !postcardData.frontImage) return;
        
        isDraggingImg = true;
        const coords = getImgCoords(e);
        imgStartX = coords.x;
        imgStartY = coords.y;
        imgStartPosX = postcardData.imagePosX;
        imgStartPosY = postcardData.imagePosY;
        
        previewContent.style.cursor = 'grabbing';
        
        // Скрываем подсказку "Drag to reposition" при первом клике
        const hint = document.getElementById('drag-hint');
        if (hint) hint.style.opacity = '0';
    }

    function imgDragMove(e) {
        if (!isDraggingImg) return;
        e.preventDefault(); // Запрещаем скролл страницы на телефоне во время кадрирования

        const coords = getImgCoords(e);
        const deltaX = coords.x - imgStartX;
        const deltaY = coords.y - imgStartY;

        // Чувствительность движения. Меняет позицию в %
        let newPosX = imgStartPosX - (deltaX * 0.2);
        let newPosY = imgStartPosY - (deltaY * 0.2);

        // Ограничиваем от 0% (левый/верхний край) до 100% (правый/нижний край)
        newPosX = Math.max(0, Math.min(100, newPosX));
        newPosY = Math.max(0, Math.min(100, newPosY));

        postcardData.imagePosX = newPosX;
        postcardData.imagePosY = newPosY;

        // Плавно обновляем стиль без перерисовки всего блока
        const img = previewContent.querySelector('img');
        if (img) {
            img.style.objectPosition = `${newPosX}% ${newPosY}%`;
        }
    }

    function imgDragEnd() {
        if (!isDraggingImg) return;
        isDraggingImg = false;
        previewContent.style.cursor = 'grab';
    }

    // Слушатели для превью-окошка
    previewContent.addEventListener('mousedown', imgDragStart);
    window.addEventListener('mousemove', imgDragMove);
    window.addEventListener('mouseup', imgDragEnd);

    previewContent.addEventListener('touchstart', imgDragStart, { passive: false });
    window.addEventListener('touchmove', imgDragMove, { passive: false });
    window.addEventListener('touchend', imgDragEnd);


    // ====================================================================
    // ЛОГИКА ИНТЕРАКТИВНОГО ВРАЩЕНИЯ (МЫШЬ + ПАЛЕЦ ДЛЯ 3D СЦЕНЫ)
    // ====================================================================
    const wrapper = document.querySelector('.card-3d-wrapper');
    const inner = document.getElementById('card-3d-inner');

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentRotateX = 0;
    let currentRotateY = 0;

    function dragStart(e) {
        isDragging = true;
        const coords = getImgCoords(e);
        startX = coords.x;
        startY = coords.y;
        inner.style.transition = 'none';
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const coords = getImgCoords(e);
        const deltaX = coords.x - startX;
        const deltaY = coords.y - startY;

        currentRotateY += deltaX * 0.5; 
        currentRotateX -= deltaY * 0.5;
        
        if (currentRotateX > 20) currentRotateX = 20;
        if (currentRotateX < -20) currentRotateX = -20;

        inner.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

        startX = coords.x;
        startY = coords.y;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;

        inner.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease';
        currentRotateY = Math.round(currentRotateY / 180) * 180;
        currentRotateX = 0; 

        inner.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
    }

    wrapper.addEventListener('mousedown', dragStart);
    window.addEventListener('mousemove', dragMove); 
    window.addEventListener('mouseup', dragEnd);

    wrapper.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('touchmove', dragMove, { passive: false });
    window.addEventListener('touchend', dragEnd);

    // Инициализация при старте
    updateDisplay();
    update3DButtonState();
});