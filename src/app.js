import { loadAssets } from './core/AssetLoader.js';
import { StageManager } from './core/StageManager.js';
import { FreeSpinsManager } from './features/FreeSpinsManager.js';
import { BonusManager } from './features/BonusManager.js';
import { AutoplayManager } from './features/AutoplayManager.js';
import { AudioManager } from './core/AudioManager.js';
import { SpeedManager } from './game/SpeedManager.js';
import * as game from './game/index.js';
import { fadeInGameContainer } from './ui/UIManager.js';
import { UI } from './ui/index.js'; // Import the UI class

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
    betSettings: {
        BET_MULTIPLIER: 20,
        betLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        coinValues: [0.01, 0.02, 0.05, 0.10, 0.25, 0.50, 1.00, 2.00, 5.00, 10.00, 12.50],
        betLevelIndex: 0,
        coinValueIndex: 4,
    },
    getBetConfiguration: function() {
        const level = this.betSettings.betLevels[this.betSettings.betLevelIndex];
        const value = this.betSettings.coinValues[this.betSettings.coinValueIndex];
        return {
            level,
            value,
            totalBet: this.betSettings.BET_MULTIPLIER * level * value
        }
    },
    callbacks: {},
};

export async function init() {
    await app.init({
        width: 1920,
        height: 1080,
        backgroundAlpha: 0, // Фон прозрачный
    });
    document.getElementById('game-container').appendChild(app.view);

    // --- 1. Загрузка базовых систем и ассетов ---
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
    
    // --- 2. Инициализация игровой логики и фич ---
    context.speedManager = new SpeedManager();
    context.freeSpinsManager = new FreeSpinsManager();
    context.bonusManager = new BonusManager();

    // Привязываем функции из game.js к контексту и сохраняем их
    context.callbacks = {
        startSpin: game.startSpin.bind(context),
        handleAnteToggle: game.handleAnteToggle.bind(context),
        handleBuyBonus: game.handleBuyBonus.bind(context),
        handleAutoplay: game.handleAutoplay.bind(context),
        handleSettingsClick: game.handleSettingsClick.bind(context),
        setBetConfiguration: game.setBetConfiguration.bind(context),
        cycleTotalBet: game.cycleTotalBet.bind(context),
    };
    
    context.autoplayManager = new AutoplayManager(context.callbacks.startSpin, context.speedManager);

    // --- 3. Создание и отображение всей сцены через StageManager ---
    const stageManager = new StageManager(context);
    stageManager.buildScene();
    
    // --- 4. Настройка ресайза ---
    window.addEventListener('resize', resize);
    resize();

    // --- 5. Плавное появление игрового интерфейса ---
    fadeInGameContainer();

    // --- УДАЛЕНО: Лишнее создание UI было здесь ---
}

function resize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = Math.min(screenWidth / app.screen.width, screenHeight / app.screen.height);
    app.view.style.width = `${app.screen.width * scale}px`;
    app.view.style.height = `${app.screen.height * scale}px`;
}
