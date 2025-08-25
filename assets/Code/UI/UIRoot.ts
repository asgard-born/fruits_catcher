import { Node, Prefab, instantiate } from "cc";
import { CoreWindow, CoreWindowCtx } from "./CoreWindow";
import { GameLifecycleSystem } from "../GameLifecycleSystem";
import { ReactiveProperty } from "../Utils/ReactiveProperty";
import { Subject } from "../Utils/Subject";

export type UIRootCtx = {
  parent: Node;
  coreWindow: Prefab;
  lifecycle: GameLifecycleSystem;
  lives: ReactiveProperty<number>;
  scores: ReactiveProperty<number>;
  root: Node;
  onRestart: Subject<void>;
  onGameOver: Subject<void>;
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
    
    this.coreWindow.initialize({
      scores: this.ctx.scores,
      lives: this.ctx.lives,
      root: this.ctx.root,
      onRestart: this.ctx.onRestart,
      onGameOver: this.ctx.onGameOver
    });
  }

  public destroy() {
    this.coreWindow?.destroy();
  }
}
