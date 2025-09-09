let activePopup = null;

/**
 * Создает и анимированно отображает детализированный попап для настройки ставки.
 * @param {object} context - Глобальный контекст игры.
 * @param {function(object): void} setBetCallback - Колбэк для сохранения новой конфигурации ставки.
 */
export function showBetConfigurationPopup(context, setBetCallback) {
    if (activePopup) {
        activePopup.destroy();
        activePopup = null;
    }

    // --- Стили текста ---
    const labelStyle = new PIXI.TextStyle({ fontFamily: 'Cyberpunk', fontSize: 22, fill: '#AAAAAA', fontWeight: 'bold' });
    const valueStyle = new PIXI.TextStyle({ fontFamily: 'Cyberpunk', fontSize: 30, fill: '#FFFFFF', fontWeight: 'bold' });
    const buttonTextStyle = new PIXI.TextStyle({ fontFamily: 'Cyberpunk', fontSize: 40, fill: '#FFFFFF', fontWeight: 'bold' });

    // --- Основной контейнер ---
    const popup = new PIXI.Container();
    activePopup = popup;
    
    // Начальная позиция для анимации выезда
    const startY = context.app.screen.height + 500; // Начинаем за пределами экрана
    const targetY = context.app.screen.height / 2;
    popup.x = context.app.screen.width / 2 - 200; // Сдвиг влево
    popup.y = startY;
    context.app.stage.addChild(popup);

    const background = PIXI.Sprite.from('bet_popup_background');
    background.anchor.set(0.5);
    background.scale.set(0.8, 0.75); // Сжатый по вертикали фон
    popup.addChild(background);

    // --- Заголовок ---
    const title = new PIXI.Text('НАСТРОЙКА СТАВКИ', { ...valueStyle, fontSize: 28 });
    title.anchor.set(0.5);
    title.y = -130;
    popup.addChild(title);

    // --- Внутреннее состояние попапа ---
    let tempLevelIndex = context.betSettings.betLevelIndex;
    let tempCoinValueIndex = context.betSettings.coinValueIndex;

    // --- Поля для отображения значений ---
    const betLevelValueText = new PIXI.Text('', valueStyle);
    betLevelValueText.anchor.set(0.5);
    betLevelValueText.y = -65;
    popup.addChild(betLevelValueText);

    const coinValueText = new PIXI.Text('', valueStyle);
    coinValueText.anchor.set(0.5);
    coinValueText.y = 25;
    popup.addChild(coinValueText);

    const totalBetValueText = new PIXI.Text('', { ...valueStyle, fontSize: 26 });
    totalBetValueText.anchor.set(0.5);
    totalBetValueText.y = 95;
    popup.addChild(totalBetValueText);

    // --- Функция обновления текста ---
    function updateValues() {
        const level = context.betSettings.betLevels[tempLevelIndex];
        const value = context.betSettings.coinValues[tempCoinValueIndex];
        const total = context.betSettings.BET_MULTIPLIER * level * value;

        betLevelValueText.text = level;
        coinValueText.text = value.toFixed(2);
        totalBetValueText.text = total.toFixed(2);
    }

    // --- Создание кнопок и лейблов ---
    createBetControl(popup, 'УРОВЕНЬ СТАВКИ', -90, buttonTextStyle, labelStyle, () => {
        if (tempLevelIndex > 0) { tempLevelIndex--; updateValues(); }
    }, () => {
        if (tempLevelIndex < context.betSettings.betLevels.length - 1) { tempLevelIndex++; updateValues(); }
    });

    createBetControl(popup, 'НОМИНАЛ МОНЕТЫ', 0, buttonTextStyle, labelStyle, () => {
        if (tempCoinValueIndex > 0) { tempCoinValueIndex--; updateValues(); }
    }, () => {
        if (tempCoinValueIndex < context.betSettings.coinValues.length - 1) { tempCoinValueIndex++; updateValues(); }
    });

    const totalBetLabel = new PIXI.Text('ИТОГОВАЯ СТАВКА', { ...labelStyle, fontSize: 18 });
    totalBetLabel.anchor.set(0.5);
    totalBetLabel.y = 75;
    popup.addChild(totalBetLabel);

    // --- Кнопка MAX BET ---
    const maxBetButton = createButtonWithBackground('MAX BET', { ...valueStyle, fontSize: 22 }, 180, 45, 0x8B4513, () => {
        tempLevelIndex = context.betSettings.betLevels.length - 1;
        tempCoinValueIndex = context.betSettings.coinValues.length - 1;
        updateValues();
    });
    maxBetButton.y = 135;
    popup.addChild(maxBetButton);

    // --- Кнопка закрытия --- 
    const closeButton = new PIXI.Text('X', { ...valueStyle, fontSize: 60, fill: '#FF6347' });
    closeButton.anchor.set(0.5);
    closeButton.x = 230;
    closeButton.y = -130;
    closeButton.eventMode = 'static';
    closeButton.cursor = 'pointer';
    closeButton.on('pointerdown', () => {
        setBetCallback({ levelIndex: tempLevelIndex, valueIndex: tempCoinValueIndex });
        activePopup.destroy();
        activePopup = null;
    });
    popup.addChild(closeButton);

    updateValues(); // Первоначальное отображение значений

    // --- Анимация появления ---
    const ticker = PIXI.Ticker.shared;
    const animation = (time) => {
        const elapsed = time.elapsedMS;
        const speed = 0.15; // Скорость анимации
        popup.y += (targetY - popup.y) * speed * (elapsed / 16.66);

        if (Math.abs(targetY - popup.y) < 1) {
            popup.y = targetY;
            ticker.remove(animation);
        }
    };
    ticker.add(animation);
}

/**
 * Вспомогательная функция для создания лейбла и кнопок +/- с фоном.
 */
function createBetControl(parent, label, yPos, buttonTextStyle, labelStyle, onMinus, onPlus) {
    const labelText = new PIXI.Text(label, labelStyle);
    labelText.anchor.set(0.5);
    labelText.y = yPos;
    parent.addChild(labelText);

    const plusButton = createButtonWithBackground('+', buttonTextStyle, 50, 50, 0x333333, onPlus);
    plusButton.x = 120;
    plusButton.y = yPos + 40;
    parent.addChild(plusButton);

    const minusButton = createButtonWithBackground('-', buttonTextStyle, 50, 50, 0x333333, onMinus);
    minusButton.x = -120;
    minusButton.y = yPos + 40;
    parent.addChild(minusButton);
}

/**
 * Вспомогательная функция для создания кнопки с текстом и фоном.
 */
function createButtonWithBackground(text, textStyle, width, height, color, callback) {
    const container = new PIXI.Container();
    
    const background = new PIXI.Graphics();
    background.beginFill(color, 0.8);
    background.drawRoundedRect(0, 0, width, height, 10);
    background.endFill();
    container.addChild(background);

    const textElement = new PIXI.Text(text, textStyle);
    textElement.anchor.set(0.5);
    textElement.x = width / 2;
    textElement.y = height / 2;
    container.addChild(textElement);

    container.hitArea = new PIXI.Rectangle(0, 0, width, height);
    container.eventMode = 'static';
    container.cursor = 'pointer';
    container.on('pointerdown', callback);

    container.pivot.set(width / 2, height / 2);

    return container;
}