import { _decorator, Component, Label, Node, RichText } from "cc";
import { GameLifecycle } from "../GameLifecycle";
import { ReactiveProperty } from "../Utils/ReactiveProperty";
import { GameOverView } from "./GameOverView";

const { ccclass, property } = _decorator;

@ccclass("CoreWindow")
export class CoreWindow extends Component {
  @property(RichText)
  scoreText: RichText = null;

  @property(RichText)
  lives: RichText = null;

  @property(GameOverView)
  gameOverView: GameOverView = null;

  private lifecycle: GameLifecycle;

  public initialize(lifecycle: GameLifecycle, scores: ReactiveProperty<number>) {
    this.lifecycle = lifecycle;

    scores.subscribe((val) => {
      if (this.scoreText) {
        this.scoreText.string = `Score: ${val}`;
      }
    });

    lifecycle.onGameOver.subscribe(() => {
      this.showGameOver();
    });
  }

  private showGameOver() {
    if (this.gameOverView) {
      this.gameOverView.show(() => {
        this.lifecycle.restartGame(3);
      });
    }
  }
}
