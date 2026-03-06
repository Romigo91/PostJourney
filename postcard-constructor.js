document.addEventListener('DOMContentLoaded', () => {

    // === КАСТОМНЫЕ ВСПЛЫВАЮЩИЕ ОКНА (АЛЕРТЫ) ===
    function showAppAlert(message) {
        const phoneFrame = document.querySelector('.phone-frame') || document.body;
        
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        
        const box = document.createElement('div');
        box.className = 'custom-alert-box';
        
        const text = document.createElement('div');
        text.className = 'custom-alert-text';
        text.innerHTML = message;
        
        const btn = document.createElement('button');
        btn.className = 'primary-button custom-alert-btn';
        btn.innerText = 'OK';
        btn.onclick = () => overlay.remove();
        
        box.appendChild(text);
        box.appendChild(btn);
        overlay.appendChild(box);
        phoneFrame.appendChild(overlay);
    }

    // ==========================================================================
    // УМНЫЙ КОМПРЕССОР ИЗОБРАЖЕНИЙ (ЧТОБЫ НЕ ЗАБИВАТЬ ПАМЯТЬ)
    // ==========================================================================
    function compressImage(file, maxWidth, callback) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Если картинка больше нужного размера - уменьшаем её пропорционально
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Сжимаем в формат JPEG с качеством 70% (визуально не отличить, а весит в 20 раз меньше!)
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                callback(compressedDataUrl);
            };
        };
    }

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
        imagePosX: 50, 
        imagePosY: 50,
        stamp: '🌲',        
        stampType: 'emoji', 
        stampImage: null,   
    };

    const updateEnergyUI = () => {
        const assetCards = document.querySelectorAll('.home-assets .asset-card');
        if (assetCards && assetCards.length > 1) {
            const energyVal = assetCards[1].querySelector('.asset-value');
            if (energyVal) energyVal.textContent = state.energy;
        }
    };

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

    // === ПЕРЕКЛЮЧАТЕЛИ (FRONT/BACK И AI/UPLOAD) ===

    if (btnFront && btnBack) {
        btnFront.addEventListener('click', () => {
            postcardData.currentSide = 'front';
            btnFront.classList.add('constructor-mode-active');
            btnBack.classList.remove('constructor-mode-active');
            panelFront.style.display = 'block';
            panelBack.style.display = 'none';
            updateDisplay();
        });

        btnBack.addEventListener('click', () => {
            postcardData.currentSide = 'back';
            btnBack.classList.add('constructor-mode-active');
            btnFront.classList.remove('constructor-mode-active');
            panelFront.style.display = 'none';
            panelBack.style.display = 'block';
            updateDisplay();
        });
    }

    if (modeButtons.length > 0) {
        modeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                modeButtons.forEach(b => b.classList.remove('constructor-mode-active'));
                e.target.classList.add('constructor-mode-active');
                const mode = e.target.getAttribute('data-mode');
                panels.forEach(p => {
                    p.style.display = p.getAttribute('data-panel') === mode ? 'block' : 'none';
                });
            });
        });
    }

    // === ЗАГРУЗКА СВОЕГО ФОТО (С КОМПРЕССИЕЙ!) ===
    if (frontUpload) {
        frontUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Прогоняем загруженное фото через компрессор (макс ширина 800px)
            compressImage(file, 800, (compressedBase64) => {
                postcardData.frontImage = compressedBase64;
                postcardData.imagePosX = 50;
                postcardData.imagePosY = 50;
                updateDisplay();
            });
        });
    }

    // === ФУНКЦИЯ ОТРИСОВКИ ===
    const updateDisplay = (is3DMode = false, botSenderData = null) => { 
        let previewWidth = previewContent.clientWidth;
        
        // ИСПРАВЛЕНИЕ ГЛАВНОГО БАГА:
        // Если вкладка Create скрыта (ширина 0), используем стандартные 600px для генерации 3D!
        if (previewWidth === 0) {
            previewWidth = 600; 
        }
        
        const scale = previewWidth / 600;
        previewContent.style.height = (400 * scale) + 'px';
        previewContent.style.padding = '0';
        previewContent.style.display = 'block'; 

        let innerHTML = '';

        if (postcardData.currentSide === 'front') {
            stampArea.style.display = 'none';
            previewContent.style.cursor = postcardData.frontImage ? 'grab' : 'default';

            if (postcardData.frontImage) {
                const hintHTML = is3DMode ? '' : `<div id="drag-hint" style="position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); color: white; padding: 6px 14px; border-radius: 20px; font-size: 11px; pointer-events: none; backdrop-filter: blur(4px); box-shadow: 0 2px 8px rgba(0,0,0,0.2);">👆 Drag to reposition</div>`;
                innerHTML = `
                    <img src="${postcardData.frontImage}" style="width: 100%; height: 100%; object-fit: cover; display: block; margin: 0; padding: 0; border: none; object-position: ${postcardData.imagePosX}% ${postcardData.imagePosY}%; pointer-events: none;">
                    ${hintHTML}
                `;
            } else {
                innerHTML = `<div style="color: #ccc; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 20px;">Front Side Preview</div>`;
            }
        } else {
            const sender = botSenderData || state.profile;
            
            const name = sender.name;
            const country = sender.country || sender.countryFlag || '🌍';
            const city = sender.city || '';
            const avatar = sender.avatar || null;
            const posX = sender.avatarPosX ?? 50;
            const posY = sender.avatarPosY ?? 50;
            const initial = (name.replace('@', '')[0] || 'A').toUpperCase();

            const avatarStyle = avatar ? `background-image: url(${avatar}); background-size: cover; background-position: ${posX}% ${posY}%;` : '';
            const avatarContent = avatar ? '' : initial;

            const date = new Date().toLocaleDateString('en-GB');
            const cardID = sender.userId || 'PJ-' + Math.floor(1000 + Math.random() * 9000);

            innerHTML = `
            <div class="postcard-back-layout" style="width: 100%; height: 100%;">
                <div class="postcard-left-side">
                    <div class="lines-container">
                        <div id="postcard-text-area" style="font-family: ${postcardData.font}; color: ${postcardData.color};">${postcardData.message || "Write your message here..."}</div>
                    </div>
                </div>
                
                <div class="postcard-divider"></div>
                
                <div class="postcard-right-side">
                    <div class="stamp-place">
                        ${postcardData.stampType === 'ai' && postcardData.stampImage 
                            ? `<img src="${postcardData.stampImage}" class="ai-stamp-image" alt="AI Stamp">`
                            : `<span>${postcardData.stamp}</span>`
                        }
                    </div>
                    
                <div class="sender-profile-block">
                    <div class="sender-mini-avatar" style="${avatarStyle}">${avatarContent}</div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span style="font-size:10px; font-weight:bold; color:var(--text-main);">${name}</span>
                        <span style="font-size:10px; color:var(--text-main);">${country}</span>
                    </div>
                </div>
                    
                    <div class="data-badge-block">
                        <div>📅 DATE: ${date}</div>
                        <div>🔢 ID: ${cardID}</div>
                        <div style="margin-top:4px; font-size:12px; opacity:0.6;">✈️ 🚢 🚂</div>
                    </div>
                    
                    <div class="postmark-circle">POSTJOURNEY<br>${new Date().getFullYear()}<br>OFFICIAL</div>
                </div>
            </div>`;
        }

        previewContent.innerHTML = `
            <div style="width: ${previewWidth}px; height: ${400 * scale}px; position: relative; border-radius: 12px; overflow: hidden;">
                <div id="postcard-canvas" style="width: 600px; height: 400px; position: absolute; top: 0; left: 0; transform: scale(${scale}); transform-origin: top left; background: #fff;">
                    ${innerHTML}
                </div>
            </div>`;

        if (postcardData.currentSide === 'back') {
            const textArea = document.getElementById('postcard-text-area');
            let fontSize = 22;
            textArea.style.fontSize = fontSize + 'px';
            if(textArea.scrollHeight > 170) {
                 while (textArea.scrollHeight > 170 && fontSize > 10) {
                    fontSize -= 0.5;
                    textArea.style.fontSize = fontSize + 'px';
                }
            }
        }
        update3DButtonState();
    };

    const resizeObserver = new ResizeObserver(() => updateDisplay());
    resizeObserver.observe(previewContent);

// === ГЕНЕРАЦИЯ ЛИЦЕВОЙ ЧАСТИ (FRONT SIDE) ===
if (btnGenerateAI) {
    btnGenerateAI.onclick = async () => {
        const promptText = aiPrompt.value.trim();
        if (!promptText) return showAppAlert("Please enter a description!");

        if (state.energy < 100) {
            return showAppAlert("Not enough energy! You need 100 energy to generate an AI image.");
        }

        btnGenerateAI.disabled = true;
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressPercent.innerText = "0%";

        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 3; 
                progressBar.style.width = Math.floor(progress) + '%';
                progressPercent.innerText = Math.floor(progress) + '%';
            }
        }, 400);

        try {
            const apiKey = "sk_aeA3gBEtOyjU1DgAQIZgrzfvXyqvk6cN";
            const randomSeed = Math.floor(Math.random() * 100000000);
            
            const uniquePrompt = `${promptText} (variation: ${randomSeed})`;
            const encodedPrompt = encodeURIComponent(uniquePrompt);
            
            const url = `https://gen.pollinations.ai/image/${encodedPrompt}?width=1200&height=800&model=klein&nologo=true&seed=${randomSeed}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error("API Error " + response.status + ": " + errText);
            }

            const imageBlob = await response.blob();
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressPercent.innerText = '100%';

            const imageUrl = URL.createObjectURL(imageBlob);
            
            state.energy -= 100;
            updateEnergyUI();

            postcardData.frontImage = imageUrl;
            postcardData.imagePosX = 50;
            postcardData.imagePosY = 50;
            updateDisplay();

        } catch (e) {
            clearInterval(progressInterval);
            showAppAlert("Generation failed: " + e.message);
        } finally {
            btnGenerateAI.disabled = false;
            setTimeout(() => { progressContainer.style.display = 'none'; }, 1000);
        }
    };
}

// === ЛОГИКА ГЕНЕРАЦИИ ПРЕМИУМ-МАРКИ ===
const stampGrid = document.getElementById('stamp-select-grid');
const aiStampConstructor = document.getElementById('ai-stamp-constructor');
const btnGenerateStamp = document.getElementById('btn-generate-stamp');

if (stampGrid && aiStampConstructor && btnGenerateStamp) {
    stampGrid.querySelectorAll('.stamp-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isPremium = btn.classList.contains('premium');
            aiStampConstructor.style.display = isPremium ? 'block' : 'none';
        });
    });

    btnGenerateStamp.addEventListener('click', async () => {
        const promptInput = document.getElementById('ai-stamp-prompt');
        const userPrompt = promptInput.value.trim();
        
        if (!userPrompt) return showAppAlert("Please describe what you want on your stamp.");
        if (state.energy < 50) return showAppAlert("Not enough energy (need 50)!");

        const progressContainer = document.getElementById('stamp-progress-container');
        const progressBar = document.getElementById('stamp-progress-bar');
        const progressPercent = document.getElementById('stamp-progress-percent');

        btnGenerateStamp.disabled = true;
        btnGenerateStamp.querySelector('span').textContent = "⌛ Painting...";
        progressContainer.style.display = 'block';
        progressBar.style.width = '0%';
        progressPercent.innerText = "0%";

        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 3; 
                progressBar.style.width = Math.floor(progress) + '%';
                progressPercent.innerText = Math.floor(progress) + '%';
            }
        }, 400);

        try {
            const apiKey = "sk_aeA3gBEtOyjU1DgAQIZgrzfvXyqvk6cN";
            const randomSeed = Math.floor(Math.random() * 100000000);
            
            const finalPromptForAI = `${userPrompt}, highly detailed vintage postage stamp style, intricate engraving, muted philatelic colors, official postal look (variation: ${randomSeed})`;
            
            const url = `https://gen.pollinations.ai/image/${encodeURIComponent(finalPromptForAI)}?width=400&height=500&model=klein&nologo=true&seed=${randomSeed}`;
            
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            });
            
            if (!response.ok) {
                const errText = await response.text();
                throw new Error("API Error " + response.status + ": " + errText);
            }

            const imageBlob = await response.blob();
            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressPercent.innerText = '100%';

            const imageUrl = URL.createObjectURL(imageBlob);
            
            state.energy -= 50;
            updateEnergyUI();

            postcardData.stampImage = imageUrl;
            postcardData.stampType = 'ai';
            updateDisplay();
            promptInput.value = ""; 
        } catch (e) {
            clearInterval(progressInterval);
            showAppAlert("Generation failed: " + e.message);
        } finally {
            btnGenerateStamp.disabled = false;
            btnGenerateStamp.querySelector('span').textContent = "🎨 Generate Stamp (50 Energy)";
            setTimeout(() => progressContainer.style.display = 'none', 1000);
        }
    });
}

    // === ОБРАБОТКА ИНТЕРФЕЙСА (ТЕКСТ, ЦВЕТ, МАРКИ, КНОПКИ) ===
    if (cardMessage) {
        cardMessage.addEventListener('input', (e) => {
            postcardData.message = e.target.value;
            const currentLen = e.target.value.length;
            charCount.innerText = `${currentLen} / 150`;
            charCount.style.color = currentLen >= 130 ? '#ff4d4d' : 'var(--text-sub)';
            updateDisplay();
        });
    }

    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            postcardData.font = e.target.value;
            updateDisplay();
        });
    }

    const inkButtons = document.querySelectorAll('.ink-btn');
    inkButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            inkButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            postcardData.color = e.target.getAttribute('data-color');
            updateDisplay();
        });
    });

    const stampButtons = document.querySelectorAll('.stamp-btn');
    stampButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.target.closest('.stamp-btn'); 
            if (!targetBtn) return;
            stampButtons.forEach(b => b.classList.remove('active'));
            targetBtn.classList.add('active');
            postcardData.stamp = targetBtn.getAttribute('data-stamp');
            
            if (targetBtn.classList.contains('premium') && postcardData.stampImage) {
                postcardData.stampType = 'ai';
            } else {
                postcardData.stampType = 'emoji';
            }
            updateDisplay();
        });
    });

// === ЛОГИКА 3D ===
const btnView3D = document.getElementById('btn-view-3d');
if (btnView3D) {
    btnView3D.onclick = function() {
        if (this.classList.contains('disabled')) return;
        const modal = document.getElementById('modal-3d');
        const frontDiv = document.getElementById('3d-front');
        const backDiv = document.getElementById('3d-back');
        const wrapper = document.querySelector('.card-3d-wrapper');
        const inner = document.getElementById('card-3d-inner');

        // 1. Сразу прячем контент, чтобы избежать скачка
        wrapper.style.opacity = '0';
        wrapper.style.transition = 'none'; 

        const phoneFrame = document.querySelector('.phone-frame') || document.body;
        if (modal.parentElement !== phoneFrame) phoneFrame.appendChild(modal);
        modal.style.zIndex = '999999';

        const originalSide = postcardData.currentSide;

        // Рендерим стороны во временный буфер
        postcardData.currentSide = 'front';
        updateDisplay(true); 
        frontDiv.innerHTML = '';
        frontDiv.appendChild(previewContent.querySelector('#postcard-canvas').cloneNode(true));

        postcardData.currentSide = 'back';
        updateDisplay(true);
        backDiv.innerHTML = '';
        backDiv.appendChild(previewContent.querySelector('#postcard-canvas').cloneNode(true));

        postcardData.currentSide = originalSide;
        updateDisplay(false);
        
        if (typeof currentRotateX !== 'undefined') currentRotateX = 0;
        if (typeof currentRotateY !== 'undefined') currentRotateY = 0;
        if(inner) inner.style.transform = `rotateX(0deg) rotateY(0deg)`;

        modal.style.display = 'flex';

        // 2. Выполняем расчеты ДО того, как показать карту
        const rect = wrapper.getBoundingClientRect();
        const w = rect.width > 0 ? rect.width : Math.min(window.innerWidth * 0.9, 500); 
        const scale3D = w / 600;
        
        const fCanvas = frontDiv.querySelector('#postcard-canvas');
        const bCanvas = backDiv.querySelector('#postcard-canvas');
        if(fCanvas) fCanvas.style.transform = `scale(${scale3D})`;
        if(bCanvas) bCanvas.style.transform = `scale(${scale3D})`;
        wrapper.style.height = (w * (400 / 600)) + 'px'; 

        // 3. Плавно проявляем уже подогнанную по размеру карту
        requestAnimationFrame(() => {
            wrapper.style.transition = 'opacity 0.3s ease';
            wrapper.style.opacity = '1';
        });
    };
}

const close3dBtn = document.getElementById('close-3d-btn');
if (close3dBtn) {
    close3dBtn.onclick = () => {
        document.getElementById('modal-3d').style.display = 'none';
    };
}

    // === DRAG TO REPOSITION ===
    let isDraggingImg = false;
    let imgStartX = 0, imgStartY = 0;
    let imgStartPosX = 50, imgStartPosY = 50;

    function getImgCoords(e) {
        if (e.touches && e.touches.length > 0) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        return { x: e.clientX, y: e.clientY };
    }

    function imgDragStart(e) {
        if (postcardData.currentSide !== 'front' || !postcardData.frontImage) return;
        isDraggingImg = true;
        const coords = getImgCoords(e);
        imgStartX = coords.x; imgStartY = coords.y;
        imgStartPosX = postcardData.imagePosX; imgStartPosY = postcardData.imagePosY;
        previewContent.style.cursor = 'grabbing';
    }

    function imgDragMove(e) {
        if (!isDraggingImg) return;
        e.preventDefault(); 
        const coords = getImgCoords(e);
        const deltaX = coords.x - imgStartX;
        const deltaY = coords.y - imgStartY;
        let newPosX = imgStartPosX - (deltaX * 0.2);
        let newPosY = imgStartPosY - (deltaY * 0.2);
        newPosX = Math.max(0, Math.min(100, newPosX));
        newPosY = Math.max(0, Math.min(100, newPosY));
        postcardData.imagePosX = newPosX;
        postcardData.imagePosY = newPosY;
        const canvas = previewContent.querySelector('#postcard-canvas');
        if (canvas) {
            const img = canvas.querySelector('img');
            if(img) img.style.objectPosition = `${newPosX}% ${newPosY}%`;
        }
    }

    function imgDragEnd() {
        if (!isDraggingImg) return;
        isDraggingImg = false;
        previewContent.style.cursor = 'grab';
    }

    if (previewContent) {
        previewContent.addEventListener('mousedown', imgDragStart);
        window.addEventListener('mousemove', imgDragMove);
        window.addEventListener('mouseup', imgDragEnd);
        previewContent.addEventListener('touchstart', imgDragStart, { passive: false });
        window.addEventListener('touchmove', imgDragMove, { passive: false });
        window.addEventListener('touchmove', imgDragMove, { passive: false });
        window.addEventListener('touchend', imgDragEnd);
    }

    // === ИНТЕРАКТИВНОЕ ВРАЩЕНИЕ В 3D ===
    const wrapper = document.querySelector('.card-3d-wrapper');
    const inner = document.getElementById('card-3d-inner');
    let isDragging = false;
    let startX = 0, startY = 0, currentRotateX = 0, currentRotateY = 0;

    function dragStart(e) {
        isDragging = true;
        const coords = getImgCoords(e);
        startX = coords.x; startY = coords.y;
        if(inner) inner.style.transition = 'none';
    }

    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const coords = getImgCoords(e);
        currentRotateY += (coords.x - startX) * 0.5; 
        currentRotateX -= (coords.y - startY) * 0.5;
        if (currentRotateX > 20) currentRotateX = 20;
        if (currentRotateX < -20) currentRotateX = -20;
        if(inner) inner.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        startX = coords.x; startY = coords.y;
    }

    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        if(inner) {
            inner.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease';
            currentRotateY = Math.round(currentRotateY / 180) * 180;
            currentRotateX = 0; 
            inner.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
        }
    }

    if (wrapper) {
        wrapper.addEventListener('mousedown', dragStart);
        window.addEventListener('mousemove', dragMove); 
        window.addEventListener('mouseup', dragEnd);
        wrapper.addEventListener('touchstart', dragStart, { passive: false });
        window.addEventListener('touchmove', dragMove, { passive: false });
        window.addEventListener('touchend', dragEnd);
    }

    setTimeout(() => { updateDisplay(); update3DButtonState(); }, 50);

// === ОТПРАВКА ОТКРЫТКИ (ИСПРАВЛЕННАЯ АНИМАЦИЯ И ПЕРЕХОД) ===
const btnSendPostcard = document.getElementById('send-card-btn'); 
if (btnSendPostcard) {
    btnSendPostcard.addEventListener('click', () => {
        if (!postcardData.frontImage) return showAppAlert("Please generate or upload an image for the Front Side!");
        if (!postcardData.message || postcardData.message.trim().length < 5) return showAppAlert("Please write a message (at least 5 characters) on the Back Side!");
        if (state.postcards <= 0) return showAppAlert("You don't have any blank postcards left!");
        
        if (!state.currentTarget) {
            return showAppAlert("Oops! You haven't pulled an address yet.");
        }

        const originalText = btnSendPostcard.textContent;
        btnSendPostcard.disabled = true;
        btnSendPostcard.textContent = "🚀 Sending...";

        // 1. МГНОВЕННО СПИСЫВАЕМ ОТКРЫТКУ
        state.postcards -= 1;
        const balanceEl = document.querySelector('.home-assets .asset-card:first-child .asset-value');
        if (balanceEl) balanceEl.textContent = state.postcards;

        const now = new Date();
        let overlayIcon = "✈️";
        let overlayTitle = "Bon Voyage!";
        let overlayText = "";

        // ЛОГИКА ОФФЛАЙН/ОНЛАЙН
        if (state.currentTarget === "offline") {
            state.sentPostcards.unshift({
                sentAt: now.getTime(),
                status: "Saved",
                countryFlag: state.profile.country || "🌍",
                to: "Personal Archive",
                isOffline: true,
                frontImage: postcardData.frontImage,
                message: postcardData.message,
                stampType: postcardData.stampType,
                stampImage: postcardData.stampImage
            });
            
            overlayIcon = "🗂️";
            overlayTitle = "Saved!";
            overlayText = `Your postcard has been saved to your<br><b>Personal Collection</b>.`;
        } else {
            const dest = {
                targetId: state.currentTarget.targetId, // <-- ДОСТАЕМ УНИВЕРСАЛЬНЫЙ ID
                country: state.currentTarget.country,
                flag: state.currentTarget.flag,
                name: state.currentTarget.name
            };
            
            // === ЗАПОМИНАЕМ ID ПОЛЬЗОВАТЕЛЯ (БОТА ИЛИ ЖИВОГО) ===
            if (!state.contactedUsers) state.contactedUsers = [];
            state.contactedUsers.push(dest.targetId);
            
            const arrivalTime = typeof calculateDeliveryTime === 'function' 
            ? calculateDeliveryTime(MY_HOME_FLAG, dest.flag) 
            : now.getTime() + (24 * 60 * 60 * 1000);

            const deliveryHours = Math.round((arrivalTime - now.getTime()) / (1000 * 60 * 60));

            state.tracking.unshift({
                type: "outgoing",
                toCountry: dest.country,
                flag: dest.flag,
                frontImage: postcardData.frontImage,
                message: postcardData.message,
                stampType: postcardData.stampType,
                stampData: postcardData.stampType === 'ai' ? postcardData.stampImage : postcardData.stamp,
                sentAt: now.getTime(),
                arrivalAt: arrivalTime,
                status: "In transit"
            });

            state.sentPostcards.unshift({
                countryFlag: dest.flag,
                to: dest.country,
                status: "In transit",
                frontImage: postcardData.frontImage, 
                message: postcardData.message,
                stampType: postcardData.stampType,
                stampImage: postcardData.stampImage
            });

            overlayText = `Your postcard is flying to <b>${dest.country}</b>!<br>It will arrive in <b>~${deliveryHours} hours</b>.`;
        }

        if (typeof refreshAllLists === 'function') refreshAllLists();

        // === 2. СОЗДАЕМ ТЕКСТ ПОД ОТКРЫТКОЙ ===
        const canvasWrapper = previewContent.querySelector('div[style*="position: relative"]');
        
        const successOverlay = document.createElement('div');
        successOverlay.style.position = 'absolute';
        successOverlay.style.top = '0';
        successOverlay.style.left = '0';
        successOverlay.style.width = '100%';
        successOverlay.style.height = '100%';
        successOverlay.style.background = 'var(--bg-flag-circle)'; 
        successOverlay.style.zIndex = '1'; // НИЗКИЙ СЛОЙ
        successOverlay.style.display = 'flex';
        successOverlay.style.flexDirection = 'column';
        successOverlay.style.alignItems = 'center';
        successOverlay.style.justifyContent = 'center';
        successOverlay.style.textAlign = 'center';
        successOverlay.style.padding = '20px';
        successOverlay.style.boxSizing = 'border-box';
        successOverlay.style.borderRadius = '12px';
        
        successOverlay.innerHTML = `
            <div style="font-size: 40px; margin-bottom: 8px;">${overlayIcon}</div>
            <div style="font-size: 18px; font-weight: bold; color: #d35400; margin-bottom: 6px;">${overlayTitle}</div>
            <div style="font-size: 13px; color: var(--text-main);">
                ${overlayText}
            </div>
        `;

        if (canvasWrapper) {
            canvasWrapper.style.zIndex = '10'; // Открытка ВЫШЕ текста
            previewContent.insertBefore(successOverlay, canvasWrapper);
            // Запускаем полет!
            canvasWrapper.classList.add('fly-away-active');
        } else {
            previewContent.appendChild(successOverlay);
        }

        // === 3. ПЕРЕХОД НА HOME И ТИХИЙ СБРОС КОНСТРУКТОРА ===
        // Таймер: 1.5 сек на полет + 1 сек на чтение текста = 2500 мс
        setTimeout(() => {
            
            // 1. Мгновенно переключаем пользователя на экран Home (имитируем клик по меню)
            const homeTab = document.querySelector('.nav-item[data-target="home"]');
            if (homeTab) {
                homeTab.click();
            }

            // 2. Сбрасываем Cloud Screen (убираем профиль получателя)
            if (typeof window.resetCloudScreen === 'function') {
                window.resetCloudScreen();
            }

           // 3. ТИХО обнуляем конструктор, пока пользователь УЖЕ на вкладке Home
           postcardData.frontImage = null;
           postcardData.message = '';
           postcardData.stampImage = null;
           postcardData.stampType = 'emoji';
           postcardData.currentSide = 'front';

           // --- СБРОС ОСНОВНЫХ ВКЛАДОК (Front / Back) ---
           const bFront = document.getElementById('btn-front-side') || document.getElementById('btn-front');
           const bBack = document.getElementById('btn-back-side') || document.getElementById('btn-back');
           const pFront = document.getElementById('panel-front');
           const pBack = document.getElementById('panel-back');

           if (bFront && bBack && pFront && pBack) {
               bFront.classList.add('constructor-mode-active');
               bBack.classList.remove('constructor-mode-active');
               pFront.style.display = 'block';
               pBack.style.display = 'none';
           }

           // --- СБРОС ПОДМЕНЮ (AI / Upload) ---
           const modeButtons = document.querySelectorAll('.constructor-toggle .constructor-mode');
           const modePanels = document.querySelectorAll('.constructor-panel');
           if (modeButtons.length > 0 && modePanels.length > 0) {
               // Снимаем активность со всех кнопок и прячем все панели
               modeButtons.forEach(btn => btn.classList.remove('constructor-mode-active'));
               modePanels.forEach(p => p.style.display = 'none');
               
               // Принудительно включаем первую кнопку (Generate with AI) и первую панель
               modeButtons[0].classList.add('constructor-mode-active');
               modePanels[0].style.display = 'block';
           }

           // --- СБРОС ЦВЕТА ТЕКСТА (на первый по умолчанию) ---
           const inkButtons = document.querySelectorAll('.ink-btn');
           if(inkButtons.length > 0) {
               inkButtons.forEach(b => b.classList.remove('active'));
               inkButtons[0].classList.add('active');
               postcardData.color = inkButtons[0].getAttribute('data-color') || '#1e3799';
           }

           // Очистка полей ввода
           if (document.getElementById('card-message')) document.getElementById('card-message').value = '';
           if (document.getElementById('ai-prompt')) document.getElementById('ai-prompt').value = '';
           if (document.getElementById('char-count')) document.getElementById('char-count').innerText = '0 / 150';
           if (document.getElementById('front-upload')) document.getElementById('front-upload').value = '';

           // Убираем анимацию и текст доставки из DOM
           if (successOverlay) successOverlay.remove();
           if (canvasWrapper) {
               canvasWrapper.classList.remove('fly-away-active');
               canvasWrapper.style.zIndex = '';
           }

           // Перерисовываем пустую открытку
           updateDisplay();

            btnSendPostcard.disabled = false;
            btnSendPostcard.textContent = originalText;
            
        }, 2500);
    });
}

 // === УНИВЕРСАЛЬНАЯ ЛОГИКА ОТКРЫТИЯ 3D (БЕЗ СКАЧКОВ) ===
document.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.archive-card');
    if (!cardEl) return;

    const isSent = cardEl.closest('#sent-postcards-grid') !== null;
    const index = parseInt(cardEl.getAttribute('data-index'));
    const cardData = isSent ? state.sentPostcards[index] : state.receivedPostcards[index];
    if (!cardData) return;

    const modal = document.getElementById('modal-3d');
    const frontDiv = document.getElementById('3d-front');
    const backDiv = document.getElementById('3d-back');
    const wrapper = document.querySelector('.card-3d-wrapper');
    const inner = document.getElementById('card-3d-inner');

    // 1. Прячем обертку перед наполнением
    wrapper.style.opacity = '0';
    wrapper.style.transition = 'none';

    const phoneFrame = document.querySelector('.phone-frame') || document.body;
    if (modal.parentElement !== phoneFrame) phoneFrame.appendChild(modal);
    modal.style.zIndex = '999999';

    const senderInfo = isSent ? null : {
        name: cardData.senderName || cardData.fromBot || "Stranger",
        country: cardData.countryFlag || "🌍"
    };

    const backupData = JSON.parse(JSON.stringify(postcardData));
    
    // Наполняем данными
    postcardData.frontImage = cardData.frontImage;
    postcardData.message = cardData.message;
    postcardData.stampType = cardData.stampType || (cardData.stampImage ? 'ai' : 'emoji');
    postcardData.stampImage = cardData.stampImage || null;
    postcardData.stamp = cardData.stampData || cardData.stamp || '🌲';
    postcardData.font = cardData.font || "'Caveat', cursive";
    postcardData.color = cardData.color || '#1e3799';

    postcardData.currentSide = 'front';
    updateDisplay(true, senderInfo); 
    frontDiv.innerHTML = '';
    let fCanvasClone = document.getElementById('postcard-canvas').cloneNode(true);
    frontDiv.appendChild(fCanvasClone);

    postcardData.currentSide = 'back';
    updateDisplay(true, senderInfo);
    backDiv.innerHTML = '';
    let bCanvasClone = document.getElementById('postcard-canvas').cloneNode(true);
    backDiv.appendChild(bCanvasClone);

    Object.assign(postcardData, backupData);
    updateDisplay(false); 

    if (inner) {
        inner.style.transform = `rotateX(0deg) rotateY(0deg)`;
        if (typeof currentRotateX !== 'undefined') { currentRotateX = 0; currentRotateY = 0; }
    }

    modal.style.display = 'flex';
    
    // 2. Сразу применяем масштаб (используем бОльшую задержку для надежности рендера)
    setTimeout(() => {
        const rect = wrapper.getBoundingClientRect();
        const w = rect.width > 0 ? rect.width : Math.min(window.innerWidth * 0.9, 500); 
        const scale3D = w / 600;
        
        const finalF = frontDiv.querySelector('#postcard-canvas');
        const finalB = backDiv.querySelector('#postcard-canvas');
        if(finalF) finalF.style.transform = `scale(${scale3D})`;
        if(finalB) finalB.style.transform = `scale(${scale3D})`;
        wrapper.style.height = (w * (400 / 600)) + 'px'; 

        // 3. Плавное появление
        wrapper.style.transition = 'opacity 0.3s ease';
        wrapper.style.opacity = '1';
    }, 60); // 60мс достаточно, чтобы браузер «проглотил» новые элементы
});
});