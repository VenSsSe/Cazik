let activePopup = null;

/**
 * Создает и отображает попап для выбора ставки.
 * @param {PIXI.Application} app - Экземпляр приложения PIXI.
 * @param {PIXI.TextStyle} textStyle - Стиль текста для элементов попапа.
 * @param {function(number): void} setBetCallback - Колбэк для установки новой ставки.
 */
export function showBetPopup(app, textStyle, setBetCallback) {
    // Если попап уже открыт, ничего не делаем (или закрываем старый)
    if (activePopup) {
        activePopup.destroy();
        activePopup = null;
    }

    const popup = new PIXI.Container();
    activePopup = popup;
    popup.x = app.screen.width / 2;
    popup.y = app.screen.height / 2;
    app.stage.addChild(popup);

    const background = PIXI.Sprite.from('bet_popup_background');
    background.anchor.set(0.5);
    popup.addChild(background);

    const title = new PIXI.Text('Select Bet', { ...textStyle, fontSize: 40, fill: '#FFFFFF' });
    title.anchor.set(0.5);
    title.y = -background.height / 2 + 50;
    popup.addChild(title);

    const betValues = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
    const buttonContainer = new PIXI.Container();
    popup.addChild(buttonContainer);

    betValues.forEach((value, index) => {
        const button = new PIXI.Graphics().beginFill(0x333333, 0.7).drawRoundedRect(0, 0, 120, 50, 15).endFill();
        button.eventMode = 'static';
        button.cursor = 'pointer';

        const text = new PIXI.Text(value.toFixed(2), { ...textStyle, fontSize: 28, fill: '#FFFFFF' });
        text.anchor.set(0.5);
        text.x = 60;
        text.y = 25;
        button.addChild(text);

        const col = index % 4;
        const row = Math.floor(index / 4);
        button.x = col * 140;
        button.y = row * 70;

        button.on('pointerdown', () => {
            setBetCallback(value);
            activePopup.destroy();
            activePopup = null;
        });
        
        buttonContainer.addChild(button);
    });

    buttonContainer.x = -buttonContainer.width / 2;
    buttonContainer.y = -buttonContainer.height / 2 + 20;

    const closeButton = new PIXI.Text('X', { ...textStyle, fontSize: 30, fill: '#FF0000' });
    closeButton.anchor.set(0.5);
    closeButton.x = background.width / 2 - 30;
    closeButton.y = -background.height / 2 + 30;
    closeButton.eventMode = 'static';
    closeButton.cursor = 'pointer';
    closeButton.on('pointerdown', () => {
        activePopup.destroy();
        activePopup = null;
    });
    popup.addChild(closeButton);
}