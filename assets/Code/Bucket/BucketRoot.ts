import { Node, Prefab, instantiate } from "cc";
import { BucketPm, BucketPmCtx } from "./BucketPm";
import { Subject } from "../Utils/Subject";
import { BucketView } from "./BucketView";
import { FruitType } from "../Fruits/FruitType";

export type BucketRootCtx = {
    bucketPrefab: Prefab;
    parent: Node;
    spawnPoint: Node;
    onLeftMouseButtonDown: Subject<{ x: number; y: number }>;
    onLeftMouseButtonUp: Subject<{ x: number; y: number }>;
    onMouseMove: Subject<{ x: number; y: number }>;
    onCollectFruit: Subject<{ isDamage: boolean; fruitType: FruitType; node: Node }>;
};

export class BucketRoot {
    public ctx: BucketRootCtx;
    private bucketNode: Node;
    private bucketPm: BucketPm;

    constructor(ctx: BucketRootCtx) {
        this.ctx = ctx;

        this.bucketNode = instantiate(ctx.bucketPrefab);
        this.bucketNode.setParent(ctx.parent);
        this.bucketNode.setPosition(ctx.spawnPoint.position);

        const view = this.bucketNode.getComponent(BucketView);

        view.Initialize({
            onCollectFruit: ctx.onCollectFruit,
        });

        const bucketPmCtx: BucketPmCtx = {
            bucketNode: this.bucketNode,
            onLeftMouseButtonDown: ctx.onLeftMouseButtonDown,
            onLeftMouseButtonUp: ctx.onLeftMouseButtonUp,
            onMouseMove: ctx.onMouseMove,
        };

        this.bucketPm = new BucketPm(bucketPmCtx);
    }

    destroy() {
        this.bucketPm?.destroy();
        this.bucketNode?.destroy();
    }
}
