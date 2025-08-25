import { Node, Prefab, instantiate } from 'cc';
import { FruitView } from "./FruitViews/FruitView";

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
            const fruitNode = this.createFruit(i);
            this.pool.push(fruitNode);
        }
    }

    private createFruit(index: number = -1): Node {
        const prefab =
            index !== -1
                ? this.ctx.prefabs[index % this.ctx.prefabs.length]
                : this.ctx.prefabs[Math.floor(Math.random() * this.ctx.prefabs.length)];

        const node = instantiate(prefab);
        node.setParent(this.ctx.parent);
        node.active = false;

        const fruitView = node.getComponent(FruitView);
        if (!fruitView) {
            throw new Error("Prefab не содержит FruitView!");
        }

        return node;
    }

    getFruit(): FruitView {
        const node = this.pool.find(n => !n.active);

        if (node) {
            node.active = true;
            return node.getComponent(FruitView)!;
        }

        const newNode = this.createFruit();
        this.pool.push(newNode);
        newNode.active = true;
        return newNode.getComponent(FruitView)!;
    }

    releaseFruit(fruit: FruitView) {
        fruit.node.active = false;
    }
}
