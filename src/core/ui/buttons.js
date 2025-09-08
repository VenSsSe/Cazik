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
    const yPos = context.app.screen.height - 90;

    // Left side buttons
    context.infoButton = createButton(context, 'ui_button_info', 80, yPos, context.settingsCallback, 0.4);
    
    // These buttons seem to be part of a different panel (left side panel)
    context.buyButton = createButton(context, 'ui_button_buyfeature', 180, context.app.screen.height - 250, context.buyCallback, 0.5);
    context.anteButton = createButton(context, 'ui_button_ante', 180, context.app.screen.height - 120, context.anteCallback, 0.5);

    // Center buttons
    context.spinButton = createButton(context, 'ui_button_spin', context.app.screen.width / 2, yPos, context.spinCallback, 0.7);
    context.autoplayButton = createButton(context, 'ui_button_autoplay', context.app.screen.width / 2 + 180, yPos, context.autoplayCallback, 0.5);
}