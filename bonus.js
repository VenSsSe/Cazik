// --- bonus.js ---

/**
 * Управляет логикой Ставки Анте и Покупки Бонуса.
 */
export class BonusManager {
    constructor() {
        this.isAnteBetActive = false;
    }

    /**
     * Переключает состояние Ставки Анте.
     */
    toggleAnteBet() {
        this.isAnteBetActive = !this.isAnteBetActive;
        console.log(`Ставка Анте ${this.isAnteBetActive ? 'АКТИВИРОВАНА' : 'ОТКЛЮЧЕНА'}`);
    }

    /**
     * Рассчитывает стоимость спина с учетом Ставки Анте.
     * @param {number} baseBet - Базовая ставка.
     * @returns {number} - Итоговая стоимость спина.
     */
    getSpinCost(baseBet) {
        return this.isAnteBetActive ? baseBet * 1.25 : baseBet;
    }

    /**
     * Рассчитывает стоимость покупки бонуса.
     * @param {number} baseBet - Базовая ставка.
     * @returns {number} - Стоимость покупки.
     */
    getBuyBonusCost(baseBet) {
        return baseBet * 100;
    }
}
