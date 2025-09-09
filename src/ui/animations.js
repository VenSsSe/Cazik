/**
 * Плавно проявляет указанный контейнер из полной прозрачности.
 * @param {PIXI.Container} container - Контейнер, который нужно анимировать.
 * @param {number} [duration=1500] - Длительность анимации в миллисекундах.
 */
export function fadeIn(container, duration = 1500) {
    if (!container) return;
    
    // Устанавливаем начальное состояние
    container.alpha = 0;
    
    const ticker = PIXI.Ticker.shared;
    let elapsed = 0;

    const animation = (time) => {
        elapsed += time.elapsedMS;
        const progress = Math.min(elapsed / duration, 1);

        container.alpha = progress;

        if (progress === 1) {
            ticker.remove(animation);
        }
    };

    ticker.add(animation);
}
