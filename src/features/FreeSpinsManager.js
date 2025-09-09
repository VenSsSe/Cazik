// --- freeSpins.js ---

/**
 * Управляет состоянием раунда бесплатных спинов.
 */
export class FreeSpinsManager {
    constructor() {
        this.isActive = false;
        this.spinsLeft = 0;
        this.totalMultiplier = 0;
    }

    /**
     * Запускает раунд бесплатных спинов.
     * @param {number} initialSpins - Начальное количество спинов.
     */
    start(initialSpins) {
        if (!this.isActive) {
            this.isActive = true;
            this.totalMultiplier = 0;
            this.spinsLeft = initialSpins;
            console.log(`--- ФРИСПИНЫ НАЧАЛИСЬ: ${this.spinsLeft} спинов ---`);
        }
    }

    /**
     * Завершает раунд.
     */
    end() {
        this.isActive = false;
        console.log(`--- РАУНД БЕСПЛАТНЫХ СПИНОВ ЗАВЕРШЕН ---`);
    }

    /**
     * Уменьшает количество оставшихся спинов.
     */
    useSpin() {
        if (this.isActive && this.spinsLeft > 0) {
            this.spinsLeft--;
        }
    }

    /**
     * Добавляет спины (для ретриггера).
     * @param {number} extraSpins - Количество дополнительных спинов.
     */
    addSpins(extraSpins) {
        if (this.isActive) {
            this.spinsLeft += extraSpins;
        }
    }

    /**
     * Добавляет значение множителя к общему множителю раунда.
     * @param {number} multiplierValue - Значение множителя с символа.
     */
    addMultiplier(multiplierValue) {
        if (this.isActive) {
            this.totalMultiplier += multiplierValue;
            console.log(`Общий множитель в FS: ${this.totalMultiplier}x`);
        }
    }
}