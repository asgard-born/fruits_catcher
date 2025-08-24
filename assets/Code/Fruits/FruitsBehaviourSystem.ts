import { Node, Vec3, director } from "cc";

export type FruitsBehaviourSystemCtx = {
    fruits: Node[];
    speed: number;
};

export class FruitsBehaviourSystem {
    private ctx: FruitsBehaviourSystemCtx;

    constructor(ctx: FruitsBehaviourSystemCtx) {
        this.ctx = ctx;

        director.on("update", this.onUpdate, this);
    }

    private onUpdate(deltaTime: number) {
        this.ctx.fruits.forEach(node => {

            const pos = node.position;
            node.setPosition(new Vec3(pos.x, pos.y - this.ctx.speed * deltaTime, pos.z));
        });
    }

    destroy() {
        director.off("update", this.onUpdate, this);
    }
}
