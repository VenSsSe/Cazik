import { showBetConfigurationPopup } from './popups/BetPopup.js';

export class BetController {
    constructor(context, parentContainer) {
        this.context = context;
        this.app = context.app;

        this.container = new PIXI.Container();
        parentContainer.addChild(this.container);

        // Основной стиль для крупного текста (общая ставка)
        this.mainTextStyle = new PIXI.TextStyle({
            fontFamily: 'Cyberpunk',
            fontSize: 20,
            fontWeight: '900',
            fill: '#f7d9a3',
            stroke: '#5c3a0a',
            strokeThickness: 5,
            align: 'center'
        });

        // Стиль поменьше для деталей (уровень и номинал)
        this.detailTextStyle = new PIXI.TextStyle({
            fontFamily: 'Cyberpunk',
            fontSize: 18,
            fontWeight: 'normal',
            fill: '#f7d9a3',
            align: 'center'
        });

        this.createComponents();
    }

    createComponents() {
        // Кнопка "+"
        this.increaseBetButton = this.createButton('ui_button_plus', 160, 0, () => this.context.callbacks.cycleTotalBet(1), 0.1);
        
        // Кнопка "-"
        this.decreaseBetButton = this.createButton('ui_button_minus', -160, 0, () => this.context.callbacks.cycleTotalBet(-1), 0.1);
        
        // --- Новый контейнер для текста ставки ---
        this.betTextContainer = new PIXI.Container();
        this.betTextContainer.eventMode = 'static';
        this.betTextContainer.cursor = 'pointer';
        this.betTextContainer.on('pointerdown', () => {
            showBetConfigurationPopup(this.context, this.context.callbacks.setBetConfiguration);
        });
        this.container.addChild(this.betTextContainer);

        this.totalBetText = new PIXI.Text('', this.mainTextStyle);
        this.totalBetText.anchor.set(0.5, 1);

        this.detailBetText = new PIXI.Text('', this.detailTextStyle);
        this.detailBetText.anchor.set(0.5, 0);
        this.detailBetText.y = 5;

        this.betTextContainer.addChild(this.totalBetText, this.detailBetText);
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

    updateBetText(betConfig) {
        this.totalBetText.text = `СТАВКА\n${betConfig.totalBet.toFixed(2)}`;
        this.detailBetText.text = `УР ${betConfig.level} | НОМ ${betConfig.value.toFixed(2)}`;
    }
}