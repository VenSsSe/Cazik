export class BetController {
    constructor(app, increaseBetCallback, decreaseBetCallback, setBetCallback) {
        this.app = app;
        this.increaseBetCallback = increaseBetCallback;
        this.decreaseBetCallback = decreaseBetCallback;
        this.setBetCallback = setBetCallback; // Callback to set a specific bet value

        this.container = new PIXI.Container();
        this.container.x = app.screen.width / 2 - 350;
        this.container.y = app.screen.height - 90;
        app.stage.addChild(this.container);

        this.textStyle = new PIXI.TextStyle({
            fontFamily: 'Cyberpunk',
            fontSize: 42,
            fontWeight: '900',
            fill: '#f7d9a3',
            stroke: '#5c3a0a',
            strokeThickness: 5
        });

        this.createComponents();
    }

    createComponents() {
        this.increaseBetButton = this.createButton('ui_button_plus', 120, 0, this.increaseBetCallback, 0.1);
        this.decreaseBetButton = this.createButton('ui_button_minus', -120, 0, this.decreaseBetCallback, 0.1);
        
        this.betText = new PIXI.Text('', this.textStyle);
        this.betText.anchor.set(0.5);
        this.betText.eventMode = 'static';
        this.betText.cursor = 'pointer';
        this.betText.on('pointerdown', () => this.showBetPopup());
        this.container.addChild(this.betText);
    }

    createButton(texture, x, y, callback, scale) {
        const button = PIXI.Sprite.from(texture);
        button.anchor.set(0.5);
        button.scale.set(scale);
        button.x = x;
        button.y = y;
        button.eventMode = 'static';
        button.cursor = 'pointer';
        button.on('pointerdown', callback);
        this.container.addChild(button);
        return button;
    }

    updateBetText(value) {
        this.betText.text = `Bet: ${value.toFixed(2)}`;
    }

    showBetPopup() {
        if (this.betPopup) {
            this.betPopup.destroy();
        }

        const popup = new PIXI.Container();
        this.betPopup = popup;
        popup.x = this.app.screen.width / 2;
        popup.y = this.app.screen.height / 2;
        this.app.stage.addChild(popup);

        // Используем новый спрайт для фона
        const background = PIXI.Sprite.from('bet_popup_background');
        background.anchor.set(0.5);
        popup.addChild(background);

        const title = new PIXI.Text('Select Bet', { ...this.textStyle, fontSize: 40, fill: '#FFFFFF' });
        title.anchor.set(0.5);
        title.y = -background.height / 2 + 50; // Располагаем заголовок вверху попапа
        popup.addChild(title);

        const betValues = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
        const buttonContainer = new PIXI.Container();
        popup.addChild(buttonContainer);

        betValues.forEach((value, index) => {
            // Для кнопок можно оставить Graphics или тоже заменить на спрайты, если они есть
            const button = new PIXI.Graphics();
            button.beginFill(0x333333, 0.7);
            button.drawRoundedRect(0, 0, 120, 50, 15);
            button.endFill();
            button.interactive = true;
            button.buttonMode = true;

            const text = new PIXI.Text(value.toFixed(2), { ...this.textStyle, fontSize: 28, fill: '#FFFFFF' });
            text.anchor.set(0.5);
            text.x = 60;
            text.y = 25;
            button.addChild(text);

            const col = index % 4;
            const row = Math.floor(index / 4);
            button.x = col * 140;
            button.y = row * 70;

            button.on('pointerdown', () => {
                this.setBetCallback(value);
                this.betPopup.destroy();
                this.betPopup = null;
            });
            
            buttonContainer.addChild(button);
        });

        // Центрируем контейнер с кнопками внутри попапа
        buttonContainer.x = -buttonContainer.width / 2;
        buttonContainer.y = -buttonContainer.height / 2 + 20;

        const closeButton = new PIXI.Text('X', { ...this.textStyle, fontSize: 30, fill: '#FF0000' });
        closeButton.anchor.set(0.5);
        closeButton.x = background.width / 2 - 30;
        closeButton.y = -background.height / 2 + 30;
        closeButton.interactive = true;
        closeButton.buttonMode = true;
        closeButton.on('pointerdown', () => {
            this.betPopup.destroy();
            this.betPopup = null;
        });
        popup.addChild(closeButton);
    }
}
