/**
 * Вспомогательная функция для создания кнопок с общими настройками.
 */
function createButton(context, texture, x, y, callback, scale = 0.8) {
    const button = PIXI.Sprite.from(texture);
    button.anchor.set(0.5);
    button.scale.set(scale);
    button.x = x;
    button.y = y;
    button.eventMode = 'static';
    button.cursor = 'pointer';

    // Эффекты при наведении
    button
        .on('pointerdown', callback)
        .on('pointerover', () => button.scale.set(scale * 1.1))
        .on('pointerout', () => button.scale.set(scale));

    context.container.addChild(button);
    return button;
}

/**
 * Создает и размещает все кнопки интерфейса.
 */
export function createButtons(context) {
    // --- 1. Кнопки на левой боковой панели ---
    // Координаты X и Y теперь привязаны к панели из scene.js
    const leftPanelX = 180; // Та же позиция, что и у leftPanel в scene.js
    const leftPanelCenterY = context.app.screen.height / 2;
    const buttonSpacing = 150; // Расстояние между кнопками

    // Кнопка Информация/Настройки (раньше была infoButton)
    context.settingsButton = createButton(context, 'ui_button_settings', leftPanelX, leftPanelCenterY - buttonSpacing, context.settingsCallback, 0.1);
    
    // Кнопка Покупки бонуса
    context.buyButton = createButton(context, 'ui_button_buyfeature', leftPanelX, leftPanelCenterY, context.buyCallback, 0.5);
    
    // Кнопка Ставки Анте
    context.anteButton = createButton(context, 'ui_button_ante', leftPanelX, leftPanelCenterY + buttonSpacing, context.anteCallback, 0.5);


    // --- 2. Кнопки на нижней панели управления ---
    // Y позиция для всех кнопок на нижней панели
    const bottomPanelY = context.app.screen.height - 90;

    // Главная кнопка СПИН
    context.spinButton = createButton(context, 'ui_button_spin', context.app.screen.width / 2, bottomPanelY, context.spinCallback, 0.1);
    
    // Кнопка Автоигры (справа от спина)
    context.autoplayButton = createButton(context, 'ui_button_autoplay', context.app.screen.width / 2 + 200, bottomPanelY, context.autoplayCallback, 0.55);
}
