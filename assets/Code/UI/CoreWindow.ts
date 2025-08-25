import { Node } from "cc";
import { _decorator, Component, RichText } from "cc";
import { ReactiveProperty } from "../Utils/ReactiveProperty";
import { GameOverView } from "./GameOverView";
import { Subject } from "../Utils/Subject";

const { ccclass, property } = _decorator;

export type CoreWindowCtx = {
  scores: ReactiveProperty<number>;
  lives: ReactiveProperty<number>;
  root: Node;
  onRestart: Subject<void>;
  onGameOver: Subject<void>;
};

@ccclass("CoreWindow")
export class CoreWindow extends Component {
  @property(RichText)
  scoreText: RichText = null;

  @property(RichText)
  livesText: RichText = null;

  @property(GameOverView)
  gameOverView: GameOverView = null;

  private ctx: CoreWindowCtx;

  public initialize(ctx: CoreWindowCtx) {
    this.ctx = ctx;

    this.ctx.scores.subscribe((val) => {
      if (this.scoreText) {
        this.scoreText.string = `${val}`;
      }
    });

    this.ctx.onGameOver.subscribe(() => {
      this.showGameOver();
    });

    this.ctx.lives.subscribe((val) => {
      if (this.livesText) {
        this.livesText.string = `${val}`;
      }
    });

    if (this.gameOverView) {
      this.gameOverView.initialize({
        root: this.ctx.root,
        onRestart: this.ctx.onRestart
      });
    }
  }

  private showGameOver() {
    if (this.gameOverView) {
      this.gameOverView.show();
    }
  }
}
