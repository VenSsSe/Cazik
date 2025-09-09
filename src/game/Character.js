// --- character.js ---

/**
 * Управляет анимированным персонажем.
 */
export class Character {
    constructor(context) {
        this.context = context;
        this.app = context.app;
        this.baseFrames = [];
        this.powerFrames = [];
        this.sprite = null;

        for (let i = 0; i < 12; i++) {
            this.baseFrames.push(PIXI.Texture.from(`char_cat_base_${i}`));
            this.powerFrames.push(PIXI.Texture.from(`char_cat_power_${i}`));
        }
    }

    /**
     * Создает и возвращает анимированный спрайт.
     */
    create() {
        this.sprite = new PIXI.AnimatedSprite(this.baseFrames);
        
        this.sprite.animationSpeed = 0.125;
        this.sprite.play();
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(3.5);
        
        // Позиция будет устанавливаться в StageManager
        return this.sprite;
    }

    /**
     * Переключает анимацию кота.
     * @param {boolean} isActive - Включить "магический" режим?
     */
    setPowerState(isActive) {
        if (!this.sprite) return;
        
        this.sprite.textures = isActive ? this.powerFrames : this.baseFrames;
        this.sprite.play();
    }
}