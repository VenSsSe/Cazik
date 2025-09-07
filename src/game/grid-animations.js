// src/game/grid-animations.js

/**
 * Анимация и удаление выигрышных символов.
 * @param {Array<PIXI.Container>} symbolsToRemove - Список контейнеров для удаления.
 * @returns {Promise<void>}
 */
export async function removeSymbols(symbolsToRemove) {
    if (symbolsToRemove.length === 0) {
        return;
    }

    const animationPromises = symbolsToRemove.map(cellContainer => {
        return new Promise(resolve => {
            const symbolSprite = cellContainer.symbolSprite;
            const frameSprite = cellContainer.children[0];
            const originalScaleX = cellContainer.scale.x;
            const originalScaleY = cellContainer.scale.y;

            const scaleTo = (target, toX, toY, duration, onComplete) => {
                const startX = target.scale.x;
                const startY = target.scale.y;
                const changeX = toX - startX;
                const changeY = toY - startY;
                const startTime = performance.now();

                function animate(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    target.scale.x = startX + changeX * progress;
                    target.scale.y = startY + changeY * progress;
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        if (onComplete) onComplete();
                    }
                }
                requestAnimationFrame(animate);
            };

            const fadeOut = (target, duration, onComplete) => {
                const startAlpha = target.alpha;
                const change = 0 - startAlpha;
                const startTime = performance.now();

                function animate(currentTime) {
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    target.alpha = startAlpha + change * progress;
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        if (onComplete) onComplete();
                    }
                }
                requestAnimationFrame(animate);
            };

            // Step 1: Scale Up
            scaleTo(cellContainer, originalScaleX * 1.1, originalScaleY * 1.1, 200, () => {
                // Step 2: Flip (Phase 1)
                scaleTo(cellContainer, 0, originalScaleY * 1.1, 150, () => {
                    // Step 3: Transformation
                    const symbolData = this.gridData[cellContainer.gridPosition.col][cellContainer.gridPosition.row];
                    if (symbolData && symbolData.id) {
                        const animatedTextureId = `${symbolData.id}-animated`;
                        try {
                            const animatedTexture = PIXI.Assets.get(animatedTextureId);
                            if (animatedTexture) {
                                symbolSprite.texture = animatedTexture;
                            }
                        } catch (err) {
                            console.warn(`Could not find animated texture: ${animatedTextureId}`);
                        }
                    }
                    try {
                        frameSprite.texture = PIXI.Assets.get('symbol_grid_frame_black');
                    } catch(err) {
                        console.warn(`Could not find texture: symbol_grid_frame_black`);
                    }


                    // Step 4: Flip (Phase 2)
                    scaleTo(cellContainer, originalScaleX * 1.1, originalScaleY * 1.1, 150, () => {
                        // Step 5: Pause
                        setTimeout(() => {
                            // Step 6: Fade Out
                            fadeOut(cellContainer, 300, () => {
                                const { col, row } = cellContainer.gridPosition;
                                this.gridData[col][row] = null;
                                this.gridSprites[col][row] = null;
                                cellContainer.destroy();
                                resolve();
                            });
                        }, 500); // 0.5s pause
                    });
                });
            });
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