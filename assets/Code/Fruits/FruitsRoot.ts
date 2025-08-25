import { Node, Prefab } from "cc";
import { FruitsSpawnSystem } from "./FruitsSpawnSystem";
import { FruitsFallingSystem } from "./FruitsFallingSystem";
import { FruitsPool, FruitsPoolCtx } from "./FruitsPool";
import { Subject } from "../Utils/Subject";
import { ReactiveProperty } from "../Utils/ReactiveProperty";
import { FruitView } from "./FruitViews/FruitView";
import { FruitCatchSystem } from "./FruitCatchSystem";

export type FruitsRootCtx = {
    fruitsSpawns: Node[];
    fruitsPrefabs: Prefab[];
    spawnFrequencySec: number;
    parent: Node;
    onCollectFruit: Subject<{ fruit: FruitView }>;
    onDamage: Subject<{ value: number }>;
    onCollectScores: Subject<{ value: number }>;
    isOnPause: ReactiveProperty<boolean>;
    speed: number;
};

export class FruitsRoot {
    private fruits: FruitView[] = [];
    private pool: FruitsPool;

    private readonly EACH_FRUIT_COUNT: number = 3;

    constructor(ctx: FruitsRootCtx) {
        const poolCtx: FruitsPoolCtx = {
            prefabs: ctx.fruitsPrefabs,
            parent: ctx.parent,
            poolSize: this.EACH_FRUIT_COUNT,
        };

        this.pool = new FruitsPool(poolCtx);

        new FruitsSpawnSystem({
            spawnFrequencySec: ctx.spawnFrequencySec,
            fruitsSpawns: ctx.fruitsSpawns,
            pool: this.pool,
            fruits: this.fruits,
            isOnPause: ctx.isOnPause,
        });

        new FruitsFallingSystem({
            fruits: this.fruits,
            pool: this.pool,
            speed: ctx.speed,
            tickIntervalMs: 16,
            onCollectFruit: ctx.onCollectFruit,
            isOnPause: ctx.isOnPause,
        });

        new FruitCatchSystem({
            fruits: this.fruits,
            pool: this.pool,
            onCollectFruit: ctx.onCollectFruit,
            onDamage: ctx.onDamage,
            onCollectScores: ctx.onCollectScores,
        });
    }
}
