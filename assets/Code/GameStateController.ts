import { director, profiler } from "cc";
import { Subject } from "./Utils/Subject";
import { ReactiveProperty } from "./Utils/ReactiveProperty";

export type GameStateControllerCtx = {
  lives: ReactiveProperty<number>;
  scores: ReactiveProperty<number>;
  counter: ReactiveProperty<number>;
  isOnPause: ReactiveProperty<boolean>;
  initialLives: number;
  initialSeconds: number;
  onRestart: Subject<void>;
  onGameOver: Subject<void>;
};

export class GameStateController {
  private ctx: GameStateControllerCtx;
  private intervalId: number | null = null;

  constructor(ctx: GameStateControllerCtx) {
    this.ctx = ctx;
    profiler.hideStats();

    this.startTimer();

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

  private startTimer() {
    this.clearTimer();
    this.ctx.counter.value = this.ctx.initialSeconds;

    this.intervalId = window.setInterval(() => {
      if (!this.ctx.isOnPause.value) {
        this.ctx.counter.value -= 1;

        if (this.ctx.counter.value <= 0) {
          this.ctx.counter.value = 0;
          this.pauseGame();
          this.ctx.onGameOver.next();
          this.clearTimer();
        }
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private pauseGame() {
    director.pause();
    this.ctx.isOnPause.value = true;
  }

  private restartGame() {
    director.resume();
    this.ctx.lives.value = this.ctx.initialLives;
    this.ctx.scores.value = 0;
    this.ctx.counter.value = this.ctx.initialSeconds;
    this.ctx.isOnPause.value = false;
    this.startTimer();
  }

  destroy() {
    this.clearTimer();
  }
}
