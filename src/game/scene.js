// --- scene.js (Новая версия с правильной композицией) ---

export function createScene(app) {
    // --- 1. Фон ---
    // Растягиваем основной фон на весь экран
    const background = PIXI.Sprite.from('background_olympus');
    background.anchor.set(0.5);
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;
    const bgScale = Math.max(app.screen.width / background.width, app.screen.height / background.height);
    background.scale.set(bgScale);
    app.stage.addChild(background);

    // --- 2. Центральная игровая зона ---
    // Теперь это главный элемент, от которого все будет строиться.
    // Используем красивую декоративную рамку!
    const mainGameFrame = PIXI.Sprite.from('symbol_frame');
    mainGameFrame.anchor.set(0.5);
    mainGameFrame.x = app.screen.width / 2;
    mainGameFrame.y = app.screen.height / 2 - 30; // Немного сдвигаем вверх для баланса
    mainGameFrame.scale.set(1.1); // Масштабируем до нужного размера
    app.stage.addChild(mainGameFrame);

    // Фон для самих символов кладем ПОД рамку, но НАД основным фоном.
    // Он должен быть чуть меньше рамки.
    const reelsBackground = PIXI.Sprite.from('reels_background');
    reelsBackground.anchor.set(0.5);
    reelsBackground.x = mainGameFrame.x;
    reelsBackground.y = mainGameFrame.y;
    // Подгоняем размер под внутреннюю часть рамки
    reelsBackground.width = mainGameFrame.width - 40;
    reelsBackground.height = mainGameFrame.height - 40;
    app.stage.addChild(reelsBackground);
    
    // Важно: добавляем рамку еще раз в конце, чтобы она была поверх символов.
    // Но сначала создадим другие элементы.

    // --- 3. Панели интерфейса ---
    // Нижняя панель
    const bottomPanel = PIXI.Sprite.from('ui_panel_bottom_main');
    bottomPanel.anchor.set(0.5, 1);
    bottomPanel.x = app.screen.width / 2;
    bottomPanel.y = app.screen.height;
    bottomPanel.width = app.screen.width;
    bottomPanel.height = 180;
    app.stage.addChild(bottomPanel);

    // Левая боковая панель
    const leftPanel = PIXI.Sprite.from('ui_panel_top_win');
    leftPanel.anchor.set(0.5);
    leftPanel.x = 180; // Сдвигаем левее
    leftPanel.y = app.screen.height / 2;
    leftPanel.rotation = Math.PI / 2;
    leftPanel.scale.set(1.2, 1.1); // Немного подгоняем пропорции
    app.stage.addChild(leftPanel);

    // Верхняя панель для информации о выигрыше
    const topWinPanel = PIXI.Sprite.from('ui_panel_top_win');
    topWinPanel.anchor.set(0.5);
    topWinPanel.x = mainGameFrame.x;
    // Ставим ее четко над основной рамкой с небольшим отступом
    topWinPanel.y = mainGameFrame.y - mainGameFrame.height / 2 - 50;
    topWinPanel.scale.set(0.7);
    app.stage.addChild(topWinPanel);

    // --- 4. Логотип ---
    const logo = PIXI.Sprite.from('logo_main');
    logo.anchor.set(0.5);
    // Ставим справа от основной рамки
    logo.x = mainGameFrame.x + mainGameFrame.width / 2 + 180;
    logo.y = mainGameFrame.y;
    logo.scale.set(0.8);
    app.stage.addChild(logo);

    // --- 5. Возвращаем рамку на передний план ---
    // Это нужно, чтобы барабаны с символами (которые будут созданы позже)
    // оказались под рамкой, но над фоном барабанов.
    app.stage.addChild(mainGameFrame);
}

