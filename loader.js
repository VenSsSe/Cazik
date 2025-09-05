// --- loader.js ---
// --- loader.js ---
// Этот файл отвечает только за загрузку всех игровых ресурсов

export async function loadAssets() {
    // Добавляем конфигурационные файлы в список загрузки
    await PIXI.Assets.load([
        { alias: 'config', src: 'config.json' },
        { alias: 'symbols', src: 'symbols.json' }
    ]);

    const config = PIXI.Assets.get('config');
    const symbols = PIXI.Assets.get('symbols');

    // Формируем список всех изображений для загрузки
    const assetManifest = {
        bundles: [{
            name: 'game-assets',
            assets: [
                { alias: 'background_olympus', src: 'assets/backgrounds/background_olympus.jpg' },
                { alias: 'reels_background', src: 'assets/backgrounds/reels_background.png' },
                { alias: 'game_board_frame', src: 'assets/ui/frames/game_board_frame.png' },
                { alias: 'ui_panel_bottom', src: 'assets/ui/panels/ui_panel_bottom.png' },
                { alias: 'ui_panel_ante', src: 'assets/ui/panels/ui_panel_ante.png' },
                { alias: 'logo', src: 'assets/ui/logo/logo.png' },
                { alias: 'char_cat_base', src: 'assets/characters/char_cat_base.png' },
                { alias: 'char_cat_power', src: 'assets/characters/char_cat_power.png' },
                { alias: 'ui_button_spin', src: 'assets/ui/buttons/ui_button_spin.png' },
                { alias: 'vfx_symbol_explode', src: 'assets/effects/vfx_symbol_explode.png' }
            ]
        }]
    };

    // Добавляем все символы в манифест
    symbols.forEach(symbol => {
        assetManifest.bundles[0].assets.push({ alias: symbol.id, src: symbol.path });
    });

    await PIXI.Assets.init({ manifest: assetManifest });
    await PIXI.Assets.loadBundle('game-assets');

    console.log("Все ассеты успешно загружены!");
    return { config, symbols };
}
