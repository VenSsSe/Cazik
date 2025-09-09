import { createButtons } from './components/buttons.js';
import { createPanels } from './components/panels.js';
import { showAutoplayPopup as showAutoplayPopupFromModule, showSettingsPopup as showSettingsPopupFromModule } from './popups/index.js';
import { InfoPanel } from './InfoPanel.js';
import { BetController } from './BetController.js';

export class UI {
    constructor(context) {
        this.context = context;
        this.app = context.app;

        this.container = new PIXI.Container(); // Главный контейнер для всего UI
        this.textStyle = new PIXI.TextStyle({ fontFamily: 'Cyberpunk', fontSize: 42, fontWeight: '900', fill: '#f7d9a3', stroke: '#5c3a0a', strokeThickness: 5 });
        this.buttons = [];

        // Передаем главный контейнер UI в дочерние компоненты
        this.infoPanel = new InfoPanel(context, this.container);
        this.betController = new BetController(context, this.container);
    }

    create() {
        this._positionElements();
        this._createLogo();
        this._createStaticPanels();

        // Pass the UI instance itself as context to these factory functions
        createButtons(this);
        createPanels(this);

        this.buttons.push(
            this.spinButton,
            this.betController.increaseBetButton,
            this.betController.decreaseBetButton,
            this.anteButton,
            this.buyButton,
            this.autoplayButton,
            this.settingsButton
        );

        this.setInteractive(true);
    }

    _positionElements() {
        // Позиционируем дочерние компоненты относительно контейнера UI
        // Эти координаты будут относительны (0,0) контейнера UI
        this.betController.container.x = this.app.screen.width / 2 - 300;
        this.betController.container.y = this.app.screen.height - 100;

        // Позиционируем дочерние компоненты относительно контейнера UI
        // Эти координаты также будут относительны (0,0) контейнера UI
        this.infoPanel.balanceText.x = 50;
        this.infoPanel.balanceText.y = this.app.screen.height - 55;
        this.infoPanel.winText.x = this.app.screen.width - 50;
        this.infoPanel.winText.y = this.app.screen.height - 55;
    }

    _createLogo() {
        // Добавляем логотип
        const logo = PIXI.Sprite.from('logo_main');
        logo.anchor.set(0.2);
        logo.x = this.app.screen.width / 2 + 600;
        logo.y = 100; // Placeholder Y position
        logo.scale.set(0.3, 0.3); // Сжатие/растяжение по X и Y
        this.container.addChild(logo);
    }

    _createStaticPanels() {
        // Добавляем левую панель
        this.leftPanel = PIXI.Sprite.from('ui_panel_left');
        this.leftPanel.anchor.set(0.5);
        this.leftPanel.x = 75;
        this.leftPanel.y = this.app.screen.height / 2;
        this.leftPanel.scale.set(0.3, 0.3); // Сжатие/растяжение по X и Y
        this.container.addChild(this.leftPanel);

        // Добавляем нижнюю панель
        this.bottomPanel = PIXI.Sprite.from('ui_panel_bottom_main');
        this.bottomPanel.anchor.set(0.5);
        this.bottomPanel.x = this.app.screen.width / 2;
        this.bottomPanel.y = this.app.screen.height - 50;
        this.container.addChild(this.bottomPanel);
    }

    updateBalance(value) { this.infoPanel.updateBalance(value); }

    updateBet(betConfig) {
        this.betController.updateBetText(betConfig);
        this.infoPanel.updateBet(betConfig);
    }

    updateWin(value) { this.infoPanel.updateWin(value); }

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
        for (const button of this.buttons) {
            if (button) {
                button.interactive = interactive;
                button.buttonMode = true;
                button.alpha = interactive ? 1.0 : 0.5;
            }
        }
    }

    showAutoplayPopup(startCallback) {
        showAutoplayPopupFromModule(this, startCallback);
    }

    showSettingsPopup(callbacks) {
        showSettingsPopupFromModule(this, callbacks);
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
