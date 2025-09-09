import { createScene } from '../scene/GameScene.js';
import { Grid } from '../scene/components/Grid.js';
import { UI } from '../ui/index.js';
import { Character } from '../game/Character.js';
import { fadeIn } from '../ui/animations.js';

/**
 * Отвечает за создание, компоновку и анимацию всех видимых элементов игры.
 */
export class StageManager {
    constructor(context) {
        this.context = context;
        this.app = context.app;
        
        // Создаем главный контейнер, в котором будет жить вся игра
        this.mainContainer = new PIXI.Container();
        this.app.stage.addChild(this.mainContainer);
    }

    /**
     * Инициализирует и строит всю сцену.
     */
    buildScene() {
        // 1. Создаем UI, который предоставляет дочерние контейнеры для других элементов
        this.context.ui = new UI(this.context);
        this.mainContainer.addChild(this.context.ui.container);
        this.context.ui.create(); // Вызываем create после добавления в mainContainer

        // 2. Создаем все остальные игровые компоненты, передавая им главный контейнер
        // и позиционируем их относительно центра экрана

        // Игровая сцена (рамка, фоны барабанов)
        const gameSceneContainer = createScene(this.app);
        gameSceneContainer.x = this.app.screen.width / 2;
        gameSceneContainer.y = this.app.screen.height / 2;
        this.mainContainer.addChild(gameSceneContainer);

        // Сетка символов
        this.context.grid = new Grid(this.context);
        const gridContainer = this.context.grid.create();
        gridContainer.x = this.app.screen.width / 2;
        gridContainer.y = this.app.screen.height / 2 - 30; // Центрируем сетку
        this.mainContainer.addChild(gridContainer);

        // Персонаж
        this.context.character = new Character(this.context);
        const characterSprite = this.context.character.create();
        characterSprite.x = this.app.screen.width - 200;
        characterSprite.y = this.app.screen.height / 2 + 150;
        this.mainContainer.addChild(characterSprite);

        // 3. Обновляем UI первоначальными данными
        this.context.ui.updateSidePanel(this.context.bonusManager.isAnteBetActive);
        this.context.ui.updateBalance(this.context.playerBalance);
        this.context.ui.updateBet(this.context.getBetConfiguration());
        this.context.ui.updateWin(0);

        // 4. Запускаем анимацию плавного появления всего, что мы создали
        fadeIn(this.mainContainer);
    }
}
