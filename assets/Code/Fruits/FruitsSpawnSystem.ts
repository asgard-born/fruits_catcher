import { Node, Vec3 } from "cc";
import { FruitsPool } from "./FruitsPool";
import { FruitView } from "./FruitViews/FruitView";
import { ReactiveProperty } from "../Utils/ReactiveProperty";

export type FruitsSpawnSystemCtx = {
    fruitsSpawns: Node[];
    spawnFrequencySec: number;
    pool: FruitsPool;
    fruits: FruitView[];
    isOnPause: ReactiveProperty<boolean>;
};

export class FruitsSpawnSystem {
    private ctx: FruitsSpawnSystemCtx;
    private intervalId: number | null = null;
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

    private getNextSpawn(): Node {
        let index: number;
        const count = this.ctx.fruitsSpawns.length;

        do {
            index = Math.floor(Math.random() * count);
        } while (count > 1 && index === this.lastSpawnIndex);

        this.lastSpawnIndex = index;
        return this.ctx.fruitsSpawns[index];
    }

    spawnFruit() {
        if (this.ctx.isOnPause.value) {
            return;
        }

        const fruitView = this.ctx.pool.getFruit();
        const spawn = this.getNextSpawn();

        fruitView.node.setPosition(new Vec3(
            spawn.position.x,
            spawn.position.y,
            spawn.position.z
        ));

        // добавляем в массив активных
        this.ctx.fruits.push(fruitView);
    }

    destroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
