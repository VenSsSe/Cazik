/*
  Файл: main.js
  Назначение: Точка входа в приложение.
  Он импортирует все необходимые модули, инициализирует их и запускает главный цикл анимации.
*/

import { SceneManager } from './SceneManager.js';
import { ParticleSystem } from './ParticleSystem.js';
import { CometSystem } from './CometSystem.js';
import { ExplosionSystem } from './ExplosionSystem.js';
import { InteractionHandler } from './InteractionHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles');
    const params = JSON.parse(canvas.getAttribute('data-params'));

    // 1. Инициализация основных компонентов
    const sceneManager = new SceneManager(canvas);
    
    // 2. Создание систем
    const particleSystem = new ParticleSystem(sceneManager.scene, params);
    const cometSystem = new CometSystem(sceneManager.scene, params);
    const explosionSystem = new ExplosionSystem(sceneManager.scene, params);

    // 3. Настройка взаимодействия
    // new InteractionHandler(sceneManager.camera, sceneManager.renderer, particleSystem, explosionSystem);

    // 4. Запуск цикла анимации
    function animate() {
        requestAnimationFrame(animate);

        // Обновляем состояние каждой системы
        particleSystem.update();
        cometSystem.update();
        explosionSystem.update();
        
        // Обновляем сцену
        sceneManager.update();
    }

    animate();
});
