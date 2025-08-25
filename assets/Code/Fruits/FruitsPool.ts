import { Node, Prefab, instantiate, Quat } from 'cc';
import { FruitView } from "./FruitViews/FruitView";
import { FruitType } from "./FruitType";

export type FruitsPoolCtx = {
    prefabs: Prefab[];
    parent: Node;
    poolSize: number;
};

/**
 * FruitsPool — manager for fruit object pooling.
 * Works only with fruit types defined in prefabs via FruitView.type.
 */
export class FruitsPool {
    private pools: Record<FruitType, Node[]> = {} as Record<FruitType, Node[]>;
    private ctx: FruitsPoolCtx;

    constructor(ctx: FruitsPoolCtx) {
        this.ctx = ctx;

        // init empty arrays for each type found in prefabs
        for (const prefab of ctx.prefabs) {
            const tmpNode = instantiate(prefab);
            const view = tmpNode.getComponent(FruitView);
            tmpNode.destroy();

            if (view) {
                if (!this.pools[view.fruitType]) {
                    this.pools[view.fruitType] = [];
                }
            }
        }

        // fill pools
        for (const type of this.getAvailableTypes()) {
            for (let i = 0; i < ctx.poolSize; i++) {
                this.pools[type].push(this.createFruit(type));
            }
        }
    }

    /** Create single fruit node for given type */
    private createFruit(type: FruitType): Node {
        const prefab = this.ctx.prefabs.find(p => {
            const v = instantiate(p).getComponent(FruitView);
            const match = v?.fruitType === type;
            v?.node.destroy();
            return match;
        });

        if (!prefab) {
            throw new Error(`Prefab for type ${FruitType[type]} not found!`);
        }

        const node = instantiate(prefab);
        node.setParent(this.ctx.parent);
        node.active = false;

        const fruitView = node.getComponent(FruitView);
        if (!fruitView) {
            throw new Error("Prefab does not contain FruitView!");
        }

        return node;
    }

    /** Returns one available fruit of given type */
    getFruit(type: FruitType): FruitView {
        let pool = this.pools[type];
        if (!pool) {
            throw new Error(`No pool found for type ${FruitType[type]}`);
        }

        let node = pool.find(n => !n.active);

        if (!node) {
            node = this.createFruit(type);
            pool.push(node);
        }

        node.active = true;
        return node.getComponent(FruitView)!;
    }

    /** Releases fruit back to pool */
    releaseFruit(fruit: FruitView) {
        fruit.node.setRotation(Quat.fromEuler(new Quat(), 0, 0, 0));
        fruit.node.active = false;
    }

    /** Returns only fruit types actually present in prefabs */
    getAvailableTypes(): FruitType[] {
        return Object.keys(this.pools).map(k => Number(k) as FruitType);
    }
}
