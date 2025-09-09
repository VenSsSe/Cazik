import { showBetPopup } from './popups/BetPopup.js';

export class BetController {
    constructor(app, increaseBetCallback, decreaseBetCallback, setBetCallback) {
        this.app = app;
        this.increaseBetCallback = increaseBetCallback;
        this.decreaseBetCallback = decreaseBetCallback;
        this.setBetCallback = setBetCallback;

        this.container = new PIXI.Container();
        // --- Позиционируем контейнер на нижней панели, левее кнопки СПИН ---
        this.container.x = app.screen.width / 2 - 300;
        this.container.y = app.screen.height - 90;
        app.stage.addChild(this.container);

        this.textStyle = new PIXI.TextStyle({
            fontFamily: 'Cyberpunk',
            fontSize: 38, // Тот же размер, что и в InfoPanel
            fontWeight: '900',
            fill: '#f7d9a3',
            stroke: '#5c3a0a',
            strokeThickness: 5
        });

        this.createComponents();
    }

    createComponents() {
        // Кнопка "+"
        this.increaseBetButton = this.createButton('ui_button_plus', 160, 0, this.increaseBetCallback, 0.1);
        
        // Кнопка "-"
        this.decreaseBetButton = this.createButton('ui_button_minus', -160, 0, this.decreaseBetCallback, 0.1);
        
        // Текст ставки, который теперь является кликабельной кнопкой
        this.betText = new PIXI.Text('', this.textStyle);
        this.betText.anchor.set(0.5);
        this.betText.eventMode = 'static';
        this.betText.cursor = 'pointer';
        this.betText.on('pointerdown', () => showBetPopup(this.app, this.textStyle, this.setBetCallback));
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
        this.betText.text = `СТАВКА\n${value.toFixed(2)}`;
        // Делаем текст многострочным для лучшего вида
        this.betText.style.align = 'center';
    }
}