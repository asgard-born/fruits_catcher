import { Node, Vec3, math, Quat } from "cc";
import { FruitsPool } from "./FruitsPool";
import { FruitView } from "./FruitViews/FruitView";
import { ReactiveProperty } from "../Utils/ReactiveProperty";
import { FruitType } from "./FruitType";

/**
 * FruitsSpawnSystem — handles periodic fruit spawning.
 * Uses FruitsPool to get fruits by type.
 */
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

        const availableTypes = this.ctx.pool.getAvailableTypes();

        if (availableTypes.length === 0) {
            console.warn("No available fruit types in pool!");
            return;
        }

        const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)] as FruitType;

        const fruitView = this.ctx.pool.getFruit(randomType);
        const spawn = this.getNextSpawn();

        fruitView.node.setPosition(new Vec3(
            spawn.position.x,
            spawn.position.y,
            spawn.position.z
        ));

        const randomAngle = math.randomRange(0, 360);
        fruitView.node.setRotation(Quat.fromEuler(new Quat(), 0, 0, randomAngle));

        this.ctx.fruits.push(fruitView);
    }

    destroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
