import { _decorator, Component, Button, Node } from "cc";
import { GameRoot } from "../GameRoot";

const { ccclass, property } = _decorator;

export type GameOverViewCtx = {
  root: Node;
};

@ccclass("GameOverView")
export class GameOverView extends Component {
  @property(Button)
  restartButton: Button = null;

  private ctx: GameOverViewCtx;
  private onRestart: () => void;

  public initialize(ctx: GameOverViewCtx) {
    this.ctx = ctx;
  }

  onLoad() {
    if (this.restartButton) {
      this.restartButton.node.on(Button.EventType.CLICK, this.handleRestart, this);
    }
    this.hide();
  }

  public show(onRestart: () => void) {
    this.onRestart = onRestart;
    this.node.active = true;
  }

  private handleRestart() {
    this.hide();
    if (this.onRestart) {
      this.onRestart();
    }
  }

  public hide() {
    this.node.active = false;
  }
}
