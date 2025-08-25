import { Node, Prefab } from "cc";
import { InputControlsPm } from "./InputControls/InputControlsPm";
import { BucketRoot } from "./Bucket/BucketRoot";
import { Subject } from "./Utils/Subject";
import { ReactiveProperty } from "./Utils/ReactiveProperty";
import { FruitsRoot } from "./Fruits/FruitsRoot";
import { GameLifecycleSystem } from "./GameLifecycleSystem";
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
    initialLives: number;
    coreWindow: Prefab;
    speed: number;
};

export class GameRoot {
    private ctx: GameCtx;
    private inputPm: InputControlsPm;
    private bucketRoot: BucketRoot;
    private fruitsRoot: FruitsRoot;
    private lifecycle: GameLifecycleSystem;
    private uiRoot: UIRoot;

    private lives = new ReactiveProperty(0);
    private scores = new ReactiveProperty(0);
    private isOnPause = new ReactiveProperty(false);

    private onLeftMouseButtonDown = new Subject<{ x: number; y: number }>();
    private onLeftMouseButtonUp = new Subject<{ x: number; y: number }>();
    private onMouseMove = new Subject<{ x: number; y: number }>();
    private onCollectFruit = new Subject<{ fruit: FruitView }>();
    private onDamage = new Subject<{ value: number }>();
    private onCollectScores = new Subject<{ value: number }>();
    private onRestart = new Subject<void>();
    private onGameOver = new Subject<void>();

    constructor(ctx: GameCtx) {
        this.ctx = ctx;

        this.lives.value = ctx.initialLives;

        this.initializeGameSystem();
        this.initializeInput();
        this.initializeBucket();
        this.initializeFruits();
        this.initializeEvents();
        this.initializeUI();
    }

    private initializeGameSystem() {
        this.lifecycle = new GameLifecycleSystem({
            lives: this.lives,
            scores: this.scores,
            isOnPause: this.isOnPause,
            onRestart: this.onRestart,
            initialLives: this.ctx.initialLives,
            onGameOver: this.onGameOver
        });
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
            isOnPause: this.isOnPause,
            speed: this.ctx.speed,
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
            root: this.ctx.parent,
            onRestart: this.onRestart,
            onGameOver: this.onGameOver
        });
    }

    destroy() {
        this.bucketRoot?.destroy();
        this.inputPm?.destroy();
        this.uiRoot?.destroy();
    }
}
