import { checkForWins, calculatePayout } from './game/gameLogic.js';

// NOTE: All functions in this file are intended to be bound to a context object in app.js.
// This gives them access to the application state (app, grid, ui, playerBalance, etc.) via `this`.

export async function startSpin(isFirstFreeSpin = false) {
    if (this.isSpinning && !isFirstFreeSpin) return;
    this.isSpinning = true;
    this.ui.setInteractive(false);
    this.ui.hideTumbleWin();

    if (this.audioManager) this.audioManager.play('spin_sound');

    if (this.freeSpinsManager.isActive) {
        this.freeSpinsManager.useSpin();
        this.ui.updateFreeSpins(this.freeSpinsManager.spinsLeft);
    } else {
        const spinCost = this.bonusManager.getSpinCost(this.currentBet);
        if (this.playerBalance < spinCost) {
            this.autoplayManager.stop();
            this.ui.setAutoplayState(false);
            console.log("Недостаточно средств.");
            this.isSpinning = false;
            this.ui.setInteractive(true);
            return;
        }
        this.playerBalance -= spinCost;
    }
    
    this.ui.updateBalance(this.playerBalance);
    this.ui.updateWin(0);

    let currentSpinTotalWin = 0;
    let tumbleWin = 0;
    await this.grid.spin();

    while (true) {
        const { wins, scatterCount } = checkForWins(this.grid.getSymbolIds());

        if (scatterCount >= this.config.freeSpins.triggerCount && !this.freeSpinsManager.isActive) {
            if (this.audioManager) this.audioManager.play('bonus_trigger_sound');
            this.freeSpinsManager.start(this.config.freeSpins.initialSpins);
            this.character.setPowerState(true);
            if(this.autoplayManager.isActive) this.autoplayManager.stop();
            showCongratsPopup.call(this);
            return; 
        } 
        if (scatterCount >= this.config.freeSpins.retriggerCount && this.freeSpinsManager.isActive) {
            this.freeSpinsManager.addSpins(this.config.freeSpins.extraSpins);
            this.ui.updateFreeSpins(this.freeSpinsManager.spinsLeft);
        }
        
        if (wins.length === 0) break;
        
        const payout = calculatePayout(wins, this.currentBet, this.symbols);
        if (payout > 0) {
            if (this.audioManager) this.audioManager.play('win_sound');
            tumbleWin += payout;
            this.ui.updateTumbleWin(tumbleWin);
            this.ui.showTumbleWin();
        }
        currentSpinTotalWin += payout;
        
        const spritesToRemove = [];
        const winningPositions = new Set();

        wins.flatMap(w => w.positions).forEach(pos => winningPositions.add(`${pos.col}-${pos.row}`));

        winningPositions.forEach(posKey => {
            const [col, row] = posKey.split('-').map(Number);
            if (this.grid.gridSprites[col] && this.grid.gridSprites[col][row]) {
                spritesToRemove.push(this.grid.gridSprites[col][row]);
            }
        });

        await this.grid.removeSymbols(spritesToRemove);
        await this.grid.tumbleDown();
        await this.grid.refillGrid();
        
        this.ui.updateWin(currentSpinTotalWin);
    }

    let totalMultiplierOnScreen = 0;
    this.grid.gridSprites.flat().forEach(container => {
        if (container && container.symbolSprite && container.symbolSprite.multiplierValue) {
            totalMultiplierOnScreen += container.symbolSprite.multiplierValue;
        }
    });

    if (totalMultiplierOnScreen > 0 && currentSpinTotalWin > 0) {
        if (this.audioManager) this.audioManager.play('multiplier_apply_sound');
        if (this.freeSpinsManager.isActive) {
            this.freeSpinsManager.addMultiplier(totalMultiplierOnScreen);
            currentSpinTotalWin *= this.freeSpinsManager.totalMultiplier;
        } else {
            currentSpinTotalWin *= totalMultiplierOnScreen;
        }
        this.ui.updateWin(currentSpinTotalWin);
    }
    
    this.playerBalance += currentSpinTotalWin;
    this.ui.updateBalance(this.playerBalance);

    if (this.freeSpinsManager.isActive && this.freeSpinsManager.spinsLeft <= 0) {
        this.freeSpinsManager.end();
        this.character.setPowerState(false);
        this.ui.hideFreeSpins();
        if(this.autoplayManager.isActive) this.autoplayManager.stop();
    }
    
    this.isSpinning = false;
    this.ui.setInteractive(true);

    if (this.autoplayManager.isActive) {
        this.autoplayManager.continue();
    } else {
        this.ui.setAutoplayState(false);
    }
}

export function showCongratsPopup(isBought = false) {
    const popup = PIXI.Sprite.from('ui_popup_congrats');
    popup.anchor.set(0.5);
    popup.x = this.app.screen.width / 2;
    popup.y = this.app.screen.height / 2;
    popup.scale.set(1.5);
    popup.eventMode = 'static';
    popup.cursor = 'pointer';

    const textStyle = new PIXI.TextStyle({ 
        fontFamily: 'Arial Black', 
        fontSize: 80, 
        fill: '#FFD700', 
        fontWeight: 'bold', 
        stroke: '#4a2500', 
        strokeThickness: 8 
    });
    const spinsText = new PIXI.Text(`${this.freeSpinsManager.spinsLeft} FREE SPINS`, textStyle);
    spinsText.anchor.set(0.5);
    spinsText.y = 50;
    popup.addChild(spinsText);

    popup.on('pointerdown', () => {
        popup.destroy();
        this.ui.showFreeSpins(this.freeSpinsManager.spinsLeft);
        startSpin.call(this, true);
    });

    this.app.stage.addChild(popup);
}

export function handleAnteToggle() {
    if (this.isSpinning || this.autoplayManager.isActive) return;
    this.bonusManager.toggleAnteBet();
    this.ui.updateSidePanel(this.bonusManager.isAnteBetActive);
    const newBet = this.bonusManager.getSpinCost(this.currentBet);
    this.ui.updateBet(newBet);
}

export function handleBuyBonus() {
    if (this.isSpinning || this.bonusManager.isAnteBetActive || this.autoplayManager.isActive) return;
    const cost = this.bonusManager.getBuyBonusCost(this.currentBet);
    if (this.playerBalance >= cost) {
        this.playerBalance -= cost;
        this.ui.updateBalance(this.playerBalance);
        if (this.audioManager) this.audioManager.play('buy_bonus_sound');
        this.freeSpinsManager.start(this.config.freeSpins.initialSpins);
        this.character.setPowerState(true);
        showCongratsPopup.call(this, true);
    } else {
        console.log("Недостаточно средств для покупки бонуса.");
    }
}

export function handleAutoplay() {
    if (this.bonusManager.isAnteBetActive) return;

    if (this.autoplayManager.isActive) {
        this.autoplayManager.stop();
        this.ui.setAutoplayState(false);
    } else {
        this.ui.showAutoplayPopup((count) => {
            this.autoplayManager.start(count);
            this.ui.setAutoplayState(true);
        });
    }
}

export function increaseBet() { 
    if (this.isSpinning || this.autoplayManager.isActive) return;
    this.currentBet += this.BET_STEP;
    if (this.currentBet > this.config.maxBet) this.currentBet = this.config.maxBet;
    const newBet = this.bonusManager.getSpinCost(this.currentBet);
    this.ui.updateBet(newBet);
}

export function decreaseBet() { 
    if (this.isSpinning || this.autoplayManager.isActive) return;
    if (this.currentBet > this.config.minBet) {
        this.currentBet -= this.BET_STEP;
        const newBet = this.bonusManager.getSpinCost(this.currentBet);
        this.ui.updateBet(newBet);
    }
}
