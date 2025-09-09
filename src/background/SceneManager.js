/*
  Файл: SceneManager.js
  Назначение: Управляет основными объектами Three.js (сцена, камера, рендерер)
  и главным циклом обновления.
*/

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.init();
    }

    init() {
        // Камера
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.z = 1000;

        // Сцена
        this.scene = new THREE.Scene();
        const params = JSON.parse(this.canvas.getAttribute('data-params'));
        this.scene.background = new THREE.Color(parseInt(params.bgColor, 16));
        this.scene.fog = new THREE.FogExp2(parseInt(params.fogColor, 16), params.fogIntensity);

        // Рендерер
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    update() {
        const cameraFlythroughTime = 2e-5 * Date.now();
        const radius = 1000;
        this.camera.position.x = Math.sin(cameraFlythroughTime) * radius;
        this.camera.position.z = Math.cos(cameraFlythroughTime) * radius;
        this.camera.position.y = Math.cos(cameraFlythroughTime * 0.5) * 200;
        this.camera.lookAt(this.scene.position);

        this.renderer.render(this.scene, this.camera);
    }
}
