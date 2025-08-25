import { Node, UITransform, Vec2, Camera, director, Vec3 } from "cc";
import { Subject } from "../Utils/Subject";

export type BucketPmCtx = {
    bucketNode: Node;
    onLeftMouseButtonDown: Subject<{ x: number; y: number }>;
    onLeftMouseButtonUp: Subject<{ x: number; y: number }>;
    onMouseMove: Subject<{ x: number; y: number }>;
};

/**
 * Bucket Presentation Model contains business logic for bucket view
 */
export class BucketPm {
    private bucketNode: Node;
    private dragging = false;
    private offsetX = 0;
    private camera: Camera;
    private unsubscribers: (() => void)[] = [];

    constructor(ctx: BucketPmCtx) {
        this.bucketNode = ctx.bucketNode;

        this.camera = director.getScene().getComponentInChildren(Camera)!;

        this.unsubscribers.push(
            ctx.onLeftMouseButtonDown.subscribe(({ x, y }) => this.onMouseDown(x, y)),
            ctx.onLeftMouseButtonUp.subscribe(() => this.onMouseUp()),
            ctx.onMouseMove.subscribe(({ x, y }) => this.onMouseMove(x, y)),
        );
    }

    private onMouseDown(x: number, y: number) {
        const ui = this.bucketNode.getComponent(UITransform);
        if (!ui) return;

        const clickPos = new Vec2(x, y);

        if (ui.hitTest(clickPos)) {
            this.dragging = true;

            const worldClick = this.camera.screenToWorld(new Vec3(x, y, 0));
            this.offsetX = this.bucketNode.worldPosition.x - worldClick.x;
        }
    }
    
    private onMouseUp() {
        this.dragging = false;
    }

    private onMouseMove(x: number, y: number) {
        if (!this.dragging) return;

        const worldClick = this.camera.screenToWorld(new Vec3(x, y, 0));
        
        this.bucketNode.setWorldPosition(
            new Vec3(worldClick.x + this.offsetX, this.bucketNode.worldPosition.y, 0)
        );
    }

    destroy() {
        this.unsubscribers.forEach(unsub => unsub());
        this.unsubscribers = [];
    }
}
