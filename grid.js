// --- grid.js ---
// Управляет созданием и заполнением сетки символов 6x5

// Константы для сетки
const REEL_COUNT = 6;
const ROW_COUNT = 5;
const SYMBOL_SIZE = 150; // Размер ячейки для символа
const ANIMATION_SPEED = 0.5; // Скорость анимации падения

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

        this.reelsContainer.x = (this.app.screen.width - this.reelsContainer.width) / 2;
        this.reelsContainer.y = (this.app.screen.height - this.reelsContainer.height) / 2;
        
        this.app.stage.addChild(this.reelsContainer);
        console.log("Сетка символов успешно создана!");
    }

    /**
     * Создает спрайт символа
     * @param {object} symbolData - Данные символа
     * @param {number} col - колонка
     * @param {number} row - ряд
     * @returns {PIXI.Sprite}
     */
    createSymbolSprite(symbolData, col, row) {
        const symbolSprite = PIXI.Sprite.from(symbolData.id);
        symbolSprite.width = SYMBOL_SIZE * 0.9;
        symbolSprite.height = SYMBOL_SIZE * 0.9;
        symbolSprite.anchor.set(0.5);
        symbolSprite.x = SYMBOL_SIZE / 2;
        symbolSprite.y = row * SYMBOL_SIZE + SYMBOL_SIZE / 2;
        // Сохраняем позицию в сетке для легкого доступа
        symbolSprite.gridPosition = { col, row };
        return symbolSprite;
    }

    /**
     * Удаляет выигрышные символы с поля.
     * @param {Array<PIXI.Sprite>} symbolsToRemove - Список спрайтов для удаления.
     * @returns {Promise<void>}
     */
    removeSymbols(symbolsToRemove) {
        return new Promise(resolve => {
            if (symbolsToRemove.length === 0) {
                resolve();
                return;
            }

            let explosionsPending = symbolsToRemove.length;

            symbolsToRemove.forEach(symbolSprite => {
                // Помечаем ячейку как пустую
                const { col, row } = symbolSprite.gridPosition;
                this.gridData[col][row] = null;
                this.gridSprites[col][row] = null;

                // Создаем анимацию взрыва
                const explosionTextures = [];
                for (let i = 0; i < 30; i++) { // Предполагаем, что у нас есть кадры для анимации
                     explosionTextures.push(PIXI.Texture.from(`vfx_symbol_explode_${i}.png`)); // Это нужно будет адаптировать к вашему спрайт-листу
                }
                // Fallback if spritesheet is not ready
                if(explosionTextures.length === 0) {
                    explosionTextures.push(PIXI.Texture.from('vfx_symbol_explode.png'));
                }

                const explosion = new PIXI.AnimatedSprite(explosionTextures);
                explosion.anchor.set(0.5);
                explosion.x = symbolSprite.x;
                explosion.y = symbolSprite.y;
                explosion.loop = false;
                explosion.animationSpeed = 0.6;
                
                symbolSprite.parent.addChild(explosion);

                explosion.onComplete = () => {
                    explosion.destroy();
                    explosionsPending--;
                    if (explosionsPending === 0) {
                        resolve();
                    }
                };

                explosion.play();
                symbolSprite.destroy();
            });
        });
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

                        // Обновляем логическую и визуальную сетки
                        this.gridSprites[i][newRow] = sprite;
                        this.gridData[i][newRow] = data;
                        this.gridSprites[i][j] = null;
                        this.gridData[i][j] = null;

                        // Обновляем позицию в спрайте
                        sprite.gridPosition.row = newRow;

                        // Анимация падения
                        const targetY = newRow * SYMBOL_SIZE + SYMBOL_SIZE / 2;
                        animations.push(this.animateTo(sprite, targetY));
                    }
                }
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
                for (let j = 0; j < ROW_COUNT; j++) {
                    if (this.gridSprites[i][j] === null) {
                        const symbolData = this.getRandomSymbol();
                        const sprite = this.createSymbolSprite(symbolData, i, j);
                        
                        // Начальная позиция над экраном
                        sprite.y = -SYMBOL_SIZE; 
                        
                        this.gridData[i][j] = symbolData;
                        this.gridSprites[i][j] = sprite;
                        
                        this.reelsContainer.children[i].addChild(sprite);

                        const targetY = j * SYMBOL_SIZE + SYMBOL_SIZE / 2;
                        animations.push(this.animateTo(sprite, targetY));
                    }
                }
            }

            Promise.all(animations).then(() => resolve());
        });
    }

    /**
     * Вспомогательная функция для анимации спрайта к цели.
     * @param {PIXI.Sprite} sprite - Спрайт для анимации.
     * @param {number} targetY - Конечная Y позиция.
     * @returns {Promise<void>}
     */
    animateTo(sprite, targetY) {
        return new Promise(resolve => {
            const ticker = (delta) => {
                const distance = targetY - sprite.y;
                if (Math.abs(distance) < 5) {
                    sprite.y = targetY;
                    this.app.ticker.remove(ticker);
                    resolve();
                } else {
                    sprite.y += distance * ANIMATION_SPEED * delta;
                }
            };
            this.app.ticker.add(ticker);
        });
    }
    
    /**
     * Возвращает текущее логическое состояние сетки.
     * @returns {Array<Array<object>>}
     */
    getGridState() {
        return this.gridData;
    }

    /**
     * Находит все спрайты определенного символа на сетке.
     * @param {string} symbolId - ID символа для поиска.
     * @returns {Array<PIXI.Sprite>}
     */
    findSymbolSprites(symbolId) {
        const sprites = [];
        for (let i = 0; i < REEL_COUNT; i++) {
            for (let j = 0; j < ROW_COUNT; j++) {
                if (this.gridData[i][j] && this.gridData[i][j].id === symbolId) {
                    sprites.push(this.gridSprites[i][j]);
                }
            }
        }
        return sprites;
    }

    /**
     * Запускает новый спин: очищает сетку и анимированно сбрасывает новые символы.
     * @returns {Promise<void>}
     */
    spin() {
        return new Promise(resolve => {
            // 1. Очищаем контейнеры и данные
            this.reelsContainer.children.forEach(reel => reel.removeChildren());
            this.gridData = [];
            this.gridSprites = [];

            let animations = [];

            // 2. Создаем новые символы и анимируем их падение
            for (let i = 0; i < REEL_COUNT; i++) {
                this.gridData[i] = [];
                this.gridSprites[i] = [];
                for (let j = 0; j < ROW_COUNT; j++) {
                    const symbolData = this.getRandomSymbol();
                    const sprite = this.createSymbolSprite(symbolData, i, j);
                    
                    // Начальная позиция над экраном
                    sprite.y = -(ROW_COUNT - j) * SYMBOL_SIZE;
                    
                    this.gridData[i][j] = symbolData;
                    this.gridSprites[i][j] = sprite;
                    
                    this.reelsContainer.children[i].addChild(sprite);

                    const targetY = j * SYMBOL_SIZE + SYMBOL_SIZE / 2;
                    animations.push(this.animateTo(sprite, targetY));
                }
            }

            Promise.all(animations).then(() => resolve());
        });
    }
}
