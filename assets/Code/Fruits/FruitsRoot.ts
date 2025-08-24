import { Node, Prefab } from "cc";
import { FruitsSpawnSystem } from "./FruitsSpawnSystem";
import { FruitsBehaviourSystem } from "./FruitsBehaviourSystem";
import { FruitsPool, FruitsPoolCtx } from "./FruitsPool";
import { FruitType } from "./FruitType";
import { Subject } from "../Utils/Subject";

export type FruitsRootCtx = {
    fruitsSpawns: Node[];
    fruitsPrefabs: Prefab[];
    spawnFrequencySec: number;
    parent: Node;
    onCollectFruit: Subject<{ isDamage: boolean; fruitType: FruitType; node: Node }>;
};

export class FruitsRoot {
    private fruits: Node[] = [];
    private spawnSystem: FruitsSpawnSystem;
    private behaviourSystem: FruitsBehaviourSystem;
    private pool: FruitsPool;

    private readonly EACH_FRUIT_COUNT: number = 3;

    constructor(ctx: FruitsRootCtx) {
        const poolCtx: FruitsPoolCtx = {
            prefabs: ctx.fruitsPrefabs,
            parent: ctx.parent,
            poolSize: this.EACH_FRUIT_COUNT,
        };

        this.pool = new FruitsPool(poolCtx);

        this.spawnSystem = new FruitsSpawnSystem({
            spawnFrequencySec: ctx.spawnFrequencySec,
            fruitsSpawns: ctx.fruitsSpawns,
            pool: this.pool,
            fruits: this.fruits,
        });

        this.behaviourSystem = new FruitsBehaviourSystem({
            fruits: this.fruits,
            pool: this.pool,
            speed: 100,
            tickIntervalMs: 16,
            onCollectFruit: ctx.onCollectFruit,
        });
    }

    destroy() {
        this.spawnSystem?.destroy();
        this.behaviourSystem?.destroy();
    }
}
