import { Node, Prefab } from "cc";
import { InputControlsPm, InputControlsCtx } from "./InputControls/InputControlsPm";
import { BucketRoot, BucketRootCtx } from "./Bucket/BucketRoot";
import { Subject } from "./Utils/Subject";
import { FruitsRoot, FruitsRootCtx } from "./Fruits/FruitsRoot";

export type GameCtx = {
    bucketPrefab: Prefab;
    parent: Node;
    spawnPoint: Node;
    fruitsSpawns: Node[];
    fruitsPrefabs: Prefab[];
    spawnFrequencySec: number;
    lives: number;
};

export class GameRoot {
    private ctx: GameCtx;
    private inputPm: InputControlsPm;
    private bucketRoot: BucketRoot;
    private fruitsRoot: FruitsRoot;

    private onLeftMouseButtonDown = new Subject<{ x: number; y: number }>();
    private onLeftMouseButtonUp = new Subject<{ x: number; y: number }>();
    private onMouseMove = new Subject<{ x: number; y: number }>();
    private onCollectFruit = new Subject<{ x: number; y: number }>();

    constructor(ctx: GameCtx) {
        this.ctx = ctx;

        this.initializeInput();
        this.initializeBucket();
        // this.initializeFruits();
    }

    private initializeInput() {
        const ctx: InputControlsCtx = {
            onLeftMouseButtonDown: this.onLeftMouseButtonDown,
            onLeftMouseButtonUp: this.onLeftMouseButtonUp,
            onMouseMove: this.onMouseMove,
        };

        this.inputPm = new InputControlsPm(ctx);
    }

    private initializeBucket() {
        const ctx: BucketRootCtx = {
            bucketPrefab: this.ctx.bucketPrefab,
            parent: this.ctx.parent,
            spawnPoint: this.ctx.spawnPoint,
            onLeftMouseButtonDown: this.onLeftMouseButtonDown,
            onLeftMouseButtonUp: this.onLeftMouseButtonUp,
            onMouseMove: this.onMouseMove,
        };

        this.bucketRoot = new BucketRoot(ctx);
    }

    private initializeFruits() {
        const ctx: FruitsRootCtx = {
            fruitsSpawns: this.ctx.fruitsSpawns,
            fruitsPrefabs: this.ctx.fruitsPrefabs,
            spawnFrequencySec: this.ctx.spawnFrequencySec,
            parent: this.ctx.parent
        };

        this.fruitsRoot = new FruitsRoot(ctx);
    }

    destroy() {
        this.bucketRoot?.destroy();
        this.inputPm?.destroy();
        this.fruitsRoot?.destroy();
    }
}
