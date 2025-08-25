import { Node } from "cc";
import { _decorator, Component, RichText } from "cc";
import { GameLifecycleSystem } from "../GameLifecycleSystem";
import { ReactiveProperty } from "../Utils/ReactiveProperty";
import { GameOverView, GameOverViewCtx } from "./GameOverView";
import { GameRoot } from "../GameRoot";

const { ccclass, property } = _decorator;

export type CoreWindowCtx = {
  lifecycle: GameLifecycleSystem;
  scores: ReactiveProperty<number>;
  lives: ReactiveProperty<number>;
  root: Node;
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

    // Подписка на очки
    this.ctx.scores.subscribe((val) => {
      if (this.scoreText) {
        this.scoreText.string = `${val}`;
      }
    });

    // Подписка на жизни
    this.ctx.lives.subscribe((val) => {
      if (this.livesText) {
        this.livesText.string = `${val}`;
      }
    });

    if (this.gameOverView) {
      const govCtx: GameOverViewCtx = { root: this.ctx.root };
      this.gameOverView.initialize(govCtx);
    }

    this.ctx.lifecycle.onGameOver.subscribe(() => {
      this.showGameOver();
    });
  }

  private showGameOver() {
    if (this.gameOverView) {
      this.gameOverView.show(() => {
        this.ctx.lifecycle.restartGame(3);
      });
    }
  }
}
