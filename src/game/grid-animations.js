// src/game/grid-animations.js

/**
 * Удаляет выигрышные символы с поля с анимацией взрыва.
 * @param {Array<PIXI.Container>} symbolsToRemove - Список контейнеров для удаления.
 * @returns {Promise<void>}
 */
export async function removeSymbols(symbolsToRemove) {
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
            explosion.scale.set(this.SYMBOL_SIZE / 192);
            explosion.x = cellContainer.x;
            explosion.y = cellContainer.y;
            explosion.loop = false;
            explosion.animationSpeed = 0.3;
            
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
export function tumbleDown() {
    return new Promise(resolve => {
        let animations = [];

        for (let i = 0; i < this.REEL_COUNT; i++) {
            let emptySlots = 0;
            for (let j = this.ROW_COUNT - 1; j >= 0; j--) {
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

                    const targetY = newRow * this.SYMBOL_SIZE + this.SYMBOL_SIZE / 2;
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
export function refillGrid() {
    return new Promise(resolve => {
        let animations = [];

        for (let i = 0; i < this.REEL_COUNT; i++) {
            let newSymbolsCount = 0;
            for (let j = this.ROW_COUNT - 1; j >= 0; j--) {
                if (this.gridSprites[i][j] === null) {
                    newSymbolsCount++;
                    const symbolData = this.getRandomSymbol();
                    const sprite = this.createSymbolSprite(symbolData, i, j);
                    
                    sprite.y = -newSymbolsCount * this.SYMBOL_SIZE + this.SYMBOL_SIZE / 2;
                    
                    this.gridData[i][j] = symbolData;
                    this.gridSprites[i][j] = sprite;
                    
                    this.reelsContainer.children[i].addChild(sprite);

                    const targetY = j * this.SYMBOL_SIZE + this.SYMBOL_SIZE / 2;
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
 * Основная анимация вращения барабанов.
 */
export async function spin() {
    const REEL_FALL_DELAY = 60;
    const REEL_DROP_DELAY = 80;

    const fallOutAnimations = [];
    const allCurrentSprites = this.gridSprites.flat().filter(sprite => sprite !== null);

    for (const sprite of allCurrentSprites) {
        const col = sprite.gridPosition.col;
        const delay = (this.REEL_COUNT - 1 - col) * REEL_FALL_DELAY;
        const targetY = (this.ROW_COUNT * this.SYMBOL_SIZE) + this.SYMBOL_SIZE;
        fallOutAnimations.push(this.animateTo(sprite, targetY, 0.4, delay)); 
    }
    
    await Promise.all(fallOutAnimations);

    this.reelsContainer.children.forEach(reel => reel.removeChildren());
    this.gridData = [];
    this.gridSprites = [];

    const fallInAnimations = [];
    for (let i = 0; i < this.REEL_COUNT; i++) {
        this.gridData[i] = [];
        this.gridSprites[i] = [];
        for (let j = 0; j < this.ROW_COUNT; j++) {
            const symbolData = this.getRandomSymbol();
            const sprite = this.createSymbolSprite(symbolData, i, j);
            
            sprite.y = -(this.ROW_COUNT - j) * this.SYMBOL_SIZE;
            
            this.gridData[i][j] = symbolData;
            this.gridSprites[i][j] = sprite;
            
            this.reelsContainer.children[i].addChild(sprite);

            const targetY = j * this.SYMBOL_SIZE + this.SYMBOL_SIZE / 2;
            const delay = i * REEL_DROP_DELAY;
            fallInAnimations.push(this.animateTo(sprite, targetY, 0.5, delay));
        }
    }
    
    await Promise.all(fallInAnimations);
}
