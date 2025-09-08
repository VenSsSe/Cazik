// --- scene.js (Исправленная и улучшенная версия) ---

export function createScene(app) {
    // --- 1. Фон ---
    // Основной фон, который растягивается на весь экран
    const background = PIXI.Sprite.from('background_olympus');
    background.anchor.set(0.5);
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;
    const bgScale = Math.max(app.screen.width / background.width, app.screen.height / background.height);
    background.scale.set(bgScale);
    app.stage.addChild(background);

    // --- 2. Центральная игровая зона ---
    // Фон для самих барабанов (темный узор)
    // Мы будем позиционировать все остальные элементы относительно него
    const reelsBackground = PIXI.Sprite.from('reels_background');
    reelsBackground.anchor.set(0.5);
    reelsBackground.x = app.screen.width / 2;
    reelsBackground.y = app.screen.height / 2 - 50; // Немного сдвигаем вверх
    reelsBackground.scale.set(0.85); // Делаем игровое поле чуть меньше
    app.stage.addChild(reelsBackground);

    // Рамка, которая будет НАД барабанами
    // Используем 'game_board_frame.png' вместо 'symbol_frame'
    const symbolGridFrame = PIXI.Sprite.from('game_board_frame.png');
    symbolGridFrame.anchor.set(0.5);
    symbolGridFrame.x = reelsBackground.x;
    symbolGridFrame.y = reelsBackground.y;
    // Масштабируем рамку, чтобы она была чуть больше фона барабанов
    const framePadding = 40; // Отступ рамки от фона
    symbolGridFrame.width = reelsBackground.width + framePadding;
    symbolGridFrame.height = reelsBackground.height + framePadding;
    app.stage.addChild(symbolGridFrame);


    // --- 3. Панели интерфейса ---
    // Нижняя панель
    const bottomPanel = PIXI.Sprite.from('ui_panel_bottom_main');
    bottomPanel.anchor.set(0.5, 1);
    bottomPanel.x = app.screen.width / 2;
    bottomPanel.y = app.screen.height;
    bottomPanel.width = app.screen.width;
    bottomPanel.height = 180; // Высота панели
    app.stage.addChild(bottomPanel);

    // Левая боковая панель
    const leftPanel = PIXI.Sprite.from('ui_panel_top_win');
    leftPanel.anchor.set(0.5);
    leftPanel.x = 120;
    leftPanel.y = app.screen.height / 2;
    leftPanel.rotation = Math.PI / 2; // Поворот на 90 градусов
    leftPanel.scale.set(1.2, 1.0); // Растягиваем по новой "высоте"
    app.stage.addChild(leftPanel);

    // Верхняя панель
    const topWinPanel = PIXI.Sprite.from('ui_panel_top_win');
    topWinPanel.anchor.set(0.5);
    // Позиция над рамкой барабанов с небольшим отступом
    topWinPanel.x = app.screen.width / 2;
    topWinPanel.y = symbolGridFrame.y - symbolGridFrame.height / 2 - 50;
    topWinPanel.scale.set(0.9);
    app.stage.addChild(topWinPanel);


    // --- 4. Логотип ---
    const logo = PIXI.Sprite.from('logo_main');
    logo.anchor.set(0.5);
    // Позиционируем справа от рамки с отступом в 80px
    logo.x = symbolGridFrame.x + (symbolGridFrame.width / 2) + 80 + (logo.width * 0.7 / 2);
    logo.y = app.screen.height / 2 - 50;
    logo.scale.set(0.7);
    app.stage.addChild(logo);
}
