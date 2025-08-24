import { Node, Prefab, instantiate, Vec3 } from "cc";

export type FruitsSpawnSystemCtx = {
    spawnFrequencySec: number;
    fruitsSpawns: Node[];
    fruitsPrefabs: Prefab[];
    parent: Node; // куда добавлять фрукты
};

export class FruitsSpawnSystem {
    private ctx: FruitsSpawnSystemCtx;
    private intervalId: number | null = null;

    private lastPrefabIndex: number = -1;
    private lastSpawnIndex: number = -1;

    constructor(ctx: FruitsSpawnSystemCtx) {
        this.ctx = ctx;
        this.startSpawnLoop();
    }

    private startSpawnLoop() {
        this.intervalId = window.setInterval(() => {
            this.spawnFruit();
        }, this.ctx.spawnFrequencySec * 1000);
    }

    private spawnFruit() {
        if (this.ctx.fruitsPrefabs.length === 0 || this.ctx.fruitsSpawns.length === 0) {
            console.warn("Нет фруктов или точек спавна!");
            return;
        }

        // выбираем случайный префаб (не такой же как предыдущий)
        let prefabIndex: number;
        do {
            prefabIndex = Math.floor(Math.random() * this.ctx.fruitsPrefabs.length);
        } while (this.ctx.fruitsPrefabs.length > 1 && prefabIndex === this.lastPrefabIndex);
        this.lastPrefabIndex = prefabIndex;

        // выбираем случайную точку (не такую же как предыдущая)
        let spawnIndex: number;
        do {
            spawnIndex = Math.floor(Math.random() * this.ctx.fruitsSpawns.length);
        } while (this.ctx.fruitsSpawns.length > 1 && spawnIndex === this.lastSpawnIndex);
        this.lastSpawnIndex = spawnIndex;

        const prefab = this.ctx.fruitsPrefabs[prefabIndex];
        const spawnPoint = this.ctx.fruitsSpawns[spawnIndex];

        const fruit = instantiate(prefab);
        fruit.setPosition(new Vec3(
            spawnPoint.position.x,
            spawnPoint.position.y,
            spawnPoint.position.z
        ));

        this.ctx.parent.addChild(fruit);
    }

    destroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
