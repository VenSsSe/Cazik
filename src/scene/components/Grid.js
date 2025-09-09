import * as animations from './GridAnimations.js';
import * as helpers from './GridHelpers.js';

const REEL_COUNT = 6;
const ROW_COUNT = 5;
const SYMBOL_SIZE = 150;

export class Grid {
    constructor(context) {
        this.context = context;
        this.app = context.app;
        this.symbolsData = context.symbols;
        
        this.reelsContainer = new PIXI.Container();
        this.gridData = [];
        this.gridSprites = [];
        this.totalWeight = this.symbolsData.reduce((sum, symbol) => sum + symbol.weight, 0);

        this.REEL_COUNT = REEL_COUNT;
        this.ROW_COUNT = ROW_COUNT;
        this.SYMBOL_SIZE = SYMBOL_SIZE;
    }

    create() {
        for (let i = 0; i < REEL_COUNT; i++) {
            const reelContainer = new PIXI.Container();
            reelContainer.x = (i - (REEL_COUNT - 1) / 2) * SYMBOL_SIZE;
            this.reelsContainer.addChild(reelContainer);
            this.gridData[i] = [];
            this.gridSprites[i] = [];

            for (let j = 0; j < ROW_COUNT; j++) {
                const symbolData = this.getRandomSymbol();
                const symbolSprite = this.createSymbolSprite(symbolData, i, j);
                symbolSprite.y = (j - (ROW_COUNT - 1) / 2) * SYMBOL_SIZE;
                reelContainer.addChild(symbolSprite);
                
                this.gridData[i][j] = symbolData;
                this.gridSprites[i][j] = symbolSprite;
            }
        }

        const mask = new PIXI.Graphics();
        mask.beginFill(0xFFFFFF);
        const width = this.reelsContainer.width;
        const height = this.reelsContainer.height;
        mask.drawRect(-width / 2, -height / 2, width, height);
        mask.endFill();
        this.reelsContainer.mask = mask;
        this.reelsContainer.addChild(mask);

        // Возвращаем контейнер барабанов, чтобы StageManager мог его позиционировать
        return this.reelsContainer;
    }

    createSymbolSprite(symbolData, col, row) {
        const cellContainer = new PIXI.Container();
        let symbolSprite;

        const frame = PIXI.Sprite.from('symbol_grid_frame');
        frame.width = SYMBOL_SIZE;
        frame.height = SYMBOL_SIZE;
        frame.anchor.set(0.5);
        frame.alpha = 0.5;
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

Object.assign(Grid.prototype, animations);
Object.assign(Grid.prototype, helpers);