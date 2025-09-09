/*
  Файл: ParticleSystem.js
  Назначение: Управляет созданием, "возрождением" и анимацией
  основного облака частиц (звезд).
*/

export class ParticleSystem {
    constructor(scene, params) {
        this.scene = scene;
        this.params = params;
        this.init();
    }

    init() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        for (let i = 0; i < this.params.count; i++) {
            vertices.push(
                2000 * Math.random() - 1000,
                2000 * Math.random() - 1000,
                2000 * Math.random() - 1000
            );
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const textureLoader = new THREE.TextureLoader();
        const sprite = textureLoader.load(this.params.sprite);
        const material = new THREE.PointsMaterial({
            color: parseInt(this.params.color, 16),
            size: this.params.size,
            map: sprite,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });

        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
    }
    
    respawnParticle(index) {
        const positions = this.points.geometry.attributes.position;
        const i3 = index * 3;
        positions.array[i3] = 2000 * Math.random() - 1000;
        positions.array[i3 + 1] = 2000 * Math.random() - 1000;
        positions.array[i3 + 2] = 2000 * Math.random() - 1000;
        positions.needsUpdate = true;
    }

    update() {
        const time = 5e-5 * Date.now();
        this.points.rotation.x = time * this.params.objX;
        this.points.rotation.y = time * this.params.objY;
        this.points.rotation.z = time * this.params.objZ;
    }
}
