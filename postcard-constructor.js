document.addEventListener('DOMContentLoaded', () => {
    // 1. Элементы переключения Лицо/Оборот
    const btnFront = document.getElementById('btn-front-side');
    const btnBack = document.getElementById('btn-back-side');
    const panelFront = document.getElementById('panel-front');
    const panelBack = document.getElementById('panel-back');

    // 2. Элементы режима (AI vs Upload)
    const modeButtons = document.querySelectorAll('.constructor-toggle .constructor-mode');
    const panels = document.querySelectorAll('.constructor-panel');

    // 3. Загрузка, Превью, Марка и Ввод данных
    const frontUpload = document.getElementById('front-upload');
    const previewContent = document.getElementById('preview-content');
    const stampArea = document.getElementById('stamp-area');
    const cardMessage = document.getElementById('card-message'); // Поле ввода текста
    const fontSelect = document.getElementById('font-select');   // Выбор шрифта

    // Хранилище данных (чтобы ничего не пропадало при переключении)
    let postcardData = {
        frontImage: null,
        message: '',
        font: "'Brush Script MT', cursive",
        currentSide: 'front'
    };

    // --- ФУНКЦИЯ ОБНОВЛЕНИЯ ПРЕДПРОСМОТРА ---
    const updateDisplay = () => {
        previewContent.innerHTML = ''; // Очищаем превью перед отрисовкой

        if (postcardData.currentSide === 'front') {
            // ЛИЦО
            stampArea.style.display = 'none'; // Скрываем марку
            if (postcardData.frontImage) {
                previewContent.innerHTML = `<img src="${postcardData.frontImage}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                previewContent.innerHTML = `<span style="color: #ccc;">Front Side Preview</span>`;
            }
        } else {
            // ОБОРОТ
            stampArea.style.display = 'flex'; // Показываем марку
            stampArea.innerHTML = '📬';

            // Создаем блок для текста
            const textDiv = document.createElement('div');
            textDiv.style.width = '100%';
            textDiv.style.height = '100%';
            textDiv.style.padding = '20px';
            textDiv.style.boxSizing = 'border-box';
            textDiv.style.color = '#333';
            textDiv.style.fontSize = '18px';
            textDiv.style.lineHeight = '1.4';
            textDiv.style.wordBreak = 'break-word';
            textDiv.style.textAlign = 'left';
            
            // ПРИМЕНЯЕМ ЖИВЫЕ ДАННЫЕ (текст и шрифт)
            textDiv.style.fontFamily = postcardData.font;
            textDiv.innerText = postcardData.message || "Write your message here...";
            
            previewContent.appendChild(textDiv);
        }
    };

    // --- ОБРАБОТКА ВВОДА (РЕАЛЬНОЕ ВРЕМЯ) ---
    
    // Следим за текстом
    cardMessage.addEventListener('input', (e) => {
        postcardData.message = e.target.value;
        if (postcardData.currentSide === 'back') updateDisplay();
    });

    // Следим за шрифтом
    fontSelect.addEventListener('change', (e) => {
        postcardData.font = e.target.value;
        if (postcardData.currentSide === 'back') updateDisplay();
    });

    // --- ЛОГИКА ПЕРЕКЛЮЧЕНИЯ СТОРОН ---
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

    // --- ЛОГИКА ВЫБОРА: AI ИЛИ ФОТО ---
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
                postcardData.currentSide = 'front'; // При загрузке переключаем на лицо
                updateDisplay();
            };
            reader.readAsDataURL(file);
        }
    };

    // Старт
    updateDisplay();
});