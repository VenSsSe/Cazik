/*
  Файл: ExplosionSystem.js
  Назначение: Управляет пулом объектов взрывов. Отвечает за их
  активацию, анимацию частиц и деактивацию по окончании жизненного цикла.
*/

const MAX_EXPLOSIONS = 15;
const PARTICLES_PER_EXPLOSION = 20;
const EXPLOSION_LIFESPAN = 60; // в кадрах

export class ExplosionSystem {
    constructor(scene, params) {
        this.scene = scene;
        this.params = params;
        this.explosions = [];
        this.init();
    }

    init() {
        const textureLoader = new THREE.TextureLoader();
        const sprite = textureLoader.load(this.params.sprite);

        for (let i = 0; i < MAX_EXPLOSIONS; i++) {
            const geom = new THREE.BufferGeometry();
            const vertices = [];
            const velocities = [];
            for (let j = 0; j < PARTICLES_PER_EXPLOSION; j++) {
                vertices.push(0, 0, 0);
                velocities.push(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                );
            }
            geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            
            const material = new THREE.PointsMaterial({
                color: 0xffffff,
                size: this.params.size * 0.8,
                map: sprite,
                blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false
            });

            const system = new THREE.Points(geom, material);
            system.visible = false;
            this.scene.add(system);
            this.explosions.push({ system, velocities, active: false, life: 0 });
        }
    }

    triggerExplosion(position) {
        const explosion = this.explosions.find(e => !e.active);
        if (explosion) {
            explosion.active = true;
            explosion.life = 0;
            explosion.system.position.copy(position);
            explosion.system.material.color.setHex(Math.random() * 0xffffff);
            explosion.system.visible = true;
            explosion.system.material.opacity = 1.0;

            const positions = explosion.system.geometry.attributes.position.array;
            for(let i=0; i < positions.length; i++) {
                positions[i] = 0;
            }
            explosion.system.geometry.attributes.position.needsUpdate = true;
        }
    }

    update() {
        for (const explosion of this.explosions) {
            if (explosion.active) {
                const positions = explosion.system.geometry.attributes.position.array;
                for (let i = 0; i < PARTICLES_PER_EXPLOSION; i++) {
                    const i3 = i * 3;
                    positions[i3] += explosion.velocities[i3];
                    positions[i3 + 1] += explosion.velocities[i3 + 1];
                    positions[i3 + 2] += explosion.velocities[i3 + 2];
                }
                explosion.system.geometry.attributes.position.needsUpdate = true;
                
                explosion.system.material.opacity -= 1.0 / EXPLOSION_LIFESPAN;
                explosion.life++;
                
                if (explosion.life >= EXPLOSION_LIFESPAN) {
                    explosion.active = false;
                    explosion.system.visible = false;
                }
            }
        }
    }
}
