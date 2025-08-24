import { Node, Prefab, instantiate } from "cc";

export type FruitsPoolCtx = {
    prefabs: Prefab[];
    parent: Node;
    poolSize?: number;
};

export class FruitsPool {
    private pool: Node[] = [];
    private ctx: FruitsPoolCtx;

    constructor(ctx: FruitsPoolCtx) {
        this.ctx = ctx;

        const poolSize = ctx.poolSize ?? 15;

        for (let i = 0; i < poolSize; i++) {
            const fruit = this.createFruit(i);
            this.pool.push(fruit);
        }
    }

    private createFruit(index: number = -1): Node {
        const prefab =
            index !== -1
                ? this.ctx.prefabs[index % this.ctx.prefabs.length]
                : this.ctx.prefabs[Math.floor(Math.random() * this.ctx.prefabs.length)];

        const fruit = instantiate(prefab);
        fruit.setParent(this.ctx.parent);
        fruit.active = false;
        return fruit;
    }

    getFruit(): Node {
        const fruit = this.pool.find(f => !f.active);
        if (fruit) {
            fruit.active = true;
            return fruit;
        }

        const newFruit = this.createFruit();
        this.pool.push(newFruit);
        newFruit.active = true;
        return newFruit;
    }

    releaseFruit(fruit: Node) {
        fruit.active = false;
    }
}
