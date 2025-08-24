import { Node, Prefab } from "cc";
import { InputControlsPm, InputControlsCtx } from "./InputControls/InputControlsPm";
import { BucketRoot, BucketRootCtx } from "./Bucket/BucketRoot";
import { Subject } from "./Utils/Subject";
import { FruitsRoot, FruitsRootCtx } from "./Fruits/FruitsRoot";
import { FruitType } from "./Fruits/FruitType";

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
    private onCollectFruit= new Subject<{ isDamage: boolean; fruitType: FruitType; node: Node }>;

    constructor(ctx: GameCtx) {
        this.ctx = ctx;

        this.initializeInput();
        this.initializeBucket();
        this.initializeFruits();
    }

    private initializeInput() {
        this.inputPm = new InputControlsPm({
            onLeftMouseButtonDown: this.onLeftMouseButtonDown,
            onLeftMouseButtonUp: this.onLeftMouseButtonUp,
            onMouseMove: this.onMouseMove,
        });
    }

    private initializeBucket() {
        this.bucketRoot = new BucketRoot({
            bucketPrefab: this.ctx.bucketPrefab,
            parent: this.ctx.parent,
            spawnPoint: this.ctx.spawnPoint,
            onLeftMouseButtonDown: this.onLeftMouseButtonDown,
            onLeftMouseButtonUp: this.onLeftMouseButtonUp,
            onMouseMove: this.onMouseMove,
            onCollectFruit: this.onCollectFruit
        });
    }

    private initializeFruits() {
        this.fruitsRoot = new FruitsRoot({
            fruitsSpawns: this.ctx.fruitsSpawns,
            fruitsPrefabs: this.ctx.fruitsPrefabs,
            spawnFrequencySec: this.ctx.spawnFrequencySec,
            parent: this.ctx.parent,
            onCollectFruit: this.onCollectFruit
        });
    }

    destroy() {
        this.bucketRoot?.destroy();
        this.inputPm?.destroy();
        this.fruitsRoot?.destroy();
    }
}
