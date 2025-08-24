import { Node, Prefab, instantiate } from "cc";
import { BucketPm, BucketPmCtx } from "./BucketPm";
import { Subject } from "../Utils/Subject";

export type BucketRootCtx = {
    bucketPrefab: Prefab;
    parent: Node;
    spawnPoint: Node;
    onLeftMouseButtonDown: Subject<{ x: number; y: number }>;
    onLeftMouseButtonUp: Subject<{ x: number; y: number }>;
    onMouseMove: Subject<{ x: number; y: number }>;
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
