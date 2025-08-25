import { FruitsPool } from "./FruitsPool";
import { Subject } from "../Utils/Subject";
import { FruitView } from "./FruitViews/FruitView";
import { DangerousFruitView } from "./FruitViews/DangerousFruitView";

export type FruitCatchSystemCtx = {
    fruits: FruitView[];
    pool: FruitsPool;
    onCollectFruit: Subject<{ fruit: FruitView }>;
    onDamage: Subject<{ value: number }>;
    onCollectScores: Subject<{ value: number }>;
};

export class FruitCatchSystem {
    private ctx: FruitCatchSystemCtx;

    constructor(ctx: FruitCatchSystemCtx) {
        this.ctx = ctx;

        this.ctx.onCollectFruit.subscribe((payload) => {
            this.handleCatch(payload.fruit);
        });
    }

    private handleCatch(fruit: FruitView) {
        const isDamage = fruit instanceof DangerousFruitView;

        if (isDamage) {
            this.ctx.onDamage.next({ value: 1 });
        }
        else {
            this.ctx.onCollectScores.next({ value: fruit.scores });
        }

        const index = this.ctx.fruits.findIndex(fv => fv.node === fruit.node);

        if (index !== -1) {
            this.ctx.fruits.splice(index, 1);
            this.ctx.pool.releaseFruit(fruit);
        }
    }
}
