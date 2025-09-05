// --- ui.js ---
// Отвечает за создание и управление всеми элементами интерфейса

export class UI {
    constructor(app, spinCallback) {
        this.app = app;
        this.spinCallback = spinCallback;

        // Стили для текста
        this.textStyle = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 48,
            fontWeight: 'bold',
            fill: '#ffffff', // градиент
            stroke: '#4a1850',
            strokeThickness: 5,
        });
    }

    create() {
        // Нижняя панель UI
        const bottomPanel = PIXI.Sprite.from('ui_panel_bottom');
        bottomPanel.anchor.set(0.5, 1);
        bottomPanel.x = this.app.screen.width / 2;
        bottomPanel.y = this.app.screen.height;
        this.app.stage.addChild(bottomPanel);

        // Кнопка спина
        const spinButton = PIXI.Sprite.from('ui_button_spin');
        spinButton.anchor.set(0.5);
        spinButton.x = this.app.screen.width / 2 + 450;
        spinButton.y = this.app.screen.height - bottomPanel.height / 2;
        spinButton.eventMode = 'static';
        spinButton.cursor = 'pointer';
        spinButton.on('pointerdown', this.spinCallback);
        this.app.stage.addChild(spinButton);

        // Текст Баланса
        this.balanceText = new PIXI.Text('', this.textStyle);
        this.balanceText.anchor.set(0.5);
        this.balanceText.x = this.app.screen.width / 2 - 400;
        this.balanceText.y = this.app.screen.height - bottomPanel.height / 2;
        this.app.stage.addChild(this.balanceText);

        // Текст Ставки
        this.betText = new PIXI.Text('', this.textStyle);
        this.betText.anchor.set(0.5);
        this.betText.x = this.app.screen.width / 2;
        this.betText.y = this.app.screen.height - bottomPanel.height / 2;
        this.app.stage.addChild(this.betText);

        // Текст Выигрыша
        this.winText = new PIXI.Text('', this.textStyle);
        this.winText.anchor.set(0.5);
        this.winText.x = this.app.screen.width / 2 + 200;
        this.winText.y = this.app.screen.height - bottomPanel.height / 2;
        this.app.stage.addChild(this.winText);

        console.log("UI создан!");
    }

    /**
     * Обновляет текст баланса
     * @param {number} value - новое значение баланса
     */
    updateBalance(value) {
        this.balanceText.text = `Balance: ${value.toFixed(2)}`;
    }

    /**
     * Обновляет текст ставки
     * @param {number} value - новое значение ставки
     */
    updateBet(value) {
        this.betText.text = `Bet: ${value.toFixed(2)}`;
    }

    /**
     * Обновляет текст выигрыша
     * @param {number} value - новое значение выигрыша
     */
    updateWin(value) {
        this.winText.text = `Win: ${value.toFixed(2)}`;
    }
}
