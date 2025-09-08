// --- scene.js ---

export function createScene(app) {
    // Основной фон
    const background = PIXI.Sprite.from('background_olympus');
    background.anchor.set(0.5);
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;
    // Масштабируем фон так, чтобы он покрывал весь экран
    const bgScale = Math.max(app.screen.width / background.width, app.screen.height / background.height);
    background.scale.set(bgScale);
    app.stage.addChild(background);

    // Фон для барабанов (сетки символов)
    const reelsBackground = PIXI.Sprite.from('reels_background');
    reelsBackground.anchor.set(0.5);
    reelsBackground.x = app.screen.width / 2;
    reelsBackground.y = app.screen.height / 2 - 50; // Немного смещаем вверх
    // Задаем точный размер, соответствующий сетке 6x5
    reelsBackground.width = 900; // 6 колонок * 150px
    reelsBackground.height = 750; // 5 рядов * 150px
    app.stage.addChild(reelsBackground);

    // Левая боковая панель
    const leftPanel = PIXI.Sprite.from('ui_panel_top_win');
    leftPanel.anchor.set(0.5);
    leftPanel.x = 100; // Примерное положение слева
    leftPanel.y = app.screen.height / 2;
    leftPanel.rotation = Math.PI / 2; // Поворот на 90 градусов (PI/2 радианов)
    leftPanel.scale.set(1.2); // Возможно, потребуется настроить масштаб
    app.stage.addChild(leftPanel);

    // Новая нижняя панель UI
    const bottomPanel = PIXI.Sprite.from('ui_panel_bottom_main');
    bottomPanel.anchor.set(0.5, 1);
    bottomPanel.x = app.screen.width / 2;
    bottomPanel.y = app.screen.height;
    bottomPanel.width = app.screen.width;
    app.stage.addChild(bottomPanel);

    // Верхняя панель для выигрыша
    const topWinPanel = PIXI.Sprite.from('ui_panel_top_win');
    topWinPanel.anchor.set(0.5);
    topWinPanel.x = app.screen.width / 2;
    topWinPanel.y = 100; // Примерное положение над сеткой
    app.stage.addChild(topWinPanel);

    // Логотип
    const logo = PIXI.Sprite.from('logo_main');
    logo.anchor.set(0.5);
    logo.x = app.screen.width / 2 + reelsBackground.width / 2 + 150; // Справа от сетки
    logo.y = app.screen.height / 2;
    logo.scale.set(0.8); // Примерный масштаб
    app.stage.addChild(logo);
}