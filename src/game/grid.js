// --- grid.js (Refactored) ---
import * as animations from './grid-animations.js';
import * as helpers from './grid-helpers.js';

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

        // Привязываем константы к экземпляру для доступа из внешних функций
        this.REEL_COUNT = REEL_COUNT;
        this.ROW_COUNT = ROW_COUNT;
        this.SYMBOL_SIZE = SYMBOL_SIZE;
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
        
        const mask = new PIXI.Graphics();
        mask.beginFill(0xFFFFFF);
        mask.drawRect(this.reelsContainer.x, this.reelsContainer.y, this.reelsContainer.width, this.reelsContainer.height);
        mask.endFill();
        this.reelsContainer.mask = mask;
        this.app.stage.addChild(mask);

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

                const frame = PIXI.Sprite.from('symbol_grid_frame_white');
        frame.width = SYMBOL_SIZE;
        frame.height = SYMBOL_SIZE;
        frame.anchor.set(0.5);
        cellContainer.addChild(frame);

        if (symbolData.type === 'multiplier') {
            const frames = [];
            for (let i = 0; i < 20; i++) { 
                const texture = PIXI.Assets.get(`vfx_multiplier_orb_${i}`);
                if (texture) frames.push(texture);
            }
            symbolSprite = new PIXI.AnimatedSprite(frames);
            symbolSprite.animationSpeed = 0.2;
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

        cellContainer.x = SYMBOL_SIZE / 2;
        cellContainer.y = row * SYMBOL_SIZE + SYMBOL_SIZE / 2;
        cellContainer.gridPosition = { col, row };
        cellContainer.symbolSprite = symbolSprite; 

        return cellContainer;
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
}

// Присваиваем импортированные функции прототипу класса Grid
// Это позволяет им вызываться как методы экземпляра (this.spin(), this.animateTo(), и т.д.)
Object.assign(Grid.prototype, animations);
Object.assign(Grid.prototype, helpers);