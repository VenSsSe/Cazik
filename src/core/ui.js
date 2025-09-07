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
        this.increaseBetButton = this.createButton('ui_button_plus', 120, 0, this.increaseBet, 0.4);
        this.decreaseBetButton = this.createButton('ui_button_minus', -120, 0, this.decreaseBet, 0.4);
        betGroup.addChild(
            this.increaseBetButton,
            this.decreaseBetButton
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

        // Табло выигрыша за падение
        const tumbleWinStyle = new PIXI.TextStyle({
            fontFamily: 'Arial Black',
            fontSize: 36,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        });
        this.tumbleWinText = new PIXI.Text('', tumbleWinStyle);
        this.tumbleWinText.anchor.set(0.5);
        this.tumbleWinText.x = this.app.screen.width / 2;
        this.tumbleWinText.y = 120; // Position it above the grid
        this.tumbleWinText.visible = false;
        this.container.addChild(this.tumbleWinText);
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

    setInteractive(interactive) {
        const buttons = [
            this.spinButton,
            this.increaseBetButton,
            this.decreaseBetButton,
            this.anteButton,
            this.buyButton,
            this.autoplayButton,
        ];

        for (const button of buttons) {
            if (button) {
                button.interactive = interactive;
                button.alpha = interactive ? 1.0 : 0.5;
            }
        }
    }

    showAutoplayPopup(startCallback) {
        if (this.autoplayPopup) {
            this.autoplayPopup.destroy();
        }
    
        const popup = new PIXI.Container();
        this.autoplayPopup = popup;
        popup.x = this.app.screen.width / 2;
        popup.y = this.app.screen.height / 2;
    
        const background = new PIXI.Graphics();
        background.beginFill(0x000000, 0.8);
        background.drawRect(-300, -200, 600, 400);
        background.endFill();
        popup.addChild(background);
    
        const title = new PIXI.Text('Select Autoplay Spins', { ...this.textStyle, fontSize: 30 });
        title.anchor.set(0.5);
        title.y = -160;
        popup.addChild(title);
    
        const spinCounts = [10, 20, 25, 50, 100, 500, 1000];
        const buttonContainer = new PIXI.Container();
        popup.addChild(buttonContainer);
    
        const buttonWidth = 120;
        const buttonHeight = 50;
        const gap = 20;
        const columns = 3;
    
        spinCounts.forEach((count, index) => {
            const button = new PIXI.Graphics();
            button.beginFill(0x333333);
            button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 10);
            button.endFill();
            button.interactive = true;
            button.buttonMode = true;
    
            const text = new PIXI.Text(count, { ...this.textStyle, fontSize: 24, fill: '#FFFFFF' });
            text.anchor.set(0.5);
            text.x = buttonWidth / 2;
            text.y = buttonHeight / 2;
            button.addChild(text);
    
            const col = index % columns;
            const row = Math.floor(index / columns);
    
            button.x = col * (buttonWidth + gap);
            button.y = row * (buttonHeight + gap);
    
            button.on('pointerdown', () => {
                startCallback(count);
                if (this.autoplayPopup) {
                    this.autoplayPopup.destroy();
                    this.autoplayPopup = null;
                }
            });
            
            buttonContainer.addChild(button);
        });
    
        buttonContainer.x = -buttonContainer.width / 2;
        buttonContainer.y = -buttonContainer.height / 2 + 20;
    
        const closeButton = new PIXI.Text('X', { ...this.textStyle, fontSize: 24, fill: '#FF0000' });
        closeButton.anchor.set(0.5);
        closeButton.x = 280;
        closeButton.y = -180;
        closeButton.interactive = true;
        closeButton.buttonMode = true;
        closeButton.on('pointerdown', () => {
            if (this.autoplayPopup) {
                this.autoplayPopup.destroy();
                this.autoplayPopup = null;
            }
        });
        popup.addChild(closeButton);
    
        this.container.addChild(popup);
    }

    updateTumbleWin(value) {
        this.tumbleWinText.text = `Tumble Win: ${value.toFixed(2)}`;
    }

    showTumbleWin() {
        this.tumbleWinText.visible = true;
    }

    hideTumbleWin() {
        this.tumbleWinText.visible = false;
    }
}