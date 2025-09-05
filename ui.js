// --- ui.js ---

export class UI {
    constructor(app, spinCallback, increaseBet, decreaseBet, anteCallback, buyCallback, autoplayCallback) {
        this.app = app;
        this.spinCallback = spinCallback;
        this.increaseBet = increaseBet;
        this.decreaseBet = decreaseBet;
        this.anteCallback = anteCallback;
        this.buyCallback = buyCallback;
        this.autoplayCallback = autoplayCallback;
        this.container = new PIXI.Container();

        this.textStyle = new PIXI.TextStyle({ fontFamily: 'Arial', fontSize: 36, fontWeight: 'bold', fill: '#ffffff', stroke: '#000000', strokeThickness: 4 });
    }

    create() {
        this.app.stage.addChild(this.container);

        // --- Левая панель (Анте и Покупка) ---
        this.buyButton = this.createButton('ui_button_buyfeature', 200, 400, this.buyCallback, 1.2);
        this.anteButton = this.createButton('ui_panel_ante', 200, 600, this.anteCallback, 1.2);

        // --- Нижняя панель ---
        const bottomPanel = PIXI.Sprite.from('ui_panel_bottom');
        bottomPanel.anchor.set(0.5, 1);
        bottomPanel.width = this.app.screen.width;
        bottomPanel.height = 150;
        bottomPanel.x = this.app.screen.width / 2;
        bottomPanel.y = this.app.screen.height;
        this.container.addChild(bottomPanel);

        this.spinButton = this.createButton('ui_button_spin', this.app.screen.width - 250, this.app.screen.height - 75, this.spinCallback);
        this.autoplayButton = this.createButton('ui_button_autoplay', this.app.screen.width - 450, this.app.screen.height - 75, this.autoplayCallback);

        const betGroup = new PIXI.Container();
        betGroup.x = this.app.screen.width / 2 - 150;
        betGroup.y = this.app.screen.height - 75;
        this.container.addChild(betGroup);
        
        betGroup.addChild(
            this.createButton('ui_button_plus', 100, 0, this.increaseBet),
            this.createButton('ui_button_minus', -100, 0, this.decreaseBet)
        );
        this.betText = new PIXI.Text('', this.textStyle);
        this.betText.anchor.set(0.5);
        betGroup.addChild(this.betText);
        
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

        // --- Элементы для фриспинов (ИСПРАВЛЕНО) ---
        this.fsContainer = new PIXI.Container();
        this.fsContainer.visible = false;
        // Явно указываем все свойства, чтобы избежать ошибки
        const fsTextStyle = new PIXI.TextStyle({ 
            fontFamily: 'Arial',
            fontSize: 48,
            fontWeight: 'bold',
            fill: '#FFD700',
            stroke: '#000000',
            strokeThickness: 5
        });
        this.fsText = new PIXI.Text('', fsTextStyle);
        this.fsText.anchor.set(0.5);
        this.fsText.x = this.app.screen.width / 2;
        this.fsText.y = 50;
        this.fsContainer.addChild(this.fsText);
        this.app.stage.addChild(this.fsContainer);
    }
    
    createButton(texture, x, y, callback, scale = 0.8) {
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

    updateBalance(value) { this.balanceText.text = `Balance: ${value.toFixed(2)}`; }
    updateBet(value) { this.betText.text = `Bet: ${value.toFixed(2)}`; }
    updateWin(value) { this.winText.text = `Win: ${value.toFixed(2)}`; }

    updateSidePanel(isAnteActive) {
        this.anteButton.tint = isAnteActive ? 0x00FF00 : 0xFFFFFF;
        this.buyButton.alpha = isAnteActive ? 0.5 : 1.0;
    }

    setAutoplayState(isActive) {
        this.autoplayButton.tint = isActive ? 0x00FF00 : 0xFFFFFF;
    }

    showFreeSpins(count) {
        this.fsContainer.visible = true;
        this.updateFreeSpins(count);
    }

    hideFreeSpins() {
        this.fsContainer.visible = false;
    }

    updateFreeSpins(count) {
        this.fsText.text = `Free Spins Left: ${count}`;
    }
}