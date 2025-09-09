/**
 * Создает контейнер со всеми статичными элементами игровой сцены (рамка, фоны барабанов).
 * Позиционирование этих элементов происходит относительно центра контейнера.
 * @param {PIXI.Application} app - Экземпляр приложения PIXI для доступа к ресурсам.
 * @returns {PIXI.Container} - Контейнер со всеми элементами игровой сцены.
 */
export function createScene(app) {
    const gameSceneContainer = new PIXI.Container(); // Этот контейнер будет центрирован StageManager'ом

    // Настройки размеров и отступов
    const FRAME_CONFIG = { scaleX: 1.05, scaleY: 1.1, baseYOffset: -30 }; // baseYOffset для рамки
    const GRID_CONFIG = { reels: 6, rows: 5, symbolSize: 150 };

    // --- Игровая зона (центр сцены) ---
    // Все элементы внутри gameSceneContainer будут позиционироваться относительно его центра (0,0)

    // Фоны для барабанов
    const totalGridWidth = GRID_CONFIG.reels * GRID_CONFIG.symbolSize;
    const gridHeight = GRID_CONFIG.rows * GRID_CONFIG.symbolSize;
    const reelColumnWidth = GRID_CONFIG.symbolSize;

    for (let i = 0; i < GRID_CONFIG.reels; i++) {
        const reelBackground = PIXI.Sprite.from('reels_background');
        reelBackground.anchor.set(0.5);
        reelBackground.width = reelColumnWidth;
        reelBackground.height = gridHeight;
        // Позиционируем относительно центра gameSceneContainer
        reelBackground.x = (i - (GRID_CONFIG.reels - 1) / 2) * reelColumnWidth;
        reelBackground.y = FRAME_CONFIG.baseYOffset; // Центрируем по Y относительно рамки
        gameSceneContainer.addChild(reelBackground);
    }

    // Главная рамка
    const mainGameFrame = PIXI.Sprite.from('symbol_frame');
    mainGameFrame.anchor.set(0.5);
    mainGameFrame.scale.set(FRAME_CONFIG.scaleX, FRAME_CONFIG.scaleY);
    mainGameFrame.y = FRAME_CONFIG.baseYOffset; // Центрируем по Y относительно рамки
    gameSceneContainer.addChild(mainGameFrame);

    // Возвращаем главный контейнер, чтобы StageManager мог его позиционировать
    return gameSceneContainer;
}