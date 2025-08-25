import { Node, Prefab, instantiate } from "cc";
import { CoreWindow, CoreWindowCtx } from "./CoreWindow";
import { GameLifecycleSystem } from "../GameLifecycleSystem";
import { ReactiveProperty } from "../Utils/ReactiveProperty";

export type UIRootCtx = {
  parent: Node;
  coreWindow: Prefab;
  lifecycle: GameLifecycleSystem;
  lives: ReactiveProperty<number>;
  scores: ReactiveProperty<number>;
  root: Node;
};

export class UIRoot {
  private ctx: UIRootCtx;
  private coreWindow: CoreWindow;

  constructor(ctx: UIRootCtx) {
    this.ctx = ctx;
    this.initialize();
  }

  private initialize() {
    const coreWindowNode = instantiate(this.ctx.coreWindow);
    coreWindowNode.parent = this.ctx.parent;

    this.coreWindow = coreWindowNode.getComponent(CoreWindow)!;

    const cwCtx: CoreWindowCtx = {
      lifecycle: this.ctx.lifecycle,
      scores: this.ctx.scores,
      lives: this.ctx.lives,
      root: this.ctx.root,
    };

    this.coreWindow.initialize(cwCtx);
  }

  public destroy() {
    this.coreWindow?.destroy();
  }
}
