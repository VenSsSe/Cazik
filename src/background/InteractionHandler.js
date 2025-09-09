/*
  Файл: InteractionHandler.js
  Назначение: Обрабатывает ввод от пользователя (клики мыши).
  Использует Raycaster для определения, на какую частицу нажал пользователь,
  и вызывает соответствующие методы в других системах.
*/

export class InteractionHandler {
    constructor(camera, renderer, particleSystem, explosionSystem) {
        this.camera = camera;
        this.renderer = renderer;
        this.particleSystem = particleSystem;
        this.explosionSystem = explosionSystem;
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.renderer.domElement.addEventListener('mousedown', this.onCanvasMouseDown.bind(this), false);
    }

    onCanvasMouseDown(event) {
        event.preventDefault();
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.raycaster.params.Points.threshold = 10; // Увеличиваем порог для легкого попадания

        const intersects = this.raycaster.intersectObject(this.particleSystem.points);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            
            // Вызываем методы других систем
            this.explosionSystem.triggerExplosion(intersect.point);
            this.particleSystem.respawnParticle(intersect.index);
        }
    }
}
