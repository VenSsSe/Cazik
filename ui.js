// --- ui.js ---

export class UI {
    constructor(app, spinCallback, increaseBet, decreaseBet) {
        this.app = app;
        this.spinCallback = spinCallback;
        this.increaseBet = increaseBet;
        this.decreaseBet = decreaseBet;
        this.container = new PIXI.Container();

        this.textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        });
    }

    create() {
        this.app.stage.addChild(this.container);

        // Нижняя панель
        const bottomPanel = PIXI.Sprite.from('ui_panel_bottom');
        bottomPanel.anchor.set(0.5, 1);
        bottomPanel.width = this.app.screen.width;
        bottomPanel.height = 150;
        bottomPanel.x = this.app.screen.width / 2;
        bottomPanel.y = this.app.screen.height;
        this.container.addChild(bottomPanel);

        // --- Кнопка Спина (в центре) ---
        const spinButton = this.createButton('ui_button_spin', 0, 0, this.spinCallback);
        spinButton.x = this.app.screen.width - 250;
        spinButton.y = this.app.screen.height - 75;

        // --- Управление ставкой ---
        const betGroup = new PIXI.Container();
        this.container.addChild(betGroup);
        betGroup.x = this.app.screen.width / 2 - 150;
        betGroup.y = this.app.screen.height - 75;
        
        const plusButton = this.createButton('ui_button_plus', 100, 0, this.increaseBet);
        const minusButton = this.createButton('ui_button_minus', -100, 0, this.decreaseBet);
        this.betText = new PIXI.Text('', this.textStyle);
        this.betText.anchor.set(0.5);
        
        betGroup.addChild(plusButton, minusButton, this.betText);
        
        // --- Отображение баланса и выигрыша ---
        this.balanceText = new PIXI.Text('', this.textStyle);
        this.balanceText.anchor.set(0, 0.5);
        this.balanceText.x = 50;
        this.balanceText.y = this.app.screen.height - 75;
        this.container.addChild(this.balanceText);
        
        this.winText = new PIXI.Text('', this.textStyle);
        this.winText.anchor.set(0.5);
        this.winText.x = this.app.screen.width / 2 + 250;
        this.winText.y = this.app.screen.height - 75;
        this.container.addChild(this.winText);
    }
    
    // Вспомогательная функция для создания кнопок
    createButton(texture, x, y, callback) {
        const button = PIXI.Sprite.from(texture);
        button.anchor.set(0.5);
        button.scale.set(0.8);
        button.x = x;
        button.y = y;
        button.eventMode = 'static';
        button.cursor = 'pointer';
        button.on('pointerdown', callback);
        this.container.addChild(button);
        return button;
    }

    updateBalance(value) {
        this.balanceText.text = `Balance: ${value.toFixed(2)}`;
    }

    updateBet(value) {
        this.betText.text = `Bet: ${value.toFixed(2)}`;
    }

    updateWin(value) {
        this.winText.text = `Win: ${value.toFixed(2)}`;
    }
}