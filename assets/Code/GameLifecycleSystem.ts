import { director } from "cc";
import { Subject } from "./Utils/Subject";
import { ReactiveProperty } from "./Utils/ReactiveProperty";

export type GameLifecycleSystemCtx = {
  lives: ReactiveProperty<number>;
  scores: ReactiveProperty<number>;
  isOnPause: ReactiveProperty<boolean>;
  initialLives: number
  onRestart: Subject<void>;
  onGameOver: Subject<void>;
};

export class GameLifecycleSystem {
  private ctx: GameLifecycleSystemCtx;

  constructor(ctx: GameLifecycleSystemCtx) {
    this.ctx = ctx;

    this.ctx.lives.subscribe((value) => {
      if (value <= 0) {
        this.pauseGame();
        this.ctx.onGameOver.next();
      }
    });

    this.ctx.onRestart.subscribe(() => {
      this.restartGame();
    });
  }

  private pauseGame() {
    director.pause();
    this.ctx.isOnPause.value = true;
  }

  private restartGame() {
    this.ctx.lives.value = this.ctx.initialLives;
    this.ctx.scores.value = 0;
    this.ctx.isOnPause.value = false;
  }
}
