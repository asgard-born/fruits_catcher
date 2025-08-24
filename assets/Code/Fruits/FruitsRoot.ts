import { Node, Prefab } from "cc";
import { FruitsSpawnSystem } from "./FruitsSpawnSystem";
import { FruitsBehaviourSystem } from "./FruitsBehaviourSystem";

export type FruitsRootCtx = {
    fruitsSpawns: Node[];
    fruitsPrefabs: Prefab[];
    spawnFrequencySec: number;
    parent: Node;
};

export class FruitsRoot {
    private ctx: FruitsRootCtx;
    private fruits: Node[] = [];
    private spawnSystem: FruitsSpawnSystem;
    private behaviourSystem: FruitsBehaviourSystem;

    constructor(ctx: FruitsRootCtx) {
        this.ctx = ctx;

        this.spawnSystem = new FruitsSpawnSystem({
            spawnFrequencySec: ctx.spawnFrequencySec,
            fruitsSpawns: ctx.fruitsSpawns,
            fruitsPrefabs: ctx.fruitsPrefabs,
            fruits: this.fruits,
        });

        this.behaviourSystem = new FruitsBehaviourSystem({
            fruits: this.fruits,
            speed: 100,
            tickIntervalMs: 16
        });
    }

    destroy() {
        this.spawnSystem?.destroy();
        this.behaviourSystem?.destroy();
    }
}
