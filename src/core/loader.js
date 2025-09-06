// --- loader.js ---
// Этот файл отвечает только за загрузку всех игровых ресурсов

export async function loadAssets() {
    console.log("Начинаем загрузку ассетов...");

    // Сначала загружаем JSON файлы, так как они нужны для формирования списка остальных ассетов
    const jsonData = await PIXI.Assets.load([
        { alias: 'config', src: 'assets/data/config.json' },
        { alias: 'symbols', src: 'assets/data/symbols.json' }
    ]);

    const config = jsonData.config;
    const symbols = jsonData.symbols;

    // --- Собираем ВСЕ пути к изображениям в один массив ---
    const imagePaths = [
        // Статичные UI и фоновые изображения
        { alias: 'background_olympus', src: 'assets/images/backgrounds/background_olympus.jpg' },
        { alias: 'reels_background', src: 'assets/images/backgrounds/reels_background.png' },
        { alias: 'game_board_frame', src: 'assets/ui/frames/game_board_frame.png' },
        { alias: 'symbol_grid_frame', src: 'assets/ui/frames/symbol_grid_frame.png' },
        { alias: 'logo', src: 'assets/ui/logo/logo.png' },

        // Кнопки и попапы
        { alias: 'ui_button_spin', src: 'assets/ui/buttons/restart.png' },
        { alias: 'ui_button_plus', src: 'assets/ui/buttons/97.png' },
        { alias: 'ui_button_minus', src: 'assets/ui/buttons/98.png' },
        { alias: 'ui_button_autoplay', src: 'assets/ui/buttons/next.png' },
        { alias: 'ui_button_buyfeature', src: 'assets/ui/buttons/shop.png' },
        { alias: 'ui_button_ante', src: 'assets/ui/buttons/upgrade.png' },
        { alias: 'ui_button_info', src: 'assets/ui/buttons/about.png' },
        { alias: 'ui_popup_congrats', src: 'assets/ui/popups/table.png' }
    ];

    // Добавляем все символы из symbols.json в массив для загрузки
    symbols.forEach(symbol => {
        // Загружаем статичную версию
        imagePaths.push({ alias: symbol.id, src: symbol.path });
        // Если есть анимированная, тоже загружаем
        if (symbol.path_animated) {
            imagePaths.push({ alias: `${symbol.id}_animated`, src: symbol.path_animated });
        }
    });

    // Добавляем кадры анимации персонажа
    for (let i = 0; i < 12; i++) {
        const pad = String(i).padStart(3, '0');
        imagePaths.push({ alias: `char_cat_base_${i}`, src: `assets/characters/char_cat_base/tile${pad}.png` });
        imagePaths.push({ alias: `char_cat_power_${i}`, src: `assets/characters/char_cat_power/tile${pad}.png` });
    }

    // Добавляем кадры анимации взрыва
    for (let i = 0; i < 15; i++) {
        const pad = String(i).padStart(3, '0');
        imagePaths.push({ alias: `vfx_symbol_explode_${i}`, src: `assets/effects/vfx_symbol_explode/tile${pad}.png` });
    }

    // Добавляем кадры анимации множителя
    for (let i = 0; i < 20; i++) {
        const pad = String(i).padStart(3, '0');
        imagePaths.push({ alias: `vfx_multiplier_orb_${i}`, src: `assets/effects/vfx_multiplier_orb/tile${pad}.png` });
    }

    // Загружаем все изображения одним вызовом
    console.log("Загрузка изображений...");
    await PIXI.Assets.load(imagePaths);

    console.log("Все ассеты успешно загружены!");
    
    return { config, symbols };
}
