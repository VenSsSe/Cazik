import { loadAssets } from './loader.js';
import { createScene } from './scene.js';
import { Grid } from './grid.js';
import { checkForWins, calculatePayout } from './gameLogic.js';

const app = new PIXI.Application();

// --- Глобальное состояние игры ---
let config;
let symbols;
let grid;
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

    // Временный запуск спина по клику
    app.view.interactive = true;
    app.view.on('pointerdown', startSpin);

    window.addEventListener('resize', resize);
    resize();
    console.log("Игра готова. Кликните, чтобы начать спин.");
}

/**
 * Главная функция, управляющая циклом спина и падений.
 */
async function startSpin() {
    if (isSpinning) return; // Не позволяем запускать новый спин, пока текущий не закончен
    isSpinning = true;

    console.log("--- Новый спин --- Ставка:", currentBet);
    playerBalance -= currentBet;
    // TODO: Обновить UI баланса

    let currentSpinTotalWin = 0;

    // 1. Запускаем новый спин и ждем анимации
    await grid.spin();

    // 2. Запускаем цикл падений (Tumble Loop)
    while (true) {
        const gridState = grid.getGridState();
        const wins = checkForWins(gridState);

        if (wins.length === 0) {
            // Выигрышей нет, выходим из цикла
            console.log("Выигрышей в этом каскаде нет.");
            break;
        }

        console.log("Найдены выигрыши:", wins);

        // Рассчитываем и начисляем выигрыш за каскад
        const payout = calculatePayout(wins, currentBet, symbols);
        currentSpinTotalWin += payout;
        console.log(`Выигрыш за каскад: ${payout.toFixed(2)}. Общий выигрыш за спин: ${currentSpinTotalWin.toFixed(2)}`);
        // TODO: Обновить UI выигрыша

        // Собираем все спрайты, которые нужно удалить
        let spritesToRemove = [];
        for (const win of wins) {
            // Scatter символы не удаляются стандартным образом, если только это не часть логики
            if (win.id !== 'scatter') { 
                spritesToRemove.push(...grid.findSymbolSprites(win.id));
            }
        }
        // Убираем дубликаты, если символ участвует в нескольких комбинациях (маловероятно с текущей логикой)
        spritesToRemove = [...new Set(spritesToRemove)];

        // 3. Анимация удаления символов
        await grid.removeSymbols(spritesToRemove);

        // 4. Анимация падения существующих символов
        await grid.tumbleDown();

        // 5. Анимация заполнения новыми символами
        await grid.refillGrid();
        
        console.log("Сетка обновлена, проверка на новые выигрыши...");
    }

    // 6. Завершение спина
    console.log(`--- Спин завершен --- Общий выигрыш: ${currentSpinTotalWin.toFixed(2)}`);
    playerBalance += currentSpinTotalWin;
    console.log(`Итоговый баланс: ${playerBalance.toFixed(2)}`);
    // TODO: Обновить UI баланса

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
