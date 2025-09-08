import { createButtons } from './buttons.js';
import { createPanels } from './panels.js';
import { showAutoplayPopup as showAutoplayPopupFromModule, showSettingsPopup as showSettingsPopupFromModule } from './popups.js';
import { InfoPanel } from './InfoPanel.js';
import { BetController } from './BetController.js';

export class UI {
    constructor(app, { spinCallback, increaseBetCallback, decreaseBetCallback, setBetCallback, anteCallback, buyCallback, autoplayCallback, settingsCallback }) {
        this.app = app;
        
        this.container = new PIXI.Container();
        this.textStyle = new PIXI.TextStyle({ fontFamily: 'Arial Black', fontSize: 42, fontWeight: '900', fill: '#f7d9a3', stroke: '#5c3a0a', strokeThickness: 5 });
    
        this.infoPanel = new InfoPanel(app);
        this.betController = new BetController(app, increaseBetCallback, decreaseBetCallback, setBetCallback);

        // Pass callbacks to the context for createButtons
        this.spinCallback = spinCallback;
        this.anteCallback = anteCallback;
        this.buyCallback = buyCallback;
        this.autoplayCallback = autoplayCallback;
        this.settingsCallback = settingsCallback;
    }

    create() {
        this.app.stage.addChild(this.container);
        createButtons(this);
        createPanels(this);
    }

    updateBalance(value) { this.infoPanel.updateBalance(value); }
    updateBet(value) { 
        this.betController.updateBetText(value);
        this.infoPanel.updateBet(value);
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
        const buttons = [
            this.spinButton,
            this.betController.increaseBetButton,
            this.betController.decreaseBetButton,
            this.anteButton,
            this.buyButton,
            this.autoplayButton,
            this.infoButton
        ];

        for (const button of buttons) {
            if (button) {
                button.interactive = interactive;
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