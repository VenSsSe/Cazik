import { loadAssets } from './loader.js';
import { createScene } from './scene.js';
import { Grid } from './grid.js';
import { checkForWins, calculatePayout } from './gameLogic.js';
import { UI } from './ui.js';

const app = new PIXI.Application();

// --- Глобальное состояние игры ---
let config;
let symbols;
let grid;
let ui;
let isSpinning = false;
let playerBalance = 1000; // Начальный баланс
let currentBet = 10; // Начальная ставка

async function init() {
    await app.init({
        width: 1920,
        height: 1080,
        backgroundColor: 0x1099bb,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });
    document.body.appendChild(app.view);

    const loadedData = await loadAssets();
    config = loadedData.config;
    symbols = loadedData.symbols;
    
    createScene(app);

    grid = new Grid(app, symbols);
    grid.create(); // Создаем начальную сетку

    // Создаем и настраиваем UI
    ui = new UI(app, startSpin);
    ui.create();
    ui.updateBalance(playerBalance);
    ui.updateBet(currentBet);
    ui.updateWin(0);

    window.addEventListener('resize', resize);
    resize();
    console.log("Игра готова. Нажмите кнопку Spin.");
}

/**
 * Главная функция, управляющая циклом спина и падений.
 */
async function startSpin() {
    if (isSpinning) return; // Не позволяем запускать новый спин, пока текущий не закончен
    isSpinning = true;

    playerBalance -= currentBet;
    ui.updateBalance(playerBalance);
    ui.updateWin(0);
    console.log("--- Новый спин --- Ставка:", currentBet);

    let currentSpinTotalWin = 0;

    // 1. Запускаем новый спин и ждем анимации
    await grid.spin();

    // 2. Запускаем цикл падений (Tumble Loop)
    while (true) {
        const gridSymbolIds = grid.getSymbolIds();
        const wins = checkForWins(gridSymbolIds);

        if (wins.length === 0) {
            // Выигрышей нет, выходим из цикла
            console.log("Выигрышей в этом каскаде нет.");
            break;
        }

        console.log("Найдены выигрыши:", wins);

        // Рассчитываем и начисляем выигрыш за каскад
        const payout = calculatePayout(wins, currentBet, symbols);
        currentSpinTotalWin += payout;
        ui.updateWin(currentSpinTotalWin);
        console.log(`Выигрыш за каскад: ${payout.toFixed(2)}. Общий выигрыш за спин: ${currentSpinTotalWin.toFixed(2)}`);

        // Собираем все спрайты, которые нужно удалить, используя позиции из wins
        let spritesToRemove = [];
        for (const win of wins) {
            for (const pos of win.positions) {
                const sprite = grid.gridSprites[pos.col][pos.row];
                if (sprite) {
                    spritesToRemove.push(sprite);
                }
            }
        }
        spritesToRemove = [...new Set(spritesToRemove)]; // Убираем дубликаты

        // 3. Анимация удаления символов
        await grid.removeSymbols(spritesToRemove);

        // 4. Анимация падения существующих символов
        await grid.tumbleDown();

        // 5. Анимация заполнения новыми символами
        await grid.refillGrid();
        
        console.log("Сетка обновлена, проверка на новые выигрыши...");
    }

    // 6. Завершение спина
    playerBalance += currentSpinTotalWin;
    ui.updateBalance(playerBalance);
    console.log(`--- Спин завершен --- Общий выигрыш: ${currentSpinTotalWin.toFixed(2)}`);
    console.log(`Итоговый баланс: ${playerBalance.toFixed(2)}`);

    isSpinning = false;
}

function resize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scale = Math.min(screenWidth / app.screen.width, screenHeight / app.screen.height);
    app.view.style.width = `${app.screen.width * scale}px`;
    app.view.style.height = `${app.screen.height * scale}px`;
}

// Запускаем игру
init();
