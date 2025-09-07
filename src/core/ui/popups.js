export function showAutoplayPopup(context, startCallback) {
    if (context.autoplayPopup) {
        context.autoplayPopup.destroy();
    }

    const popup = new PIXI.Container();
    context.autoplayPopup = popup;
    popup.x = context.app.screen.width / 2;
    popup.y = context.app.screen.height / 2;

    const background = new PIXI.Graphics();
    background.beginFill(0x000000, 0.8);
    background.drawRect(-300, -200, 600, 400);
    background.endFill();
    popup.addChild(background);

    const title = new PIXI.Text('Select Autoplay Spins', { ...context.textStyle, fontSize: 30 });
    title.anchor.set(0.5);
    title.y = -160;
    popup.addChild(title);

    const spinCounts = [10, 20, 25, 50, 100, 500, 1000];
    const buttonContainer = new PIXI.Container();
    popup.addChild(buttonContainer);

    const buttonWidth = 120;
    const buttonHeight = 50;
    const gap = 20;
    const columns = 3;

    spinCounts.forEach((count, index) => {
        const button = new PIXI.Graphics();
        button.beginFill(0x333333);
        button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
        button.endFill();
        button.interactive = true;
        button.buttonMode = true;

        const text = new PIXI.Text(count, { ...context.textStyle, fontSize: 24, fill: '#FFFFFF' });
        text.anchor.set(0.5);
        text.x = buttonWidth / 2;
        text.y = buttonHeight / 2;
        button.addChild(text);

        const col = index % columns;
        const row = Math.floor(index / columns);

        button.x = col * (buttonWidth + gap);
        button.y = row * (buttonHeight + gap);

        button.on('pointerdown', () => {
            startCallback(count);
            if (context.autoplayPopup) {
                context.autoplayPopup.destroy();
                context.autoplayPopup = null;
            }
        });
        
        buttonContainer.addChild(button);
    });

    buttonContainer.x = -buttonContainer.width / 2;
    buttonContainer.y = -buttonContainer.height / 2 + 20;

    const closeButton = new PIXI.Text('X', { ...context.textStyle, fontSize: 24, fill: '#FF0000' });
    closeButton.anchor.set(0.5);
    closeButton.x = 280;
    closeButton.y = -180;
    closeButton.interactive = true;
    closeButton.buttonMode = true;
    closeButton.on('pointerdown', () => {
        if (context.autoplayPopup) {
            context.autoplayPopup.destroy();
            context.autoplayPopup = null;
        }
    });
    popup.addChild(closeButton);

    context.container.addChild(popup);
}

export function showCongratsPopup(context, startSpinCallback) {
    const popup = PIXI.Sprite.from('ui_popup_congrats');
    popup.anchor.set(0.5);
    popup.x = context.app.screen.width / 2;
    popup.y = context.app.screen.height / 2;
    popup.scale.set(1.5);
    popup.eventMode = 'static';
    popup.cursor = 'pointer';

    const textStyle = new PIXI.TextStyle({ 
        fontFamily: 'Arial Black', 
        fontSize: 80, 
        fill: '#FFD700', 
        fontWeight: 'bold', 
        stroke: '#4a2500', 
        strokeThickness: 8 
    });
    const spinsText = new PIXI.Text(`${context.freeSpinsManager.spinsLeft} FREE SPINS`, textStyle);
    spinsText.anchor.set(0.5);
    spinsText.y = 50;
    popup.addChild(spinsText);

    popup.on('pointerdown', () => {
        popup.destroy();
        context.ui.showFreeSpins(context.freeSpinsManager.spinsLeft);
        startSpinCallback(true);
    });

    context.app.stage.addChild(popup);
}