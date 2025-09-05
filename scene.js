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

    // Нижняя панель UI
    const bottomPanel = PIXI.Sprite.from('ui_panel_bottom');
    bottomPanel.anchor.set(0.5, 1);
    bottomPanel.x = app.screen.width / 2;
    bottomPanel.y = app.screen.height;
    app.stage.addChild(bottomPanel);

    // Панель Анте слева
    const antePanel = PIXI.Sprite.from('ui_panel_ante');
    antePanel.anchor.set(0, 0.5);
    antePanel.x = 20;
    antePanel.y = app.screen.height / 2;
    app.stage.addChild(antePanel);

    // Логотип
    const logo = PIXI.Sprite.from('logo');
    logo.anchor.set(0.5, 0);
    logo.x = app.screen.width / 2;
    logo.y = 20;
    app.stage.addChild(logo);

    // Персонаж (пока статичный)
    const character = PIXI.Sprite.from('char_cat_base');
    character.anchor.set(0.5, 0.5);
    character.x = app.screen.width - 250;
    character.y = app.screen.height / 2;
    character.scale.set(0.5);
    app.stage.addChild(character);

     // Кнопка спина (пока без логики)
    const spinButton = PIXI.Sprite.from('ui_button_spin');
    spinButton.anchor.set(0.5);
    spinButton.x = app.screen.width / 2 + 450;
    spinButton.y = app.screen.height - bottomPanel.height / 2;
    spinButton.eventMode = 'static';
    spinButton.cursor = 'pointer';
    // spinButton.on('pointerdown', startSpin); // Логику добавим позже
    app.stage.addChild(spinButton);

    console.log("Сцена успешно создана!");
}
