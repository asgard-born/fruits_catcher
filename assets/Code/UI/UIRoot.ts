import { Node, Prefab, instantiate, _decorator } from "cc";
import { CoreWindow } from "./CoreWindow";
import { GameLifecycle } from "../GameLifecycle";
import { ReactiveProperty } from "../Utils/ReactiveProperty";

export type UIRootCtx = {
    parent: Node;
    coreWindow: Prefab;
    lifecycle: GameLifecycle;
    lives: ReactiveProperty<number>;
    scores: ReactiveProperty<number>;
};

export class UIRoot {
    private ctx: UIRootCtx;
    private coreWindow: CoreWindow;

    constructor(ctx: UIRootCtx) {
        this.ctx = ctx;
        this.initialize();
    }

    private initialize() {
        const coreWindow = instantiate(this.ctx.coreWindow);
        coreWindow.parent = this.ctx.parent;

        this.coreWindow = coreWindow.getComponent(CoreWindow)!;
        this.coreWindow.initialize(this.ctx.lifecycle, this.ctx.scores);
    }

    public destroy() {
        this.coreWindow?.destroy();
    }
}
