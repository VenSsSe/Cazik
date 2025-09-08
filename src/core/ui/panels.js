export function createPanels(context) {
    // Free Spins Display
    context.fsContainer = new PIXI.Container();
    context.fsContainer.visible = false;
    const fsTextStyle = new PIXI.TextStyle({ 
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#FFD700',
        stroke: '#000000',
        strokeThickness: 5
    });
    context.fsText = new PIXI.Text('', fsTextStyle);
    context.fsText.anchor.set(0.5);
    context.fsText.x = context.app.screen.width / 2;
    context.fsText.y = 50;
    context.fsContainer.addChild(context.fsText);
    context.app.stage.addChild(context.fsContainer);

    // Tumble Win Display
    const tumbleWinStyle = new PIXI.TextStyle({
        fontFamily: 'Cyberpunk',
        fontSize: 36,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
    });
    context.tumbleWinText = new PIXI.Text('', tumbleWinStyle);
    context.tumbleWinText.anchor.set(0.5);
    context.tumbleWinText.x = context.app.screen.width / 2;
    context.tumbleWinText.y = 100;
    context.tumbleWinText.visible = false;
    context.container.addChild(context.tumbleWinText);
}