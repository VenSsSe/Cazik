// --- ui.js (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---

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

        // --- ИЗМЕНЕНО: Стиль текста под новый дизайн ---
        this.textStyle = new PIXI.TextStyle({ fontFamily: 'Arial Black', fontSize: 42, fontWeight: '900', fill: '#f7d9a3', stroke: '#5c3a0a', strokeThickness: 5 });
    }

    create() {
        this.app.stage.addChild(this.container);

        // --- ИЗМЕНЕНО: Новое расположение и масштаб кнопок ---

        // --- Левая панель (Анте и Покупка) ---
        this.buyButton = this.createButton('ui_button_buyfeature', 180, this.app.screen.height - 250, this.buyCallback, 0.5);
        this.anteButton = this.createButton('ui_button_ante', 180, this.app.screen.height - 120, this.anteCallback, 0.5);

        // --- Нижняя панель УДАЛЕНА для чистоты интерфейса ---

        // Кнопка Spin по центру
        this.spinButton = this.createButton('ui_button_spin', this.app.screen.width / 2, this.app.screen.height - 100, this.spinCallback, 0.7);

        // Кнопка Autoplay справа от Spin
        this.autoplayButton = this.createButton('ui_button_autoplay', this.app.screen.width / 2 + 180, this.app.screen.height - 100, this.autoplayCallback, 0.5);

        // Группа управления ставкой
        const betGroup = new PIXI.Container();
        betGroup.x = this.app.screen.width / 2 - 350; // Сдвигаем левее
        betGroup.y = this.app.screen.height - 100; // Немного выше
        this.container.addChild(betGroup);
        
        // Кнопки "+" и "-"
        betGroup.addChild(
            this.createButton('ui_button_plus', 120, 0, this.increaseBet, 0.4),
            this.createButton('ui_button_minus', -120, 0, this.decreaseBet, 0.4)
        );
        this.betText = new PIXI.Text('', this.textStyle);
        this.betText.anchor.set(0.5);
        betGroup.addChild(this.betText);
        
        // --- ИЗМЕНЕНО: Позиции текста ---
        this.balanceText = new PIXI.Text('', this.textStyle);
        this.balanceText.anchor.set(0, 0.5);
        this.balanceText.x = 50;
        this.balanceText.y = this.app.screen.height - 100; // Поднимаем выше
        this.container.addChild(this.balanceText);
        
        this.winText = new PIXI.Text('', this.textStyle);
        this.winText.anchor.set(1, 0.5);
        this.winText.x = this.app.screen.width - 50; // Сдвигаем к правому краю
        this.winText.y = this.app.screen.height - 100; // Поднимаем выше
        this.container.addChild(this.winText);

        // --- Элементы для фриспинов (без изменений) ---
        this.fsContainer = new PIXI.Container();
        this.fsContainer.visible = false;
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

        // --- ДОБАВЛЕНО: Эффект наведения мыши для интерактивности ---
        button
            .on('pointerdown', callback)
            .on('pointerover', () => button.scale.set(scale * 1.1)) // Увеличиваем при наведении
            .on('pointerout', () => button.scale.set(scale));      // Возвращаем размер

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
