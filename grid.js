// --- grid.js ---
// Управляет созданием и заполнением сетки символов 6x5

// Константы для сетки
const REEL_COUNT = 6;
const ROW_COUNT = 5;
const SYMBOL_SIZE = 150; // Размер ячейки для символа

export class Grid {
    constructor(app, symbolsData) {
        this.app = app;
        this.symbolsData = symbolsData;
        this.reelsContainer = new PIXI.Container();
        this.gridData = []; // Логическая сетка (данные символов)
        this.gridSprites = []; // Визуальная сетка (спрайты символов)
        this.totalWeight = this.symbolsData.reduce((sum, symbol) => sum + symbol.weight, 0);
    }

    /**
     * Выбирает случайный символ с учетом его веса (шанса выпадения).
     * @returns {object} - Данные о случайном символе из symbols.json.
     */
    getRandomSymbol() {
        let randomWeight = Math.random() * this.totalWeight;
        for (const symbol of this.symbolsData) {
            randomWeight -= symbol.weight;
            if (randomWeight <= 0) {
                return symbol;
            }
        }
        return this.symbolsData[0];
    }

    /**
     * Создает и заполняет всю сетку символов.
     */
    create() {
        for (let i = 0; i < REEL_COUNT; i++) {
            const reelContainer = new PIXI.Container();
            reelContainer.x = i * SYMBOL_SIZE;
            this.reelsContainer.addChild(reelContainer);
            this.gridData[i] = [];
            this.gridSprites[i] = [];

            for (let j = 0; j < ROW_COUNT; j++) {
                const symbolData = this.getRandomSymbol();
                const symbolSprite = this.createSymbolSprite(symbolData, i, j);
                reelContainer.addChild(symbolSprite);
                
                this.gridData[i][j] = symbolData;
                this.gridSprites[i][j] = symbolSprite;
            }
        }

        // Позиционируем контейнер точно в центре фона барабанов
        this.reelsContainer.x = (this.app.screen.width - this.reelsContainer.width) / 2;
        this.reelsContainer.y = (this.app.screen.height - this.reelsContainer.height) / 2 - 50; // Смещаем вверх
        
        this.app.stage.addChild(this.reelsContainer);
        console.log("Сетка символов успешно создана!");
    }

    /**
     * Создает спрайт символа С РАМКОЙ.
     * @param {object} symbolData - Данные символа
     * @param {number} col - колонка
     * @param {number} row - ряд
     * @returns {PIXI.Container} - Контейнер, содержащий рамку и символ.
     */
    createSymbolSprite(symbolData, col, row) {
        const cellContainer = new PIXI.Container();
        let symbolSprite;

        // 1. Создаем рамку ячейки
        const frame = PIXI.Sprite.from('symbol_grid_frame');
        frame.width = SYMBOL_SIZE;
        frame.height = SYMBOL_SIZE;
        frame.anchor.set(0.5);
        cellContainer.addChild(frame);

        // 2. Создаем сам символ (обычный или анимированный множитель)
        if (symbolData.type === 'multiplier') {
            const frames = [];
            for (let i = 0; i < 20; i++) { 
                const texture = PIXI.Assets.get(`vfx_multiplier_orb_${i}`);
                if (texture) frames.push(texture);
            }
            symbolSprite = new PIXI.AnimatedSprite(frames);
            symbolSprite.animationSpeed = 0.4;
            symbolSprite.play();
            
            const randomIndex = Math.floor(Math.random() * symbolData.values.length);
            symbolSprite.multiplierValue = symbolData.values[randomIndex];
            
            const style = new PIXI.TextStyle({ fontSize: 40, fill: '#ffffff', fontWeight: 'bold', stroke: '#000000', strokeThickness: 4 });
            const valueText = new PIXI.Text(symbolSprite.multiplierValue + 'x', style);
            valueText.anchor.set(0.5);
            symbolSprite.addChild(valueText);

        } else {
            symbolSprite = PIXI.Sprite.from(symbolData.id);
        }

        symbolSprite.width = SYMBOL_SIZE * 0.9;
        symbolSprite.height = SYMBOL_SIZE * 0.9;
        symbolSprite.anchor.set(0.5);
        cellContainer.addChild(symbolSprite);

        // 3. Настраиваем контейнер
        cellContainer.x = SYMBOL_SIZE / 2;
        cellContainer.y = row * SYMBOL_SIZE + SYMBOL_SIZE / 2;
        cellContainer.gridPosition = { col, row };
        // Сохраняем ссылку на внутренний спрайт для доступа к multiplierValue
        cellContainer.symbolSprite = symbolSprite; 

        return cellContainer;
    }

    /**
     * Удаляет выигрышные символы с поля с анимацией взрыва.
     * @param {Array<PIXI.Container>} symbolsToRemove - Список контейнеров для удаления.
     * @returns {Promise<void>}
     */
    async removeSymbols(symbolsToRemove) {
        if (symbolsToRemove.length === 0) {
            return;
        }

        const explosionFrames = [];
        for (let i = 0; i < 15; i++) {
            const texture = PIXI.Assets.get(`vfx_symbol_explode_${i}`);
            if (texture) explosionFrames.push(texture);
        }

        const animationPromises = symbolsToRemove.map(cellContainer => {
            return new Promise(resolve => {
                const { col, row } = cellContainer.gridPosition;
                this.gridData[col][row] = null;
                this.gridSprites[col][row] = null;

                const explosion = new PIXI.AnimatedSprite(explosionFrames);
                explosion.anchor.set(0.5);
                explosion.scale.set(SYMBOL_SIZE / 192);
                explosion.x = cellContainer.x;
                explosion.y = cellContainer.y;
                explosion.loop = false;
                explosion.animationSpeed = 0.6;
                
                cellContainer.parent.addChild(explosion);
                cellContainer.destroy();

                explosion.onComplete = () => {
                    explosion.destroy();
                    resolve();
                };
                explosion.play();
            });
        });
        
        await Promise.all(animationPromises);
    }

    /**
     * Реализует механику "падения" символов вниз.
     * @returns {Promise<void>}
     */
    tumbleDown() {
        return new Promise(resolve => {
            let animations = [];

            for (let i = 0; i < REEL_COUNT; i++) {
                let emptySlots = 0;
                for (let j = ROW_COUNT - 1; j >= 0; j--) {
                    if (this.gridSprites[i][j] === null) {
                        emptySlots++;
                    } else if (emptySlots > 0) {
                        const sprite = this.gridSprites[i][j];
                        const data = this.gridData[i][j];
                        const newRow = j + emptySlots;

                        this.gridSprites[i][newRow] = sprite;
                        this.gridData[i][newRow] = data;
                        this.gridSprites[i][j] = null;
                        this.gridData[i][j] = null;

                        sprite.gridPosition.row = newRow;

                        const targetY = newRow * SYMBOL_SIZE + SYMBOL_SIZE / 2;
                        animations.push(this.animateTo(sprite, targetY, 0.4));
                    }
                }
            }

            if (animations.length === 0) {
                resolve();
                return;
            }

            Promise.all(animations).then(() => resolve());
        });
    }

    /**
     * Заполняет пустые места новыми символами сверху.
     * @returns {Promise<void>}
     */
    refillGrid() {
        return new Promise(resolve => {
            let animations = [];

            for (let i = 0; i < REEL_COUNT; i++) {
                let newSymbolsCount = 0;
                for (let j = ROW_COUNT - 1; j >= 0; j--) {
                    if (this.gridSprites[i][j] === null) {
                        newSymbolsCount++;
                        const symbolData = this.getRandomSymbol();
                        const sprite = this.createSymbolSprite(symbolData, i, j);
                        
                        sprite.y = -newSymbolsCount * SYMBOL_SIZE + SYMBOL_SIZE / 2;
                        
                        this.gridData[i][j] = symbolData;
                        this.gridSprites[i][j] = sprite;
                        
                        this.reelsContainer.children[i].addChild(sprite);

                        const targetY = j * SYMBOL_SIZE + SYMBOL_SIZE / 2;
                        animations.push(this.animateTo(sprite, targetY, 0.4));
                    }
                }
            }

            if (animations.length === 0) {
                resolve();
                return;
            }

            Promise.all(animations).then(() => resolve());
        });
    }

    /**
     * Вспомогательная функция для плавной анимации спрайта к цели.
     * @param {PIXI.Container} sprite - Контейнер для анимации.
     * @param {number} targetY - Конечная Y позиция.
     * @param {number} duration - Длительность анимации в секундах.
     * @param {number} delay - Задержка перед началом анимации в миллисекундах.
     * @returns {Promise<void>}
     */
    animateTo(sprite, targetY, duration = 0.5, delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                const startY = sprite.y;
                const change = targetY - startY;
                let elapsed = 0;

                const easeOutCubic = (t) => (--t) * t * t + 1;

                const tickerCallback = (ticker) => {
                    elapsed += ticker.deltaMS / 1000;
                    let progress = elapsed / duration;
                    if (progress > 1) progress = 1;

                    sprite.y = startY + change * easeOutCubic(progress);

                    if (progress === 1) {
                        this.app.ticker.remove(tickerCallback);
                        resolve();
                    }
                };
                this.app.ticker.add(tickerCallback);
            }, delay);
        });
    }
    
    getGridState() {
        return this.gridData;
    }

    getSymbolIds() {
        const ids = [];
        for (let i = 0; i < REEL_COUNT; i++) {
            ids[i] = [];
            for (let j = 0; j < ROW_COUNT; j++) {
                ids[i][j] = this.gridData[i][j] ? this.gridData[i][j].id : null;
            }
        }
        return ids;
    }

    async spin() {
        const REEL_FALL_DELAY = 60;
        const REEL_DROP_DELAY = 80;

        const fallOutAnimations = [];
        const allCurrentSprites = this.gridSprites.flat().filter(sprite => sprite !== null);

        for (const sprite of allCurrentSprites) {
            const col = sprite.gridPosition.col;
            const delay = (REEL_COUNT - 1 - col) * REEL_FALL_DELAY;
            const targetY = (ROW_COUNT * SYMBOL_SIZE) + SYMBOL_SIZE;
            fallOutAnimations.push(this.animateTo(sprite, targetY, 0.4, delay)); 
        }
        
        await Promise.all(fallOutAnimations);

        this.reelsContainer.children.forEach(reel => reel.removeChildren());
        this.gridData = [];
        this.gridSprites = [];

        const fallInAnimations = [];
        for (let i = 0; i < REEL_COUNT; i++) {
            this.gridData[i] = [];
            this.gridSprites[i] = [];
            for (let j = 0; j < ROW_COUNT; j++) {
                const symbolData = this.getRandomSymbol();
                const sprite = this.createSymbolSprite(symbolData, i, j);
                
                sprite.y = -(ROW_COUNT - j) * SYMBOL_SIZE;
                
                this.gridData[i][j] = symbolData;
                this.gridSprites[i][j] = sprite;
                
                this.reelsContainer.children[i].addChild(sprite);

                const targetY = j * SYMBOL_SIZE + SYMBOL_SIZE / 2;
                const delay = i * REEL_DROP_DELAY;
                fallInAnimations.push(this.animateTo(sprite, targetY, 0.5, delay));
            }
        }
        
        await Promise.all(fallInAnimations);
    }
}