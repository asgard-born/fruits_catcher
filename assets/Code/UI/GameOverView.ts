import { _decorator, Component, Node, Button } from "cc";

const { ccclass, property } = _decorator;

@ccclass("GameOverView")
export class GameOverView extends Component {
  @property(Node)
  root: Node = null;

  @property(Button)
  restartButton: Button = null;

  private onRestart: () => void;

  onLoad() {
    if (this.restartButton) {
      this.restartButton.node.on(Button.EventType.CLICK, this.handleRestart, this);
    }
    this.hide();
  }

  public show(onRestart: () => void) {
    this.onRestart = onRestart;
    if (this.root) {
      this.root.active = true;
    }
  }

  private handleRestart() {
    this.hide();
    if (this.onRestart) {
      this.onRestart();
    }
  }

  public hide() {
    if (this.root) {
      this.root.active = false;
    }
  }
}
