import { loadAssets } from './core/loader.js';
import { createScene } from './game/scene.js';
import { Grid } from './game/grid.js';
import { UI } from './core/ui.js';
import { FreeSpinsManager } from './features/freeSpins.js';
import { Character } from './features/character.js';
import { BonusManager } from './features/bonus.js';
import { AutoplayManager } from './features/autoplay.js';
import { AudioManager } from './core/audio.js';
import { SpeedManager } from './features/SpeedManager.js';
import * as game from './game.js';

const app = new PIXI.Application();

// The context object holds the application's state and instances.
const context = {
    app,
    config: null,
    symbols: null,
    grid: null,
    ui: null,
    freeSpinsManager: null,
    bonusManager: null,
    autoplayManager: null,
    character: null,
    audioManager: null,
    speedManager: null,
    isSpinning: false,
    playerBalance: 1000,
    currentBet: 10,
    BET_STEP: 1,
};

export async function init() {
    await app.init({
        width: 1920,
        height: 1080,
        backgroundColor: 0x1099bb,
    });
    document.body.appendChild(app.view);

    const initAudio = () => {
        if (PIXI.sound.context.state === 'suspended') {
            PIXI.sound.context.resume();
        }
        if (!context.audioManager) {
            context.audioManager = new AudioManager();
            context.audioManager.load();
        }
        window.removeEventListener('pointerdown', initAudio);
    };
    window.addEventListener('pointerdown', initAudio);

    const loadedData = await loadAssets();
    context.config = loadedData.config;
    context.symbols = loadedData.symbols;
    
    createScene(app);

    context.speedManager = new SpeedManager();
    context.grid = new Grid(app, context.symbols);
    context.grid.speedManager = context.speedManager;
    context.grid.create();

    context.character = new Character(app);
    context.character.addToScene();

    // Bind all game functions to the context
    const boundStartSpin = game.startSpin.bind(context);
    const boundHandleAnteToggle = game.handleAnteToggle.bind(context);
    const boundHandleBuyBonus = game.handleBuyBonus.bind(context);
    const boundHandleAutoplay = game.handleAutoplay.bind(context);
    const boundIncreaseBet = game.increaseBet.bind(context);
    const boundDecreaseBet = game.decreaseBet.bind(context);
    const boundSetBet = game.setBet.bind(context);
    const boundHandleSettingsClick = game.handleSettingsClick.bind(context);

    context.freeSpinsManager = new FreeSpinsManager();
    context.bonusManager = new BonusManager();
    context.autoplayManager = new AutoplayManager(boundStartSpin, context.speedManager);

    context.ui = new UI(app, {
        spinCallback: boundStartSpin,
        increaseBetCallback: boundIncreaseBet,
        decreaseBetCallback: boundDecreaseBet,
        setBetCallback: boundSetBet,
        anteCallback: boundHandleAnteToggle,
        buyCallback: boundHandleBuyBonus,
        autoplayCallback: boundHandleAutoplay,
        settingsCallback: boundHandleSettingsClick
    });
    context.ui.create();
    context.ui.updateSidePanel(context.bonusManager.isAnteBetActive);
    context.ui.updateBalance(context.playerBalance);
    context.ui.updateBet(context.currentBet);
    context.ui.updateWin(0);
    
    window.addEventListener('resize', resize);
    resize();
}

function resize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = Math.min(screenWidth / app.screen.width, screenHeight / app.screen.height);
    app.view.style.width = `${app.screen.width * scale}px`;
    app.view.style.height = `${app.screen.height * scale}px`;
}