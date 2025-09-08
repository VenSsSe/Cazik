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

    // Рамка игрового поля (внешняя)
    const gameFrame = PIXI.Sprite.from('game_board_frame');
    gameFrame.anchor.set(0.5);
    gameFrame.x = app.screen.width / 2;
    gameFrame.y = app.screen.height / 2 - 50; // Смещаем туда же, куда и фон барабанов
        gameFrame.width = reelsBackground.width;
    gameFrame.height = reelsBackground.height;
        app.stage.addChild(gameFrame);

    // Bottom Panel
    const bottomPanel = PIXI.Sprite.from('ui_panel_bottom');
    bottomPanel.anchor.set(0.5, 1);
    bottomPanel.x = app.screen.width / 2;
    bottomPanel.y = app.screen.height;
    bottomPanel.width = app.screen.width;
    app.stage.addChild(bottomPanel);
}