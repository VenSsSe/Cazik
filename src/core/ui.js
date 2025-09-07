import { createButtons } from './ui/buttons.js';
import { createPanels } from './ui/panels.js';
import { showAutoplayPopup as showAutoplayPopupFromModule } from './ui/popups.js';

export class UI {
    constructor(app, spinCallback, increaseBet, decreaseBet, anteCallback, buyCallback, autoplayCallback) {
        this.app = app;
        // Callbacks
        this.spinCallback = spinCallback;
        this.increaseBet = increaseBet;
        this.decreaseBet = decreaseBet;
        this.anteCallback = anteCallback;
        this.buyCallback = buyCallback;
        this.autoplayCallback = autoplayCallback;
        
        this.container = new PIXI.Container();
        this.textStyle = new PIXI.TextStyle({ fontFamily: 'Arial Black', fontSize: 42, fontWeight: '900', fill: '#f7d9a3', stroke: '#5c3a0a', strokeThickness: 5 });
    }

    create() {
        this.app.stage.addChild(this.container);
        createButtons(this);
        createPanels(this);
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
        showAutoplayPopupFromModule(this, startCallback);
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
