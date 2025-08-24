import { Node, Vec3 } from "cc";
import { FruitsPool } from "./FruitsPool";

export type FruitsSpawnSystemCtx = {
    fruitsSpawns: Node[];
    spawnFrequencySec: number;
    pool: FruitsPool;
    fruits: Node[];
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

    spawnFruit() {
        // достаём фрукт из пула
        const fruit = this.ctx.pool.getFruit();

        // выбираем случайную точку спавна
        const spawn = this.ctx.fruitsSpawns[
            Math.floor(Math.random() * this.ctx.fruitsSpawns.length)
        ];

        // ставим фрукт в позицию точки спавна
        fruit.setPosition(new Vec3(
            spawn.position.x,
            spawn.position.y,
            spawn.position.z
        ));

        // добавляем в массив активных
        this.ctx.fruits.push(fruit);
    }

    destroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
