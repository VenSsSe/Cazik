// --- character.js ---

/**
 * Управляет анимированным персонажем.
 */
export class Character {
    constructor(app) {
        this.app = app;
        this.baseFrames = [];
        this.powerFrames = [];
        this.sprite = null;

        // Собираем текстуры из загруженных ассетов
        for (let i = 0; i < 12; i++) {
            this.baseFrames.push(PIXI.Texture.from(`char_cat_base_${i}`));
            this.powerFrames.push(PIXI.Texture.from(`char_cat_power_${i}`));
        }
    }

    /**
     * Создает и добавляет анимированный спрайт на сцену.
     */
    addToScene() {
        this.sprite = new PIXI.AnimatedSprite(this.baseFrames);
        
        this.sprite.animationSpeed = 0.125; // Можно подобрать скорость
        this.sprite.play();
        this.sprite.anchor.set(0.5);
        this.sprite.scale.set(3.5); // Увеличиваем кота
        
        this.sprite.x = this.app.screen.width - 200;
        this.sprite.y = this.app.screen.height / 2 + 150;
        
        this.app.stage.addChild(this.sprite);
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
