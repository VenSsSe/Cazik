/**
 * Вспомогательная функция для создания кнопок с общими настройками.
 */
function createButton(context, texture, x, y, callback, scaleX = 0.8, scaleY = 0.8, parentContainer = context.container) {
    const button = PIXI.Sprite.from(texture);
    button.anchor.set(0.5);
    button.scale.set(scaleX, scaleY);
    button.x = x;
    button.y = y;
    button.eventMode = 'static';
    button.cursor = 'pointer';

    // Эффекты при наведении
    button
        .on('pointerdown', callback)
        .on('pointerover', () => button.scale.set(scaleX * 1.1, scaleY * 1.1))
        .on('pointerout', () => button.scale.set(scaleX, scaleY));

    parentContainer.addChild(button); // Add to specified parent or default
    return button;
}

/**
 * Создает и размещает все кнопки интерфейса.
 */
export function createButtons(context) {
    // --- 1. Кнопки на левой боковой панели ---
    const padding = 20; // Желаемый отступ между кнопками

    // Создаем кнопки временно с y=0, чтобы получить их размеры
    context.settingsButton = createButton(context, 'ui_button_settings', 0, 0, context.context.callbacks.handleSettingsClick, 0.2, 0.2, context.leftPanel);
    context.buyButton = createButton(context, 'ui_button_buyfeature', 0, 0, context.context.callbacks.handleBuyBonus, 1, 1, context.leftPanel);
    context.anteButton = createButton(context, 'ui_button_ante', 0, 0, context.context.callbacks.handleAnteToggle, 1, 1, context.leftPanel);

    // Теперь, когда кнопки созданы, их размеры доступны
    const settingsHeight = context.settingsButton.height;
    const buyHeight = context.buyButton.height;
    const anteHeight = context.anteButton.height;

    // Рассчитываем новые Y-позиции
    // Средняя кнопка (buyButton) остается в центре (y=0)
    // Верхняя кнопка (settingsButton)
    const settingsY = -(buyHeight / 2 + padding + settingsHeight / 2);
    // Нижняя кнопка (anteButton)
    const anteY = (buyHeight / 2 + padding + anteHeight / 2);

    // Применяем новые Y-позиции
    context.settingsButton.y = settingsY;
    context.buyButton.y = 0; // Убедимся, что она в центре
    context.anteButton.y = anteY;


    // --- 2. Кнопки на нижней панели управления ---
    // Главная кнопка СПИН
    context.spinButton = createButton(context, 'ui_button_spin', 0, -40, context.context.callbacks.startSpin, 0.1, 0.1, context.bottomPanel);
    
    // Кнопка Автоигры (справа от спина)
    context.autoplayButton = createButton(context, 'ui_button_autoplay', 200, -40, context.context.callbacks.handleAutoplay, 0.55, 0.55, context.bottomPanel);
}