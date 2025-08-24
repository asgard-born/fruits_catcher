import { input, Input, EventMouse } from "cc";
import { Subject } from "../Utils/Subject";

export type InputControlsCtx = {
    onLeftMouseButtonDown?: Subject<{ x: number; y: number }>;
    onLeftMouseButtonUp?: Subject<{ x: number; y: number }>;
    onMouseMove?: Subject<{ x: number; y: number }>;
};

export class InputControlsPm {
    public ctx: InputControlsCtx;
    private mouseDown = false;

    constructor(ctx: InputControlsCtx) {
        this.ctx = ctx;

        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    private onMouseDown(event: EventMouse) {
        this.mouseDown = true;
        this.ctx.onLeftMouseButtonDown?.next({
            x: event.getLocationX(),
            y: event.getLocationY(),
        });
    }

    private onMouseUp(event: EventMouse) {
        this.mouseDown = false;
        this.ctx.onLeftMouseButtonUp?.next({
            x: event.getLocationX(),
            y: event.getLocationY(),
        });
    }

    private onMouseMove(event: EventMouse) {
        if (this.mouseDown) {
            this.ctx.onMouseMove?.next({
                x: event.getLocationX(),
                y: event.getLocationY(),
            });
        }
    }

    destroy() {
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
}
