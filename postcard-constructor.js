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
        text.innerText = message;
        
        const btn = document.createElement('button');
        btn.className = 'primary-button custom-alert-btn';
        btn.innerText = 'OK';
        btn.onclick = () => overlay.remove();
        
        box.appendChild(text);
        box.appendChild(btn);
        overlay.appendChild(box);
        phoneFrame.appendChild(overlay);
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

    // === ВОССТАНОВЛЕННЫЕ ПЕРЕКЛЮЧАТЕЛИ (FRONT/BACK И AI/UPLOAD) ===

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

    // === ВОССТАНОВЛЕННАЯ ЗАГРУЗКА СВОЕГО ФОТО ===
    if (frontUpload) {
        frontUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                postcardData.frontImage = event.target.result;
                postcardData.imagePosX = 50;
                postcardData.imagePosY = 50;
                updateDisplay();
            };
            reader.readAsDataURL(file);
        });
    }

    // === ОБНОВЛЕННАЯ ФУНКЦИЯ ОТРИСОВКИ ===
    const updateDisplay = (is3DMode = false, botSenderData = null) => { 
        let previewWidth = previewContent.clientWidth;
        if (previewWidth === 0) return; 
        
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
                        <div style="display:flex; flex-direction:column; gap:2px;">
                            <span style="font-size:10px; font-weight:bold; color:var(--text-main);">${name}</span>
                            <span style="font-size:9px; color:var(--text-sub);">${country} ${city}</span>
                        </div>
                    </div>
                    
                    <div class="data-badge-block">
                        <div>📍 FROM: ${country.toUpperCase()}${city ? ', ' + city.toUpperCase() : ''}</div>
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
            
            const response = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "dall-e-3", 
                    prompt: promptText + ", beautiful travel postcard style, high quality",
                    n: 1,
                    size: "1024x1024"
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error?.message || "OpenAI API Error");
            }

            const data = await response.json();
            const imageUrl = data.data[0].url;

            clearInterval(progressInterval);
            progressBar.style.width = '100%';
            progressPercent.innerText = '100%';
            
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
            
            // ИСПРАВЛЕНИЕ: Прямая ссылка на Pollinations с принудительным указанием &model=gptimage
            const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&model=gptimage&seed=${randomSeed}`;

            // Передаем твой ключ в заголовках, чтобы избежать API Error
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            });

            if (!response.ok) throw new Error("Pollinations API Error");

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
            showAppAlert("Generation error: " + e.message);
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
            
            // ИСПРАВЛЕНИЕ: Также используем модель gptimage для марки
            const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPromptForAI)}?width=400&height=500&model=gptimage&seed=${randomSeed}`;
            
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            });
            
            if (!response.ok) throw new Error("Pollinations API Error");

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
            showAppAlert("Generation error: " + e.message);
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

            const originalSide = postcardData.currentSide;

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
            modal.style.display = 'flex';

            setTimeout(() => {
                const rect = wrapper.getBoundingClientRect();
                const w = rect.width > 0 ? rect.width : Math.min(window.innerWidth * 0.9, 500); 
                const scale3D = w / 600;
                if(frontDiv.querySelector('#postcard-canvas')) frontDiv.querySelector('#postcard-canvas').style.transform = `scale(${scale3D})`;
                if(backDiv.querySelector('#postcard-canvas')) backDiv.querySelector('#postcard-canvas').style.transform = `scale(${scale3D})`;
                wrapper.style.height = (w * (400 / 600)) + 'px'; 
            }, 10);
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

    // === ОТПРАВКА ОТКРЫТКИ ===
    const btnSendPostcard = document.getElementById('send-card-btn'); 
    if (btnSendPostcard) {
        btnSendPostcard.addEventListener('click', () => {
            if (!postcardData.frontImage) return showAppAlert("Please generate or upload an image for the Front Side!");
            if (!postcardData.message || postcardData.message.trim().length < 5) return showAppAlert("Please write a message (at least 5 characters) on the Back Side!");
            if (state.postcards <= 0) return showAppAlert("You don't have any blank postcards left!");

            const originalText = btnSendPostcard.textContent;
            btnSendPostcard.disabled = true;
            btnSendPostcard.textContent = "🚀 Sending...";

            const canvasWrapper = previewContent.querySelector('div[style*="position: relative"]');
            if(canvasWrapper) canvasWrapper.classList.add('fly-away-active');

            setTimeout(() => {
                state.postcards -= 1;
                const balanceEl = document.querySelector('.home-assets .asset-card:first-child .asset-value');
                if (balanceEl) balanceEl.textContent = state.postcards;

                const allDestinations = [
                    { flag: "🇦🇫", country: "Afghanistan", city: "Kabul" }, { flag: "🇦🇱", country: "Albania", city: "Tirana" }, { flag: "🇩🇿", country: "Algeria", city: "Algiers" }, { flag: "🇦🇩", country: "Andorra", city: "Andorra la Vella" }, { flag: "🇦🇴", country: "Angola", city: "Luanda" },
                    { flag: "🇦🇬", country: "Antigua and Barbuda", city: "St. John's" }, { flag: "🇦🇷", country: "Argentina", city: "Buenos Aires" }, { flag: "🇦🇲", country: "Armenia", city: "Yerevan" }, { flag: "🇦🇺", country: "Australia", city: "Canberra" }, { flag: "🇦🇹", country: "Austria", city: "Vienna" },
                    { flag: "🇦🇿", country: "Azerbaijan", city: "Baku" }, { flag: "🇧🇸", country: "Bahamas", city: "Nassau" }, { flag: "🇧🇭", country: "Bahrain", city: "Manama" }, { flag: "🇧🇩", country: "Bangladesh", city: "Dhaka" }, { flag: "🇧🇧", country: "Barbados", city: "Bridgetown" },
                    { flag: "🇧🇾", country: "Belarus", city: "Minsk" }, { flag: "🇧🇪", country: "Belgium", city: "Brussels" }, { flag: "🇧🇿", country: "Belize", city: "Belmopan" }, { flag: "🇧🇯", country: "Benin", city: "Porto-Novo" }, { flag: "🇧🇹", country: "Bhutan", city: "Thimphu" },
                    { flag: "🇧🇴", country: "Bolivia", city: "Sucre" }, { flag: "🇧🇦", country: "Bosnia and Herzegovina", city: "Sarajevo" }, { flag: "🇧🇼", country: "Botswana", city: "Gaborone" }, { flag: "🇧🇷", country: "Brazil", city: "Brasilia" }, { flag: "🇧🇳", country: "Brunei", city: "Bandar Seri Begawan" },
                    { flag: "🇧🇬", country: "Bulgaria", city: "Sofia" }, { flag: "🇧🇫", country: "Burkina Faso", city: "Ouagadougou" }, { flag: "🇧🇮", country: "Burundi", city: "Gitega" }, { flag: "🇨🇻", country: "Cabo Verde", city: "Praia" }, { flag: "🇰🇭", country: "Cambodia", city: "Phnom Penh" },
                    { flag: "🇨🇲", country: "Cameroon", city: "Yaounde" }, { flag: "🇨🇦", country: "Canada", city: "Ottawa" }, { flag: "🇨🇫", country: "Central African Republic", city: "Bangui" }, { flag: "🇹🇩", country: "Chad", city: "N'Djamena" }, { flag: "🇨🇱", country: "Chile", city: "Santiago" },
                    { flag: "🇨🇳", country: "China", city: "Beijing" }, { flag: "🇨🇴", country: "Colombia", city: "Bogota" }, { flag: "🇰🇲", country: "Comoros", city: "Moroni" }, { flag: "🇨🇬", country: "Congo", city: "Brazzaville" }, { flag: "🇨🇩", country: "DR Congo", city: "Kinshasa" },
                    { flag: "🇨🇷", country: "Costa Rica", city: "San Jose" }, { flag: "🇭🇷", country: "Croatia", city: "Zagreb" }, { flag: "🇨🇺", country: "Cuba", city: "Havana" }, { flag: "🇨🇾", country: "Cyprus", city: "Nicosia" }, { flag: "🇨🇿", country: "Czechia", city: "Prague" },
                    { flag: "🇩🇰", country: "Denmark", city: "Copenhagen" }, { flag: "🇩🇯", country: "Djibouti", city: "Djibouti" }, { flag: "🇩🇲", country: "Dominica", city: "Roseau" }, { flag: "🇩🇴", country: "Dominican Republic", city: "Santo Domingo" }, { flag: "🇪🇨", country: "Ecuador", city: "Quito" },
                    { flag: "🇪🇬", country: "Egypt", city: "Cairo" }, { flag: "🇸🇻", country: "El Salvador", city: "San Salvador" }, { flag: "🇬🇶", country: "Equatorial Guinea", city: "Malabo" }, { flag: "🇪🇷", country: "Eritrea", city: "Asmara" }, { flag: "🇪🇪", country: "Estonia", city: "Tallinn" },
                    { flag: "🇸🇿", country: "Eswatini", city: "Mbabane" }, { flag: "🇪🇹", country: "Ethiopia", city: "Addis Ababa" }, { flag: "🇫🇯", country: "Fiji", city: "Suva" }, { flag: "🇫🇮", country: "Finland", city: "Helsinki" }, { flag: "🇫🇷", country: "France", city: "Paris" },
                    { flag: "🇬🇦", country: "Gabon", city: "Libreville" }, { flag: "🇬🇲", country: "Gambia", city: "Banjul" }, { flag: "🇬🇪", country: "Georgia", city: "Tbilisi" }, { flag: "🇩🇪", country: "Germany", city: "Berlin" }, { flag: "🇬🇭", country: "Ghana", city: "Accra" },
                    { flag: "🇬🇷", country: "Greece", city: "Athens" }, { flag: "🇬🇩", country: "Grenada", city: "St. George's" }, { flag: "🇬🇹", country: "Guatemala", city: "Guatemala City" }, { flag: "🇬🇳", country: "Guinea", city: "Conakry" }, { flag: "🇬🇼", country: "Guinea-Bissau", city: "Bissau" },
                    { flag: "🇬🇾", country: "Guyana", city: "Georgetown" }, { flag: "🇭🇹", country: "Haiti", city: "Port-au-Prince" }, { flag: "🇭🇳", country: "Honduras", city: "Tegucigalpa" }, { flag: "🇭🇺", country: "Hungary", city: "Budapest" }, { flag: "🇮🇸", country: "Iceland", city: "Reykjavik" },
                    { flag: "🇮🇳", country: "India", city: "New Delhi" }, { flag: "🇮🇩", country: "Indonesia", city: "Jakarta" }, { flag: "🇮🇷", country: "Iran", city: "Tehran" }, { flag: "🇮🇶", country: "Iraq", city: "Baghdad" }, { flag: "🇮🇪", country: "Ireland", city: "Dublin" },
                    { flag: "🇮🇱", country: "Israel", city: "Jerusalem" }, { flag: "🇮🇹", country: "Italy", city: "Rome" }, { flag: "🇯🇲", country: "Jamaica", city: "Kingston" }, { flag: "🇯🇵", country: "Japan", city: "Tokyo" }, { flag: "🇯🇴", country: "Jordan", city: "Amman" },
                    { flag: "🇰🇿", country: "Kazakhstan", city: "Astana" }, { flag: "🇰🇪", country: "Kenya", city: "Nairobi" }, { flag: "🇰🇮", country: "Kiribati", city: "Tarawa" }, { flag: "🇰🇵", country: "North Korea", city: "Pyongyang" }, { flag: "🇰🇷", country: "South Korea", city: "Seoul" },
                    { flag: "🇰🇼", country: "Kuwait", city: "Kuwait City" }, { flag: "🇰🇬", country: "Kyrgyzstan", city: "Bishkek" }, { flag: "🇱🇦", country: "Laos", city: "Vientiane" }, { flag: "🇱🇻", country: "Latvia", city: "Riga" }, { flag: "🇱🇧", country: "Lebanon", city: "Beirut" },
                    { flag: "🇱🇸", country: "Lesotho", city: "Maseru" }, { flag: "🇱🇷", country: "Liberia", city: "Monrovia" }, { flag: "🇱🇾", country: "Libya", city: "Tripoli" }, { flag: "🇱🇮", country: "Liechtenstein", city: "Vaduz" }, { flag: "🇱🇹", country: "Lithuania", city: "Vilnius" },
                    { flag: "🇱🇺", country: "Luxembourg", city: "Luxembourg" }, { flag: "🇲🇬", country: "Madagascar", city: "Antananarivo" }, { flag: "🇲🇼", country: "Malawi", city: "Lilongwe" }, { flag: "🇲🇾", country: "Malaysia", city: "Kuala Lumpur" }, { flag: "🇲🇻", country: "Maldives", city: "Male" },
                    { flag: "🇲🇱", country: "Mali", city: "Bamako" }, { flag: "🇲🇹", country: "Malta", city: "Valletta" }, { flag: "🇲🇭", country: "Marshall Islands", city: "Majuro" }, { flag: "🇲🇷", country: "Mauritania", city: "Nouakchott" }, { flag: "🇲🇺", country: "Mauritius", city: "Port Louis" },
                    { flag: "🇲🇽", country: "Mexico", city: "Mexico City" }, { flag: "🇫🇲", country: "Micronesia", city: "Palikir" }, { flag: "🇲🇩", country: "Moldova", city: "Chisinau" }, { flag: "🇲🇨", country: "Monaco", city: "Monaco" }, { flag: "🇲🇳", country: "Mongolia", city: "Ulaanbaatar" },
                    { flag: "🇲🇪", country: "Montenegro", city: "Podgorica" }, { flag: "🇲🇦", country: "Morocco", city: "Rabat" }, { flag: "🇲🇿", country: "Mozambique", city: "Maputo" }, { flag: "🇲🇲", country: "Myanmar", city: "Naypyidaw" }, { flag: "🇳🇦", country: "Namibia", city: "Windhoek" },
                    { flag: "🇳🇷", country: "Nauru", city: "Yaren" }, { flag: "🇳🇵", country: "Nepal", city: "Kathmandu" }, { flag: "🇳🇱", country: "Netherlands", city: "Amsterdam" }, { flag: "🇳🇿", country: "New Zealand", city: "Wellington" }, { flag: "🇳🇮", country: "Nicaragua", city: "Managua" },
                    { flag: "🇳🇪", country: "Niger", city: "Niamey" }, { flag: "🇳🇬", country: "Nigeria", city: "Abuja" }, { flag: "🇲🇰", country: "North Macedonia", city: "Skopje" }, { flag: "🇳🇴", country: "Norway", city: "Oslo" }, { flag: "🇴🇲", country: "Oman", city: "Muscat" },
                    { flag: "🇵🇰", country: "Pakistan", city: "Islamabad" }, { flag: "🇵🇼", country: "Palau", city: "Ngerulmud" }, { flag: "🇵🇸", country: "Palestine", city: "Ramallah" }, { flag: "🇵🇦", country: "Panama", city: "Panama City" }, { flag: "🇵🇬", country: "Papua New Guinea", city: "Port Moresby" },
                    { flag: "🇵🇾", country: "Paraguay", city: "Asuncion" }, { flag: "🇵🇪", country: "Peru", city: "Lima" }, { flag: "🇵🇭", country: "Philippines", city: "Manila" }, { flag: "🇵🇱", country: "Poland", city: "Warsaw" }, { flag: "🇵🇹", country: "Portugal", city: "Lisbon" },
                    { flag: "🇶🇦", country: "Qatar", city: "Doha" }, { flag: "🇷🇴", country: "Romania", city: "Bucharest" }, { flag: "🇷🇺", country: "Russia", city: "Moscow" }, { flag: "🇷🇼", country: "Rwanda", city: "Kigali" }, { flag: "🇰🇳", country: "St. Kitts & Nevis", city: "Basseterre" },
                    { flag: "🇱🇨", country: "St. Lucia", city: "Castries" }, { flag: "🇻🇨", country: "St. Vincent & Grenadines", city: "Kingstown" }, { flag: "🇼🇸", country: "Samoa", city: "Apia" }, { flag: "🇸🇲", country: "San Marino", city: "San Marino" }, { flag: "🇸🇹", country: "Sao Tome & Principe", city: "Sao Tome" },
                    { flag: "🇸🇦", country: "Saudi Arabia", city: "Riyadh" }, { flag: "🇸🇳", country: "Senegal", city: "Dakar" }, { flag: "🇷🇸", country: "Serbia", city: "Belgrade" }, { flag: "🇸🇨", country: "Seychelles", city: "Victoria" }, { flag: "🇸🇱", country: "Sierra Leone", city: "Freetown" },
                    { flag: "🇸🇬", country: "Singapore", city: "Singapore" }, { flag: "🇸🇰", country: "Slovakia", city: "Bratislava" }, { flag: "🇸🇮", country: "Slovenia", city: "Ljubljana" }, { flag: "🇸🇧", country: "Solomon Islands", city: "Honiara" }, { flag: "🇸🇴", country: "Somalia", city: "Mogadishu" },
                    { flag: "🇿🇦", country: "South Africa", city: "Pretoria" }, { flag: "🇸🇸", country: "South Sudan", city: "Juba" }, { flag: "🇪🇸", country: "Spain", city: "Madrid" }, { flag: "🇱🇰", country: "Sri Lanka", city: "Colombo" }, { flag: "🇸🇩", country: "Sudan", city: "Khartoum" },
                    { flag: "🇸🇷", country: "Suriname", city: "Paramaribo" }, { flag: "🇸🇪", country: "Sweden", city: "Stockholm" }, { flag: "🇨🇭", country: "Switzerland", city: "Bern" }, { flag: "🇸🇾", country: "Syria", city: "Damascus" }, { flag: "🇹🇼", country: "Taiwan", city: "Taipei" },
                    { flag: "🇹🇯", country: "Tajikistan", city: "Dushanbe" }, { flag: "🇹🇿", country: "Tanzania", city: "Dodoma" }, { flag: "🇹🇭", country: "Thailand", city: "Bangkok" }, { flag: "🇹🇱", country: "Timor-Leste", city: "Dili" }, { flag: "🇹🇬", country: "Togo", city: "Lome" },
                    { flag: "🇹🇴", country: "Tonga", city: "Nukuʻalofa" }, { flag: "🇹🇹", country: "Trinidad and Tobago", city: "Port of Spain" }, { flag: "🇹🇳", country: "Tunisia", city: "Tunis" }, { flag: "🇹🇷", country: "Turkey", city: "Ankara" }, { flag: "🇹🇲", country: "Turkmenistan", city: "Ashgabat" },
                    { flag: "🇹🇻", country: "Tuvalu", city: "Funafuti" }, { flag: "🇺🇬", country: "Uganda", city: "Kampala" }, { flag: "🇺🇦", country: "Ukraine", city: "Kyiv" }, { flag: "🇦🇪", country: "UAE", city: "Abu Dhabi" }, { flag: "🇬🇧", country: "UK", city: "London" },
                    { flag: "🇺🇸", country: "USA", city: "Washington, D.C." }, { flag: "🇺🇾", country: "Uruguay", city: "Montevideo" }, { flag: "🇺🇿", country: "Uzbekistan", city: "Tashkent" }, { flag: "🇻🇺", country: "Vanuatu", city: "Port Vila" }, { flag: "🇻🇦", country: "Vatican City", city: "Vatican City" },
                    { flag: "🇻🇪", country: "Venezuela", city: "Caracas" }, { flag: "🇻🇳", country: "Vietnam", city: "Hanoi" }, { flag: "🇾🇪", country: "Yemen", city: "Sanaa" }, { flag: "🇿🇲", country: "Zambia", city: "Lusaka" }, { flag: "🇿🇼", country: "Zimbabwe", city: "Harare" }
                ];

                const dest = allDestinations[Math.floor(Math.random() * allDestinations.length)];
                const distanceKm = Math.floor(Math.random() * (15000 - 500 + 1)) + 500;

                const minHours = 12;
                const maxHours = 72;
                const maxEarthDistance = 20000; 
                
                let baseDeliveryHours = minHours + (distanceKm / maxEarthDistance) * (maxHours - minHours);
                if (baseDeliveryHours > maxHours) baseDeliveryHours = maxHours;
                if (baseDeliveryHours < minHours) baseDeliveryHours = minHours;

                const deliveryHours = Math.floor(baseDeliveryHours);
                const randomMinutes = Math.floor(Math.random() * 60);

                const now = new Date();
                const arrivalTime = now.getTime() + (deliveryHours * 60 * 60 * 1000) + (randomMinutes * 60 * 1000); 

                state.tracking.unshift({
                    type: "outgoing",
                    toCountry: dest.country,
                    toCity: dest.city,
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
                    to: dest.country + ", " + dest.city,
                    status: "In transit",
                    frontImage: postcardData.frontImage, 
                    message: postcardData.message,
                    stampType: postcardData.stampType,
                    stampImage: postcardData.stampImage
                });

                if (typeof refreshAllLists === 'function') refreshAllLists();

                postcardData.frontImage = null;
                postcardData.message = '';
                postcardData.stampImage = null;
                postcardData.stampType = 'emoji';

                if (document.getElementById('card-message')) document.getElementById('card-message').value = '';
                if (document.getElementById('ai-prompt')) document.getElementById('ai-prompt').value = '';
                if (document.getElementById('char-count')) document.getElementById('char-count').innerText = '0 / 150';
                if (document.getElementById('front-upload')) document.getElementById('front-upload').value = '';

                if(canvasWrapper) canvasWrapper.classList.remove('fly-away-active');
                updateDisplay();

                btnSendPostcard.disabled = false;
                btnSendPostcard.textContent = originalText;
                
                const previewContainer = document.getElementById('postcard-preview-container');
                if (previewContainer) {
                    const successOverlay = document.createElement('div');
                    
                    successOverlay.style.position = 'absolute';
                    successOverlay.style.top = '0';
                    successOverlay.style.left = '0';
                    successOverlay.style.width = '100%';
                    successOverlay.style.height = '100%';
                    successOverlay.style.background = 'rgba(255, 255, 255, 0.95)'; 
                    successOverlay.style.zIndex = '200';
                    successOverlay.style.display = 'flex';
                    successOverlay.style.flexDirection = 'column';
                    successOverlay.style.alignItems = 'center';
                    successOverlay.style.justifyContent = 'center';
                    successOverlay.style.textAlign = 'center';
                    successOverlay.style.padding = '20px';
                    successOverlay.style.boxSizing = 'border-box';
                    successOverlay.style.opacity = '0'; 
                    successOverlay.style.transition = 'opacity 0.4s ease'; 

                    successOverlay.innerHTML = `
                        <div style="font-size: 40px; margin-bottom: 8px;">✈️</div>
                        <div style="font-size: 18px; font-weight: bold; color: #d35400; margin-bottom: 6px;">Bon Voyage!</div>
                        <div style="font-size: 13px; color: var(--text-main);">
                            Your postcard is flying to <b>${dest.country}</b>!<br>
                            It will arrive in <b>${deliveryHours} hours</b>.
                        </div>
                    `;

                    previewContainer.appendChild(successOverlay);
                    setTimeout(() => successOverlay.style.opacity = '1', 10);
                    setTimeout(() => {
                        successOverlay.style.opacity = '0';
                        setTimeout(() => successOverlay.remove(), 400); 
                    }, 3500);
                }
            }, 1500);
        });
    }

    // === 5. ЛОГИКА ОТКРЫТИЯ 3D-ПРОСМОТРА ИЗ АРХИВА ===
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

        const senderInfo = isSent ? null : {
            name: cardData.fromBot || cardData.senderName || "@Stranger",
            country: cardData.countryFlag || "🌍",
            city: cardData.senderCity || "Unknown"
        };

        const backupData = JSON.parse(JSON.stringify(postcardData));
        
        postcardData.frontImage = cardData.frontImage;
        postcardData.message = cardData.message;
        postcardData.stampType = cardData.stampType || 'emoji';
        postcardData.stampImage = cardData.stampImage || null;
        postcardData.stamp = cardData.stampData || cardData.stamp || '🌲';

        postcardData.currentSide = 'front';
        updateDisplay(true, senderInfo); 
        frontDiv.innerHTML = '';
        frontDiv.appendChild(document.getElementById('postcard-canvas').cloneNode(true));

        postcardData.currentSide = 'back';
        updateDisplay(true, senderInfo);
        backDiv.innerHTML = '';
        backDiv.appendChild(document.getElementById('postcard-canvas').cloneNode(true));

        Object.assign(postcardData, backupData);
        updateDisplay(false); 

        modal.style.display = 'flex';
        setTimeout(() => {
            const rect = wrapper.getBoundingClientRect();
            const w = rect.width > 0 ? rect.width : Math.min(window.innerWidth * 0.9, 500); 
            const scale3D = w / 600;
            const fCanvas = frontDiv.querySelector('#postcard-canvas');
            const bCanvas = backDiv.querySelector('#postcard-canvas');
            if(fCanvas) fCanvas.style.transform = `scale(${scale3D})`;
            if(bCanvas) bCanvas.style.transform = `scale(${scale3D})`;
            wrapper.style.height = (w * (400 / 600)) + 'px'; 
        }, 10);
    });
});