import { _decorator, Component, Prefab, Node, Vec3 } from "cc";
import { GameRoot, GameCtx } from "./GameRoot";

const { ccclass, property } = _decorator;

@ccclass("EnterPoint")
export class EnterPoint extends Component {
    @property(Prefab)
    bucketPrefab: Prefab = null;

    @property(Node)
    uiRoot: Node = null;

    @property(Prefab)
    coreWindow: Prefab = null;

    @property(Node)
    spawnPoint: Node = null;

    @property(Node)
    parentNode: Node = null;

    @property(Number)
    spawnFrequencySec: number = 0.6;

    @property(Number)
    fallingSpeed: number = 120;

    @property(Number)
    lives: number = 3;

    @property([Node])
    fruitsSpawns: Node[] = [];

    @property([Prefab])
    fruitsPrefabs: Prefab[] = [];

    private gameRoot: GameRoot;

    start() {
        if (!this.spawnPoint) {
            console.warn("SpawnPoint не назначен, будет использована позиция EnterPoint");
            this.spawnPoint = this.node;
        }

        const gameCtx: GameCtx = {
            bucketPrefab: this.bucketPrefab,
            parent: this.parentNode,
            spawnPoint: this.spawnPoint,
            fruitsSpawns: this.fruitsSpawns,
            fruitsPrefabs: this.fruitsPrefabs,
            uiRoot: this.uiRoot,
            spawnFrequencySec: this.spawnFrequencySec,
            initialLives: this.lives,
            coreWindow: this.coreWindow,
            speed: this.fallingSpeed
        };

        this.gameRoot = new GameRoot(gameCtx);
    }

    onDestroy() {
        this.gameRoot?.destroy();
    }
}
