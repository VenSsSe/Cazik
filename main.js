// --- main.js ---

import { loadAssets } from './loader.js';
import { createScene } from './scene.js';
import { Grid } from './grid.js';
import { checkForWins, calculatePayout } from './gameLogic.js';
import { UI } from './ui.js';
import { FreeSpinsManager } from './freeSpins.js';
import { Character } from './character.js';
import { BonusManager } from './bonus.js';
import { AutoplayManager } from './autoplay.js';
import { AudioManager } from './audio.js';

const app = new PIXI.Application();

let config, symbols, grid, ui, freeSpinsManager, bonusManager, autoplayManager;
let isSpinning = false;
let playerBalance = 1000;
let currentBet = 10;
const BET_STEP = 1;
let character;
// let audioManager;

async function init() {
    await app.init({
        width: 1920,
        height: 1080,
        backgroundColor: 0x1099bb,
    });
    document.body.appendChild(app.view);

    // audioManager = new AudioManager();
    // audioManager.load();

    const loadedData = await loadAssets();
    config = loadedData.config;
    symbols = loadedData.symbols;
    
    createScene(app);
    grid = new Grid(app, symbols);
    grid.create();

    character = new Character(app);
    character.addToScene();

    freeSpinsManager = new FreeSpinsManager();
    bonusManager = new BonusManager();
    autoplayManager = new AutoplayManager(startSpin);

    ui = new UI(app, startSpin, increaseBet, decreaseBet, handleAnteToggle, handleBuyBonus, handleAutoplay);
    ui.create();
    ui.updateSidePanel(bonusManager.isAnteBetActive);
    ui.updateBalance(playerBalance);
    ui.updateBet(currentBet);
    ui.updateWin(0);
    window.addEventListener('resize', resize);
    resize();
}

function handleAnteToggle() {
    if (isSpinning || autoplayManager.isActive) return;
    bonusManager.toggleAnteBet();
    ui.updateSidePanel(bonusManager.isAnteBetActive);
    const newBet = bonusManager.getSpinCost(currentBet);
    ui.updateBet(newBet);
}

function handleBuyBonus() {
    if (isSpinning || bonusManager.isAnteBetActive || autoplayManager.isActive) return;
    const cost = bonusManager.getBuyBonusCost(currentBet);
    if (playerBalance >= cost) {
        playerBalance -= cost;
        ui.updateBalance(playerBalance);
        // audioManager.play('buy_bonus_sound');
        freeSpinsManager.start(config.freeSpins.initialSpins);
        character.setPowerState(true);
        showCongratsPopup(true); // true означает, что это покупка
    } else {
        console.log("Недостаточно средств для покупки бонуса.");
    }
}

function handleAutoplay() {
    if (bonusManager.isAnteBetActive) return;

    if (autoplayManager.isActive) {
        autoplayManager.stop();
        ui.setAutoplayState(false);
    } else {
        autoplayManager.start(10); // Можно добавить выбор количества
        ui.setAutoplayState(true);
    }
}

function increaseBet() { 
    if (isSpinning || autoplayManager.isActive) return;
    currentBet += BET_STEP;
    if (currentBet > config.maxBet) currentBet = config.maxBet;
    const newBet = bonusManager.getSpinCost(currentBet);
    ui.updateBet(newBet);
}

function decreaseBet() { 
    if (isSpinning || autoplayManager.isActive) return;
    if (currentBet > config.minBet) {
        currentBet -= BET_STEP;
        const newBet = bonusManager.getSpinCost(currentBet);
        ui.updateBet(newBet);
    }
}

async function startSpin(isFirstFreeSpin = false) {
    if (isSpinning && !isFirstFreeSpin) return;
    isSpinning = true;

    // audioManager.play('spin_sound');

    if (freeSpinsManager.isActive) {
        freeSpinsManager.useSpin();
        ui.updateFreeSpins(freeSpinsManager.spinsLeft);
    } else {
        const spinCost = bonusManager.getSpinCost(currentBet);
        if (playerBalance < spinCost) {
            autoplayManager.stop();
            ui.setAutoplayState(false);
            console.log("Недостаточно средств.");
            isSpinning = false;
            return;
        }
        playerBalance -= spinCost;
    }
    
    ui.updateBalance(playerBalance);
    ui.updateWin(0);

    let currentSpinTotalWin = 0;
    await grid.spin();

    while (true) {
        const { wins, scatterCount } = checkForWins(grid.getSymbolIds());

        if (scatterCount >= config.freeSpins.triggerCount && !freeSpinsManager.isActive) {
            // audioManager.play('bonus_trigger_sound');
            freeSpinsManager.start(config.freeSpins.initialSpins);
            character.setPowerState(true);
            if(autoplayManager.isActive) autoplayManager.stop();
            showCongratsPopup();
            return; // Прерываем спин, ждем закрытия попапа
        } 
        if (scatterCount >= config.freeSpins.retriggerCount && freeSpinsManager.isActive) {
            freeSpinsManager.addSpins(config.freeSpins.extraSpins);
            ui.updateFreeSpins(freeSpinsManager.spinsLeft);
        }
        
        if (wins.length === 0) break;
        
        const payout = calculatePayout(wins, currentBet, symbols);
        // if (payout > 0) audioManager.play('win_sound');
        currentSpinTotalWin += payout;
        
        let spritesToRemove = wins.flatMap(w => w.positions).map(pos => grid.gridSprites[pos.col][pos.row]);
        await grid.removeSymbols([...new Set(spritesToRemove)]);
        await grid.tumbleDown();
        await grid.refillGrid();
        
        ui.updateWin(currentSpinTotalWin); // Обновляем выигрыш после каждого каскада
    }

    let totalMultiplierOnScreen = 0;
    grid.gridSprites.flat().forEach(sprite => {
        if (sprite && sprite.multiplierValue) totalMultiplierOnScreen += sprite.multiplierValue;
    });

    if (totalMultiplierOnScreen > 0 && currentSpinTotalWin > 0) {
        audioManager.play('multiplier_apply_sound');
        if (freeSpinsManager.isActive) {
            freeSpinsManager.addMultiplier(totalMultiplierOnScreen);
            currentSpinTotalWin *= freeSpinsManager.totalMultiplier;
        } else {
            currentSpinTotalWin *= totalMultiplierOnScreen;
        }
        ui.updateWin(currentSpinTotalWin);
    }
    
    playerBalance += currentSpinTotalWin;
    ui.updateBalance(playerBalance);

    if (freeSpinsManager.isActive && freeSpinsManager.spinsLeft <= 0) {
        freeSpinsManager.end();
        character.setPowerState(false);
        ui.hideFreeSpins();
        if(autoplayManager.isActive) autoplayManager.stop();
    }
    
    isSpinning = false;

    if (autoplayManager.isActive) {
        autoplayManager.continue();
    } else {
        ui.setAutoplayState(false);
    }
}

function showCongratsPopup(isBought = false) {
    const popup = PIXI.Sprite.from('ui_popup_congrats');
    popup.anchor.set(0.5);
    popup.x = app.screen.width / 2;
    popup.y = app.screen.height / 2;
    popup.scale.set(0.8);
    popup.eventMode = 'static';
    popup.cursor = 'pointer';

    const textStyle = new PIXI.TextStyle({ fontSize: 60, fill: '#FFD700', fontWeight: 'bold', stroke: '#000', strokeThickness: 5 });
    const spinsText = new PIXI.Text(`${freeSpinsManager.spinsLeft} FREE SPINS`, textStyle);
    spinsText.anchor.set(0.5);
    spinsText.y = 50;
    popup.addChild(spinsText);

    popup.on('pointerdown', () => {
        popup.destroy();
        ui.showFreeSpins(freeSpinsManager.spinsLeft);
        startSpin(true); // Начинаем первый бесплатный спин
    });

    app.stage.addChild(popup);
}

function resize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = Math.min(screenWidth / app.screen.width, screenHeight / app.screen.height);
    app.view.style.width = `${app.screen.width * scale}px`;
    app.view.style.height = `${app.screen.height * scale}px`;
}

init();
