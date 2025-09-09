/*
  Файл: CometSystem.js
  Назначение: Отвечает за логику комет: создание, запуск,
  обновление их позиций и жизненного цикла.
*/

const MAX_COMETS = 20;

export class CometSystem {
    constructor(scene, params) {
        this.scene = scene;
        this.params = params;
        this.comets = [];
        this.init();
    }

    init() {
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(MAX_COMETS * 3);
        
        for (let i = 0; i < MAX_COMETS; i++) {
            const i3 = i * 3;
            this.positions[i3] = 2000;
            this.positions[i3 + 1] = 2000;
            this.positions[i3 + 2] = 2000;
            this.comets.push({ velocity: new THREE.Vector3(), life: 0, active: false });
        }
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        
        const textureLoader = new THREE.TextureLoader();
        const sprite = textureLoader.load(this.params.sprite);
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: this.params.size * 1.5,
            map: sprite,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            opacity: 0.7
        });

        this.system = new THREE.Points(this.geometry, material);
        this.scene.add(this.system);
    }

    launchComet() {
        const comet = this.comets.find(c => !c.active);
        if (comet) {
            comet.active = true;
            comet.life = 0;
            const startRadius = 1500;
            const angle = Math.random() * Math.PI * 2;
            const startX = Math.cos(angle) * startRadius;
            const startZ = Math.sin(angle) * startRadius;
            const startY = (Math.random() - 0.5) * 1000;
            const cometIndex = this.comets.indexOf(comet);
            const i3 = cometIndex * 3;
            this.positions[i3] = startX;
            this.positions[i3 + 1] = startY;
            this.positions[i3 + 2] = startZ;
            const target = new THREE.Vector3((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400);
            comet.velocity.subVectors(target, new THREE.Vector3(startX, startY, startZ)).normalize().multiplyScalar(10 + Math.random() * 5);
        }
    }

    update() {
        if (Math.random() < 0.015) {
            this.launchComet();
        }

        for (let i = 0; i < MAX_COMETS; i++) {
            const comet = this.comets[i];
            if (comet.active) {
                const i3 = i * 3;
                this.positions[i3] += comet.velocity.x;
                this.positions[i3 + 1] += comet.velocity.y;
                this.positions[i3 + 2] += comet.velocity.z;
                comet.life++;
                if (comet.life > 300) {
                    comet.active = false;
                    this.positions[i3 + 1] = 2000; // Убираем комету из вида
                }
            }
        }
        this.geometry.attributes.position.needsUpdate = true;
    }
}
