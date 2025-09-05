// --- autoplay.js ---

/**
 * Управляет сессией автоигры.
 */
export class AutoplayManager {
    constructor(spinFunction) {
        this.spinFunction = spinFunction; // Функция, которая запускает спин
        this.spinsRemaining = 0;
    }

    /**
     * @returns {boolean} - Активна ли автоигра.
     */
    get isActive() {
        return this.spinsRemaining > 0;
    }

    /**
     * Начинает сессию автоигры.
     * @param {number} count - Количество спинов.
     */
    start(count) {
        if (!this.isActive) {
            this.spinsRemaining = count;
            console.log(`--- АВТОИГРА ЗАПУЩЕНА на ${count} спинов ---`);
            this.continue();
        }
    }

    /**
     * Останавливает автоигру.
     */
    stop() {
        console.log("--- АВТОИГРА ОСТАНОВЛЕНА ---");
        this.spinsRemaining = 0;
    }

    /**
     * Продолжает автоигру, если остались спины.
     * Вызывается после завершения каждого спина.
     */
    continue() {
        if (this.isActive) {
            this.spinsRemaining--;
            // Увеличим задержку для наглядности
            setTimeout(() => this.spinFunction(), 1500); // Увеличиваем задержку до 1.5 секунд
        }
    }
}