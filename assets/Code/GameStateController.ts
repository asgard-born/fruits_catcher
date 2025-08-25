import { director, profiler } from "cc";
import { Subject } from "./Utils/Subject";
import { ReactiveProperty } from "./Utils/ReactiveProperty";

export type GameStateControllerCtx = {
  lives: ReactiveProperty<number>;
  scores: ReactiveProperty<number>;
  isOnPause: ReactiveProperty<boolean>;
  initialLives: number
  onRestart: Subject<void>;
  onGameOver: Subject<void>;
};

export class GameStateController {
  private ctx: GameStateControllerCtx;

  constructor(ctx: GameStateControllerCtx) {
    this.ctx = ctx;
profiler.hideStats();

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
    director.resume();
    this.ctx.lives.value = this.ctx.initialLives;
    this.ctx.scores.value = 0;
    this.ctx.isOnPause.value = false;
  }
}
