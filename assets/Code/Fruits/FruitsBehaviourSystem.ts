import { Node, Vec3 } from "cc";
import { FruitsPool } from "./FruitsPool";
import { FruitType } from "./FruitType";
import { Subject } from "../Utils/Subject";
import { FruitView } from "./FruitView";

export type FruitsBehaviourSystemCtx = {
    fruits: Node[];
    pool: FruitsPool;
    speed: number;
    tickIntervalMs: number;
    onCollectFruit: Subject<{ isDamage: boolean; fruitType: FruitType; node: Node }>;
};

export class FruitsBehaviourSystem {
    private ctx: FruitsBehaviourSystemCtx;
    private intervalId: number | null = null;

    constructor(ctx: FruitsBehaviourSystemCtx) {
        this.ctx = ctx;
        this.startBehaveLoop();

        this.ctx.onCollectFruit.subscribe((fruitInfo) => {
            this.removeFruit(fruitInfo.node);
        });
    }

    private startBehaveLoop() {
        this.intervalId = window.setInterval(() => {
            this.updateFruits(this.ctx.tickIntervalMs / 1000);
        }, this.ctx.tickIntervalMs);
    }

    private updateFruits(deltaTime: number) {
        this.ctx.fruits.forEach(node => {
            const pos = node.position;
            node.setPosition(new Vec3(pos.x, pos.y - this.ctx.speed * deltaTime, pos.z));
        });
    }

    private removeFruit(fruit: Node) {
        const idx = this.ctx.fruits.indexOf(fruit);
        if (idx !== -1) {
            this.ctx.fruits.splice(idx, 1);
            this.ctx.pool.releaseFruit(fruit);
        }
    }

    destroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
