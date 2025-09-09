// --- grid.js (Финальная версия с правильным позиционированием) ---
import * as animations from './GridAnimations.js';
import * as helpers from './GridHelpers.js';

// --- НОВЫЕ КОНСТАНТЫ ---
// Мы немного уменьшаем размер символов, чтобы вся сетка красиво поместилась в рамку с отступами.
const REEL_COUNT = 6;
const ROW_COUNT = 5;
const SYMBOL_SIZE = 150; // Уменьшенный размер ячейки для символа

export class Grid {
    constructor(app, symbolsData) {
        this.app = app;
        this.symbolsData = symbolsData;
        this.reelsContainer = new PIXI.Container();
        this.gridData = [];
        this.gridSprites = [];
        this.totalWeight = this.symbolsData.reduce((sum, symbol) => sum + symbol.weight, 0);

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

        // --- НОВАЯ ЛОГИКА ПОЗИЦИОНИРОВАНИЯ ---
        // Эти координаты точно совпадают с центром рамки из `scene.js`
        const targetCenterX = this.app.screen.width / 2;
        const targetCenterY = this.app.screen.height / 2 - 30;

        // Центрируем контейнер с барабанами
        this.reelsContainer.x = targetCenterX - this.reelsContainer.width / 2;
        this.reelsContainer.y = targetCenterY - this.reelsContainer.height / 2;
        
        // Маска для обрезки символов, чтобы они не вылезали за пределы поля при анимации
        const mask = new PIXI.Graphics();
        mask.beginFill(0xFFFFFF);
        mask.drawRect(this.reelsContainer.x, this.reelsContainer.y, this.reelsContainer.width, this.reelsContainer.height);
        mask.endFill();
        this.reelsContainer.mask = mask;
        this.app.stage.addChild(mask);

        this.app.stage.addChild(this.reelsContainer);
        console.log("Сетка символов успешно создана и спозиционирована внутри рамки!");
    }

    /**
     * Создает спрайт символа с рамкой.
     */
    createSymbolSprite(symbolData, col, row) {
        const cellContainer = new PIXI.Container();
        let symbolSprite;

        // Рамка для каждой ячейки
        const frame = PIXI.Sprite.from('symbol_grid_frame'); // Используем гранжевую рамку
        frame.width = SYMBOL_SIZE;
        frame.height = SYMBOL_SIZE;
        frame.anchor.set(0.5);
        frame.alpha = 0.5; // Делаем ее полупрозрачной
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

        // Уменьшаем сам символ, чтобы он красиво вписывался в рамку
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
Object.assign(Grid.prototype, animations);
Object.assign(Grid.prototype, helpers);
