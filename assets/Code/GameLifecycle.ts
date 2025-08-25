import { director } from "cc";
import { Subject } from "./Utils/Subject";
import { ReactiveProperty } from "./Utils/ReactiveProperty";

export type GameLifecycleCtx = {
  lives: ReactiveProperty<number>;
  scores: ReactiveProperty<number>;
};

export class GameLifecycle {
  private ctx: GameLifecycleCtx;

  public readonly onGameOver = new Subject<void>();

  constructor(ctx: GameLifecycleCtx) {
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
  }

  public restartGame(initialLives: number) {
    this.ctx.lives.value = initialLives;
    this.ctx.scores.value = 0;
    director.resume();
  }
}
