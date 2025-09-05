// --- scene.js ---
// Этот файл отвечает за создание и отображение всех статичных элементов сцены

export function createScene(app) {
    // Основной фон
    const background = PIXI.Sprite.from('background_olympus');
    background.anchor.set(0.5);
    background.x = app.screen.width / 2;
    background.y = app.screen.height / 2;
    const bgScale = Math.max(app.screen.width / background.texture.width, app.screen.height / background.texture.height);
    background.scale.set(bgScale);
    app.stage.addChild(background);

    // Фон для барабанов
    const reelsBackground = PIXI.Sprite.from('reels_background');
    reelsBackground.anchor.set(0.5);
    reelsBackground.x = app.screen.width / 2;
    reelsBackground.y = app.screen.height / 2;
    app.stage.addChild(reelsBackground);

     // Рамка игрового поля
    const gameFrame = PIXI.Sprite.from('game_board_frame');
    gameFrame.anchor.set(0.5);
    gameFrame.x = app.screen.width / 2;
    gameFrame.y = app.screen.height / 2;
    //gameFrame.scale.set(1.05); // Небольшое увеличение для лучшего вида
    app.stage.addChild(gameFrame);

    // Нижняя панель UI и кнопка спина теперь создаются в ui.js

    console.log("Сцена успешно создана!");
}
