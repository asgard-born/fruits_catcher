import { Node, Vec3 } from "cc";

export type FruitsBehaviourSystemCtx = {
    fruits: Node[];   
    speed: number;    
    tickIntervalMs: number;
};

export class FruitsBehaviourSystem {
    private ctx: FruitsBehaviourSystemCtx;
    private intervalId: number | null = null;

    constructor(ctx: FruitsBehaviourSystemCtx) {
        this.ctx = ctx;
        this.startBehaveLoop();
    }

    private startBehaveLoop() {
        const interval = this.ctx.tickIntervalMs;
        
        this.intervalId = window.setInterval(() => {
            this.behave(interval / 1000);
        }, interval);
    }

    private behave(deltaTime: number) {
        this.ctx.fruits.forEach(node => {
            if (!node.isValid) return;

            const pos = node.position;
            node.setPosition(new Vec3(pos.x, pos.y - this.ctx.speed * deltaTime, pos.z));
        });
    }

    destroy() {
        if (this.intervalId !== null) {
            window.clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
