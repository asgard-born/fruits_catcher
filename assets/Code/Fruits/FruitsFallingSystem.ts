import { Node } from "cc";
import { FruitsPool } from "./FruitsPool";
import { Subject } from "../Utils/Subject";
import { FruitView } from "./FruitViews/FruitView";
import { ReactiveProperty } from "../Utils/ReactiveProperty";

export type FruitsFallingSystemCtx = {
    fruits: FruitView[];
    pool: FruitsPool;
    speed: number;
    tickIntervalMs: number;
    onCollectFruit: Subject<{ fruit: FruitView }>;
    isOnPause: ReactiveProperty<boolean>;
};

export class FruitsFallingSystem {
    private ctx: FruitsFallingSystemCtx;
    private intervalId: number | null = null;

    constructor(ctx: FruitsFallingSystemCtx) {
        this.ctx = ctx;
        this.startBehaveLoop();

        this.ctx.onCollectFruit.subscribe(({ fruit }) => {
            this.removeFruit(fruit.node);
        });
    }

    private startBehaveLoop() {
        this.intervalId = window.setInterval(() => {
            this.updateFruits(this.ctx.tickIntervalMs / 1000);
        }, this.ctx.tickIntervalMs);
    }

    private updateFruits(deltaTime: number) {
        if (this.ctx.isOnPause.value) return;

        this.ctx.fruits.forEach(fruitView => {
            fruitView.fall(deltaTime, this.ctx.speed);
        });
    }

    private removeFruit(fruitNode: Node) {
        const idx = this.ctx.fruits.findIndex(fv => fv.node === fruitNode);
        if (idx !== -1) {
            const fruitView = this.ctx.fruits[idx];
            this.ctx.fruits.splice(idx, 1);
            this.ctx.pool.releaseFruit(fruitView);
        }
    }

    destroy() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
