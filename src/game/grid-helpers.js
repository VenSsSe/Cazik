// src/game/grid-helpers.js

/**
 * Вспомогательная функция для плавной анимации спрайта к цели.
 * @param {PIXI.Container} sprite - Контейнер для анимации.
 * @param {number} targetY - Конечная Y позиция.
 * @param {number} duration - Длительность анимации в секундах.
 * @param {number} delay - Задержка перед началом анимации в миллисекундах.
 * @returns {Promise<void>}
 */
export function animateTo(sprite, targetY, duration = 0.5, delay = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            const startY = sprite.y;
            const change = targetY - startY;
            let elapsed = 0;

            const easeOutCubic = (t) => (--t) * t * t + 1;

            const tickerCallback = (ticker) => {
                elapsed += ticker.deltaMS / 1000;
                let progress = elapsed / duration;
                if (progress > 1) progress = 1;

                sprite.y = startY + change * easeOutCubic(progress);

                if (progress === 1) {
                    this.app.ticker.remove(tickerCallback);
                    resolve();
                }
            };
            this.app.ticker.add(tickerCallback);
        }, delay);
    });
}

/**
 * Выбирает случайный символ с учетом его веса (шанса выпадения).
 * @returns {object} - Данные о случайном символе из symbols.json.
 */
export function getRandomSymbol() {
    let randomWeight = Math.random() * this.totalWeight;
    for (const symbol of this.symbolsData) {
        randomWeight -= symbol.weight;
        if (randomWeight <= 0) {
            return symbol;
        }
    }
    return this.symbolsData[0];
}
