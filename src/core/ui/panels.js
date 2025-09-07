export function createPanels(context) {
    context.balanceText = new PIXI.Text('', context.textStyle);
    context.balanceText.anchor.set(0, 0.5);
    context.balanceText.x = 50;
    context.balanceText.y = context.app.screen.height - 100;
    context.container.addChild(context.balanceText);
    
    context.winText = new PIXI.Text('', context.textStyle);
    context.winText.anchor.set(1, 0.5);
    context.winText.x = context.app.screen.width - 50;
    context.winText.y = context.app.screen.height - 100;
    context.container.addChild(context.winText);

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

    const tumbleWinStyle = new PIXI.TextStyle({
        fontFamily: 'Arial Black',
        fontSize: 36,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6
    });
    context.tumbleWinText = new PIXI.Text('', tumbleWinStyle);
    context.tumbleWinText.anchor.set(0.5);
    context.tumbleWinText.x = context.app.screen.width / 2;
    context.tumbleWinText.y = 120;
    context.tumbleWinText.visible = false;
    context.container.addChild(context.tumbleWinText);
}