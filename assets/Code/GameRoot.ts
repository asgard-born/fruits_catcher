import { Node, Prefab } from "cc";
import { InputControlsPm } from "./InputControls/InputControlsPm";
import { BucketRoot } from "./Bucket/BucketRoot";
import { Subject } from "./Utils/Subject";
import { ReactiveProperty } from "./Utils/ReactiveProperty";
import { FruitsRoot } from "./Fruits/FruitsRoot";
import { FruitType } from "./Fruits/FruitType";
import { GameLifecycle } from "./GameLifecycle";
import { UIRoot } from "./UI/UIRoot";
import { FruitView } from "./Fruits/FruitViews/FruitView";

export type GameCtx = {
    bucketPrefab: Prefab;
    parent: Node;
    spawnPoint: Node;
    fruitsSpawns: Node[];
    fruitsPrefabs: Prefab[];
    uiRoot: Node,
    spawnFrequencySec: number;
    lives: number;
    coreWindow: Prefab;
};

export class GameRoot {
    private ctx: GameCtx;
    private inputPm: InputControlsPm;
    private bucketRoot: BucketRoot;
    private fruitsRoot: FruitsRoot;
    private lifecycle: GameLifecycle;
    private uiRoot: UIRoot;

    private lives = new ReactiveProperty(0);
    private scores = new ReactiveProperty(0);

    private onLeftMouseButtonDown = new Subject<{ x: number; y: number }>();
    private onLeftMouseButtonUp = new Subject<{ x: number; y: number }>();
    private onMouseMove = new Subject<{ x: number; y: number }>();
    private onCollectFruit = new Subject<{fruit: FruitView}>();
    private onDamage = new Subject<{ value: number }>();
    private onCollectScores = new Subject<{ value: number }>();

    constructor(ctx: GameCtx) {
        this.ctx = ctx;

        this.lives.value = ctx.lives;

        this.lifecycle = new GameLifecycle({
            lives: this.lives,
            scores: this.scores,
        });

        this.initializeInput();
        this.initializeBucket();
        this.initializeFruits();
        this.initializeEvents();
        this.initializeUI();
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
            onCollectFruit: this.onCollectFruit,
        });
    }

    private initializeFruits() {
        this.fruitsRoot = new FruitsRoot({
            fruitsSpawns: this.ctx.fruitsSpawns,
            fruitsPrefabs: this.ctx.fruitsPrefabs,
            spawnFrequencySec: this.ctx.spawnFrequencySec,
            parent: this.ctx.parent,
            onCollectFruit: this.onCollectFruit,
            onDamage: this.onDamage,
            onCollectScores: this.onCollectScores,
        });
    }

    private initializeEvents() {
        this.onDamage.subscribe(({ value }) => {
            this.lives.value = Math.max(0, this.lives.value - value);
        });

        this.onCollectScores.subscribe(({ value }) => {
            this.scores.value = this.scores.value + value;
        });
    }

    private initializeUI() {
        this.uiRoot = new UIRoot({
            parent: this.ctx.parent,
            coreWindow: this.ctx.coreWindow,
            lifecycle: this.lifecycle,
            scores: this.scores,
            lives: this.lives,
            root: this.ctx.parent
        });
    }

    destroy() {
        this.bucketRoot?.destroy();
        this.inputPm?.destroy();
        this.uiRoot?.destroy();
    }
}
