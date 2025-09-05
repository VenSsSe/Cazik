// --- loader.js (Исправленная и упрощенная версия) ---
// Этот файл отвечает только за загрузку всех игровых ресурсов

export async function loadAssets() {
    console.log("Начинаем загрузку ассетов...");

    // Сначала загружаем JSON файлы, так как они нужны для формирования списка остальных ассетов
    const jsonData = await PIXI.Assets.load([
        { alias: 'config', src: 'config.json' },
        { alias: 'symbols', src: 'symbols.json' }
    ]);

    const config = jsonData.config;
    const symbols = jsonData.symbols;

    // --- Шаг 1: Собираем ВСЕ пути к изображениям в один массив ---
    const imagePaths = [
        // Статичные UI и фоновые изображения
        { alias: 'background_olympus', src: 'assets/backgrounds/background_olympus.jpg' },
        { alias: 'reels_background', src: 'assets/backgrounds/reels_background.png' },
        { alias: 'game_board_frame', src: 'assets/ui/frames/game_board_frame.png' },
        { alias: 'ui_panel_bottom', src: 'assets/ui/panels/ui_panel_bottom.png' },
        { alias: 'ui_panel_ante', src: 'assets/ui/panels/ui_panel_ante.png' },
        { alias: 'logo', src: 'assets/ui/logo/logo.png' },
        { alias: 'ui_button_spin', src: 'assets/ui/buttons/ui_button_spin.png' },
        { alias: 'ui_button_plus', src: 'assets/ui/buttons/ui_button_plus.png' },
        { alias: 'ui_button_minus', src: 'assets/ui/buttons/ui_button_minus.png' },
        { alias: 'ui_button_autoplay', src: 'assets/ui/buttons/ui_button_autoplay.png' },
        { alias: 'ui_button_buyfeature', src: 'assets/ui/buttons/ui_button_buyfeature.png' },
        { alias: 'vfx_symbol_explode', src: 'assets/effects/vfx_symbol_explode.png' },
        { alias: 'ui_popup_congrats', src: 'assets/ui/popups/ui_popup_congrats.png' }
    ];

    // Добавляем все символы из symbols.json в массив для загрузки
    symbols.forEach(symbol => {
        imagePaths.push({ alias: symbol.id, src: symbol.path });
    });

    // Добавляем кадры анимации персонажа
    for (let i = 0; i < 12; i++) {
        const pad = String(i).padStart(3, '0');
        imagePaths.push({ alias: `char_cat_base_${i}`, src: `assets/characters/char_cat_base/tile${pad}.png` });
        imagePaths.push({ alias: `char_cat_power_${i}`, src: `assets/characters/char_cat_power/tile${pad}.png` });
    }

    // --- Шаг 2: Загружаем все изображения одним вызовом ---
    console.log("Загрузка изображений...");
    await PIXI.Assets.load(imagePaths);

    console.log("Все ассеты успешно загружены!");
    
    // Возвращаем конфиги, которые мы загрузили в самом начале
    return { config, symbols };
}
