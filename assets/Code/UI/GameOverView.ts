import { _decorator, Component, Button, Node } from "cc";
import { Subject } from "../Utils/Subject";

const { ccclass, property } = _decorator;

export type GameOverViewCtx = {
  root: Node;
  onRestart: Subject<void>;
};

@ccclass("GameOverView")
export class GameOverView extends Component {
  @property(Button)
  restartButton: Button = null;

  private ctx: GameOverViewCtx;

  public initialize(ctx: GameOverViewCtx) {
    this.ctx = ctx;
  }

  onLoad() {
    if (this.restartButton) {
      this.restartButton.node.on(Button.EventType.CLICK, this.handleRestart, this);
    }
    this.hide();
  }

  public show() {
    this.node.active = true;
  }

  private handleRestart() {
    this.ctx.onRestart.next();
    this.hide();
  }

  public hide() {
    this.node.active = false;
  }
}
