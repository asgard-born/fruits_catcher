import { director } from "cc";
import { Subject } from "./Utils/Subject";
import { ReactiveProperty } from "./Utils/ReactiveProperty";

export type GameLifecycleSystemCtx = {
  lives: ReactiveProperty<number>;
  scores: ReactiveProperty<number>;
  isOnPause: ReactiveProperty<boolean>;
};

export class GameLifecycleSystem {
  private ctx: GameLifecycleSystemCtx;

  public readonly onGameOver = new Subject<void>();

  constructor(ctx: GameLifecycleSystemCtx) {
    this.ctx = ctx;

    this.ctx.lives.subscribe((value) => {
      if (value <= 0) {
        this.pauseGame();
        this.onGameOver.next();
      }
    });
  }

  private pauseGame() {
    director.pause();
    this.ctx.isOnPause.value = true;
  }

  public restartGame(initialLives: number) {
    this.ctx.lives.value = initialLives;
    this.ctx.scores.value = 0;
    this.ctx.isOnPause.value = false;
  }
}
