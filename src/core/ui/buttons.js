function createButton(context, texture, x, y, callback, scale = 0.8) {
    const button = PIXI.Sprite.from(texture);
    button.anchor.set(0.5);
    button.scale.set(scale);
    button.x = x;
    button.y = y;
    button.eventMode = 'static';
    button.cursor = 'pointer';

    button
        .on('pointerdown', callback)
        .on('pointerover', () => button.scale.set(scale * 1.1))
        .on('pointerout', () => button.scale.set(scale));

    context.container.addChild(button);
    return button;
}

export function createButtons(context) {
    context.buyButton = createButton(context, 'ui_button_buyfeature', 180, context.app.screen.height - 250, context.buyCallback, 0.5);
    context.anteButton = createButton(context, 'ui_button_ante', 180, context.app.screen.height - 120, context.anteCallback, 0.5);

    context.spinButton = createButton(context, 'ui_button_spin', context.app.screen.width / 2, context.app.screen.height - 100, context.spinCallback, 0.7);

    context.autoplayButton = createButton(context, 'ui_button_autoplay', context.app.screen.width / 2 + 180, context.app.screen.height - 100, context.autoplayCallback, 0.5);

    const betGroup = new PIXI.Container();
    betGroup.x = context.app.screen.width / 2 - 350;
    betGroup.y = context.app.screen.height - 100;
    context.container.addChild(betGroup);
    
    context.increaseBetButton = createButton(context, 'ui_button_plus', 120, 0, context.increaseBet, 0.4);
    context.decreaseBetButton = createButton(context, 'ui_button_minus', -120, 0, context.decreaseBet, 0.4);
    betGroup.addChild(
        context.increaseBetButton,
        context.decreaseBetButton
    );

    context.betText = new PIXI.Text('', context.textStyle);
    context.betText.anchor.set(0.5);
    betGroup.addChild(context.betText);
}