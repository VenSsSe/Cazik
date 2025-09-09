/**
 * Создает и настраивает все видимые элементы основной игровой сцены.
 * @param {PIXI.Application} app - Экземпляр приложения PIXI.
 */
export function createScene(app) {

    // =========================================================================
    // --- 1. НАСТРОЙКИ СЦЕНЫ И КОНСТАНТЫ ---
    // =========================================================================
    // Здесь собраны все основные "магические числа" для удобной настройки.

    // Настройки для главной рамки, в которой находятся барабаны
    const FRAME_CONFIG = {
        offsetX: 0,     // Смещение по X (вправо > 0, влево < 0)
        offsetY: 0,     // Смещение по Y (вниз > 0, вверх < 0)
        scaleX: 1.05,   // Растягивание по ширине
        scaleY: 1.1,    // Растягивание по высоте
        baseYOffset: -30 // Базовое смещение рамки вверх для баланса
    };

    // Настройки сетки барабанов (должны совпадать с grid.js)
    const GRID_CONFIG = {
        reels: 6, // Количество колонок
        rows: 5,  // Количество рядов
        symbolSize: 150 // Размер одной ячейки с символом
    };


    // =========================================================================
    // --- 2. ЗАДНИЙ ПЛАН (BACKGROUND) ---
    // =========================================================================
    // Создаем и масштабируем фоновое изображение, чтобы оно заполняло весь экран.

    const background = PIXI.Sprite.from('background_olympus');
    background.anchor.set(0.5);
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;
    
    // Масштабируем фон, сохраняя пропорции, чтобы покрыть всю область
    const bgScale = Math.max(app.screen.width / background.width, app.screen.height / background.height);
    background.scale.set(bgScale);
    
    app.stage.addChild(background);


    // =========================================================================
    // --- 3. СРЕДНИЙ ПЛАН (MIDGROUND) - ИГРОВАЯ ЗОНА ---
    // =========================================================================
    // Сюда входят фоны для барабанов и сама рамка, которая будет НАД ними.

    // --- 3.1. Фоны для колонок барабанов ---
    // Создаем 6 отдельных фонов, по одному на каждую колонку.
    // Их размеры и положение точно рассчитываются на основе конфига сетки.

    const totalGridWidth = GRID_CONFIG.reels * GRID_CONFIG.symbolSize;
    const gridHeight = GRID_CONFIG.rows * GRID_CONFIG.symbolSize;
    const reelColumnWidth = GRID_CONFIG.symbolSize;

    const targetCenterX = app.screen.width / 2;
    const targetCenterY = app.screen.height / 2 + FRAME_CONFIG.baseYOffset;
    const gridStartX = targetCenterX - totalGridWidth / 2;

    for (let i = 0; i < GRID_CONFIG.reels; i++) {
        const reelBackground = PIXI.Sprite.from('reels_background');
        reelBackground.anchor.set(0.5);
        reelBackground.width = reelColumnWidth;
        reelBackground.height = gridHeight;
        reelBackground.x = gridStartX + reelColumnWidth / 2 + i * reelColumnWidth;
        reelBackground.y = targetCenterY;
        app.stage.addChild(reelBackground);
    }

    // --- 3.2. Главная игровая рамка ---
    // Рамка добавляется на сцену ПОСЛЕ фонов барабанов, чтобы быть выше в z-порядке.
    
    const mainGameFrame = PIXI.Sprite.from('symbol_frame');
    mainGameFrame.anchor.set(0.5);
    mainGameFrame.x = app.screen.width / 2 + FRAME_CONFIG.offsetX;
    mainGameFrame.y = app.screen.height / 2 + FRAME_CONFIG.baseYOffset + FRAME_CONFIG.offsetY;
    mainGameFrame.scale.set(FRAME_CONFIG.scaleX, FRAME_CONFIG.scaleY);
    
    app.stage.addChild(mainGameFrame);


    // =========================================================================
    // --- 4. ПЕРЕДНИЙ ПЛАН (FOREGROUND) - ИНТЕРФЕЙС И ЛОГО ---
    // =========================================================================
    // Все элементы, которые должны быть гарантированно поверх игровой зоны.

    // --- 4.1. Панели интерфейса ---

    // Нижняя панель
    const bottomPanel = PIXI.Sprite.from('ui_panel_bottom_main');
    bottomPanel.anchor.set(0.5, 1);
    bottomPanel.x = app.screen.width / 2;
    bottomPanel.y = app.screen.height;
    bottomPanel.width = app.screen.width;
    bottomPanel.height = 180;
    app.stage.addChild(bottomPanel);

    // Левая боковая панель (повернутая)
    const leftPanel = PIXI.Sprite.from('ui_panel_left');
    leftPanel.anchor.set(0.5);
    leftPanel.x = 180;
    leftPanel.y = app.screen.height / 2;
    leftPanel.rotation = Math.PI / 2;

    // Настройки масштабирования для левой панели.
    // Так как панель повернута, scaleX влияет на ВЫСОТУ, а scaleY на ШИРИНУ.
    const leftPanelScaleX = 1.2; // Управляет высотой
    const leftPanelScaleY = 0.4; // Управляет шириной ("сжатие")
    leftPanel.scale.set(leftPanelScaleX, leftPanelScaleY);
    
    app.stage.addChild(leftPanel);

    // Верхняя панель для информации о выигрыше
    const topWinPanel = PIXI.Sprite.from('ui_panel_top_win');
    topWinPanel.anchor.set(0.5);
    topWinPanel.x = mainGameFrame.x;
    topWinPanel.y = mainGameFrame.y - mainGameFrame.height / 2 - 50;
    topWinPanel.scale.set(0.7);
    app.stage.addChild(topWinPanel);

    // --- 4.2. Логотип ---
    const logo = PIXI.Sprite.from('logo_main');
    logo.anchor.set(0.5);
    logo.x = mainGameFrame.x + mainGameFrame.width / 2 + 220;
    logo.y = mainGameFrame.y + mainGameFrame.height / 2 - 700;
    logo.scale.set(0.4);
    app.stage.addChild(logo);


    // =========================================================================
    // --- 5. ФИНАЛЬНЫЙ СЛОЙ (TOP LAYER) ---
    // =========================================================================
    // Элементы здесь будут отображаться поверх всего остального.

    // Сначала добавляем рамку, чтобы она была над символами.
    app.stage.addChild(mainGameFrame);

    // Затем, по требованию, добавляем нижнюю панель, чтобы она была выше рамки.
    app.stage.addChild(bottomPanel);
}