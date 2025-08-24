import { Node, Prefab, instantiate } from "cc";

export type FruitsSpawnSystemCtx = {
    spawnFrequencySec: number;
    fruitsSpawns: Node[];
    fruitsPrefabs: Prefab[];
    fruits: Node[];
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
        if (this.ctx.fruitsPrefabs.length === 0 || this.ctx.fruitsSpawns.length === 0) return;

        let prefabIndex: number;
        do {
            prefabIndex = Math.floor(Math.random() * this.ctx.fruitsPrefabs.length);
        } while (prefabIndex === this.lastPrefabIndex);

        this.lastPrefabIndex = prefabIndex;

        let spawnIndex: number;
        do {
            spawnIndex = Math.floor(Math.random() * this.ctx.fruitsSpawns.length);
        } while (spawnIndex === this.lastSpawnIndex);

        this.lastSpawnIndex = spawnIndex;

        const prefab = this.ctx.fruitsPrefabs[prefabIndex];
        const spawnPoint = this.ctx.fruitsSpawns[spawnIndex];

        const fruitNode = instantiate(prefab);
        fruitNode.setParent(spawnPoint.parent ?? spawnPoint.scene);
        fruitNode.setPosition(spawnPoint.position);

        this.ctx.fruits.push(fruitNode);
    }

    destroy() {
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
