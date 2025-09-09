import { SpeedModes } from '../../game/SpeedManager.js';

export function showAutoplayPopup(context, startCallback) {
    if (context.autoplayPopup) {
        context.autoplayPopup.destroy();
    }

    let selectedSpeed = SpeedModes.NORMAL;

    const popup = new PIXI.Container();
    context.autoplayPopup = popup;
    popup.x = context.app.screen.width / 2;
    popup.y = context.app.screen.height / 2;
    context.app.stage.addChild(popup);

    const background = PIXI.Sprite.from('popup_background_large');
    background.anchor.set(0.5);
    popup.addChild(background);

    const title = new PIXI.Text('АВТОИГРА', { ...context.textStyle, fontSize: 40, fill: '#FFFFFF' });
    title.anchor.set(0.5);
    title.y = -background.height / 2 + 60;
    popup.addChild(title);

    const spinCounts = [10, 20, 25, 50, 100];
    const buttonContainer = new PIXI.Container();
    popup.addChild(buttonContainer);

    spinCounts.forEach((count, index) => {
        const button = new PIXI.Graphics().beginFill(0x333333, 0.8).drawRoundedRect(0, 0, 100, 50, 15).endFill();
        button.interactive = true;
        button.buttonMode = true;
        const text = new PIXI.Text(count, { ...context.textStyle, fontSize: 28, fill: '#FFFFFF' });
        text.anchor.set(0.5);
        text.x = 50;
        text.y = 25;
        button.addChild(text);
        const col = index % 5;
        button.x = col * 120;
        button.on('pointerdown', () => {
            context.speedManager.setSpeed(selectedSpeed);
            startCallback(count);
            if (context.autoplayPopup) { context.autoplayPopup.destroy(); context.autoplayPopup = null; }
        });
        buttonContainer.addChild(button);
    });

    buttonContainer.x = -buttonContainer.width / 2;
    buttonContainer.y = -100;

    // --- Checkboxes ---
    const checkboxContainer = new PIXI.Container();
    checkboxContainer.y = 50;
    popup.addChild(checkboxContainer);

    const turboCheckboxSprite = PIXI.Sprite.from('ui_checkbox_unchecked');
    const quickCheckboxSprite = PIXI.Sprite.from('ui_checkbox_unchecked');

    const setupCheckbox = (sprite, labelText, xPos, speedMode) => {
        const container = new PIXI.Container();
        container.x = xPos;
        sprite.scale.set(0.6);
        sprite.anchor.set(0.5);
        const label = new PIXI.Text(labelText, { ...context.textStyle, fontSize: 28, fill: '#FFFFFF' });
        label.anchor.set(0, 0.5);
        label.x = 30;
        container.addChild(sprite, label);
        container.eventMode = 'static';
        container.cursor = 'pointer';
        container.on('pointerdown', () => {
            if (selectedSpeed === speedMode) {
                selectedSpeed = SpeedModes.NORMAL;
                sprite.texture = PIXI.Assets.get('ui_checkbox_unchecked');
            } else {
                selectedSpeed = speedMode;
                turboCheckboxSprite.texture = PIXI.Assets.get('ui_checkbox_unchecked');
                quickCheckboxSprite.texture = PIXI.Assets.get('ui_checkbox_unchecked');
                sprite.texture = PIXI.Assets.get('ui_checkbox_checked');
            }
        });
        return container;
    };

    const turboCheckbox = setupCheckbox(turboCheckboxSprite, 'Турбо-спин', -200, SpeedModes.TURBO);
    const quickCheckbox = setupCheckbox(quickCheckboxSprite, 'Быстрая игра', 100, SpeedModes.QUICK);
    
    checkboxContainer.addChild(turboCheckbox, quickCheckbox);
    checkboxContainer.x = -checkboxContainer.width / 2 + 100;


    const closeButton = new PIXI.Text('X', { ...context.textStyle, fontSize: 30, fill: '#FF0000' });
    closeButton.anchor.set(0.5);
    closeButton.x = background.width / 2 - 40;
    closeButton.y = -background.height / 2 + 40;
    closeButton.interactive = true;
    closeButton.buttonMode = true;
    closeButton.on('pointerdown', () => {
        if (context.autoplayPopup) { context.autoplayPopup.destroy(); context.autoplayPopup = null; }
    });
    popup.addChild(closeButton);
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
        fontFamily: 'Cyberpunk', 
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

export function showSettingsPopup(context, { onSoundToggle, onSpeedToggle, onPayoutTable }) {
    if (context.settingsPopup) {
        context.settingsPopup.destroy();
    }

    const popup = new PIXI.Container();
    context.settingsPopup = popup;
    popup.x = context.app.screen.width / 2;
    popup.y = context.app.screen.height / 2;
    context.app.stage.addChild(popup);

    const background = PIXI.Sprite.from('popup_background_large');
    background.anchor.set(0.5);
    popup.addChild(background);

    const title = new PIXI.Text('НАСТРОЙКИ', { ...context.textStyle, fontSize: 40, fill: '#FFFFFF' });
    title.anchor.set(0.5);
    title.y = -background.height / 2 + 60;
    popup.addChild(title);

    // Sound Toggle
    const soundButton = new PIXI.Text('ЗВУК: ВКЛ', { ...context.textStyle, fontSize: 32, fill: '#FFFFFF' });
    soundButton.anchor.set(0.5);
    soundButton.y = -background.height / 2 + 150;
    soundButton.eventMode = 'static';
    soundButton.cursor = 'pointer';
    soundButton.on('pointerdown', () => {
        const isSoundOn = onSoundToggle();
        soundButton.text = `ЗВУК: ${isSoundOn ? 'ВКЛ' : 'ВЫКЛ'}`;
    });
    popup.addChild(soundButton);

    // Speed Toggle
    const speedButton = new PIXI.Text('СКОРОСТЬ: ОБЫЧНАЯ', { ...context.textStyle, fontSize: 32, fill: '#FFFFFF' });
    speedButton.anchor.set(0.5);
    speedButton.y = -background.height / 2 + 220;
    speedButton.eventMode = 'static';
    speedButton.cursor = 'pointer';
    speedButton.on('pointerdown', () => {
        const newSpeed = onSpeedToggle();
        let speedText = '';
        switch (newSpeed) {
            case 'NORMAL': speedText = 'ОБЫЧНАЯ'; break;
            case 'TURBO': speedText = 'ТУРБО'; break;
            case 'QUICK': speedText = 'БЫСТРАЯ'; break;
        }
        speedButton.text = `СКОРОСТЬ: ${speedText}`;
    });
    popup.addChild(speedButton);

    // Payout Table Button
    const payoutButton = new PIXI.Text('ТАБЛИЦА ВЫПЛАТ', { ...context.textStyle, fontSize: 32, fill: '#FFFFFF' });
    payoutButton.anchor.set(0.5);
    payoutButton.y = -background.height / 2 + 290;
    payoutButton.eventMode = 'static';
    payoutButton.cursor = 'pointer';
    payoutButton.on('pointerdown', onPayoutTable);
    popup.addChild(payoutButton);

    const closeButton = new PIXI.Text('X', { ...context.textStyle, fontSize: 30, fill: '#FF0000' });
    closeButton.anchor.set(0.5);
    closeButton.x = background.width / 2 - 40;
    closeButton.y = -background.height / 2 + 40;
    closeButton.interactive = true;
    closeButton.buttonMode = true;
    closeButton.on('pointerdown', () => {
        context.settingsPopup.destroy();
        context.settingsPopup = null;
    });
    popup.addChild(closeButton);
}