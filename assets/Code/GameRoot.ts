import { Node, Prefab } from "cc";
import { InputControlsPm } from "./InputControls/InputControlsPm";
import { BucketRoot } from "./Bucket/BucketRoot";
import { Subject } from "./Utils/Subject";
import { ReactiveProperty } from "./Utils/ReactiveProperty";
import { FruitsRoot } from "./Fruits/FruitsRoot";
import { GameStateController } from "./GameStateController";
import { UIRoot } from "./UI/UIRoot";
import { FruitView } from "./Fruits/FruitViews/FruitView";

/**
 * Initial Game Context
 */
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
    initialSeconds: number
};

export class GameRoot {
    private ctx: GameCtx;
    private inputPm: InputControlsPm;
    private bucketRoot: BucketRoot;
    private lifecycle: GameStateController;
    private uiRoot: UIRoot;

    private lives = new ReactiveProperty(0);
    private scores = new ReactiveProperty(0);
    private counter = new ReactiveProperty(0);
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

        this.initializeRx();
        this.initializeGameStateController();
        this.initializeInput();
        this.initializeBucket();
        this.initializeFruits();
        this.initializeUI();
    }

    private initializeRx() {
        this.lives.value = this.ctx.initialLives;
        this.counter.value = this.ctx.initialSeconds;

        this.onDamage.subscribe(({ value }) => {
            this.lives.value = Math.max(0, this.lives.value - value);
        });

        this.onCollectScores.subscribe(({ value }) => {
            this.scores.value = this.scores.value + value;
        });
    }

    private initializeGameStateController() {
        this.lifecycle = new GameStateController({
            lives: this.lives,
            scores: this.scores,
            isOnPause: this.isOnPause,
            onRestart: this.onRestart,
            initialLives: this.ctx.initialLives,
            onGameOver: this.onGameOver,
            initialSeconds: this.ctx.initialSeconds,
            counter: this.counter
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
        new FruitsRoot({
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

    private initializeUI() {
        this.uiRoot = new UIRoot({
            parent: this.ctx.parent,
            coreWindow: this.ctx.coreWindow,
            lifecycle: this.lifecycle,
            scores: this.scores,
            lives: this.lives,
            root: this.ctx.parent,
            onRestart: this.onRestart,
            onGameOver: this.onGameOver,
            counter: this.counter
        });
    }

    destroy() {
        this.bucketRoot?.destroy();
        this.inputPm?.destroy();
        this.uiRoot?.destroy();
    }
}
