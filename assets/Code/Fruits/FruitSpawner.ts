import { Node, Vec3, director } from "cc";

export class FruitSpawner {
    private nodes: Node[];
    private speed: number;
    private gravity: number;

    constructor(nodes: Node[], speed: number = 0, gravity: number = 300) {
        this.nodes = nodes;
        this.speed = speed;
        this.gravity = gravity;

        director.on('update', this.tick, this);
    }

    private tick(dt: number) {
        this.speed -= this.gravity * dt;

        this.nodes.forEach(node => {
            const pos = node.position;
            node.setPosition(new Vec3(pos.x, pos.y + this.speed * dt, pos.z))
        });
    }

    destroy() {
        director.off('update', this.tick, this);
    }
}
