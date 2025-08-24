import { Node, Prefab } from "cc";
import { FruitsSpawnSystem, FruitsSpawnSystemCtx } from "./FruitsSpawnSystem";

export type FruitsRootCtx = {
    fruitsSpawns: Node[];
    fruitsPrefabs: Prefab[];
    spawnFrequencySec: number;
    parent: Node;
};

export class FruitsRoot {
    private ctx: FruitsRootCtx;
    private spawnSystem: FruitsSpawnSystem;

    constructor(ctx: FruitsRootCtx) {
        this.ctx = ctx;
        this.initializeSpawner();
    }

    private initializeSpawner() {
        const spawnCtx: FruitsSpawnSystemCtx = {
            spawnFrequencySec: this.ctx.spawnFrequencySec,
            fruitsSpawns: this.ctx.fruitsSpawns,
            fruitsPrefabs: this.ctx.fruitsPrefabs,
            parent: this.ctx.parent
        };

        this.spawnSystem = new FruitsSpawnSystem(spawnCtx);
    }

    destroy() {
        this.spawnSystem?.destroy();
    }
}