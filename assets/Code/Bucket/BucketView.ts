import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact, Node } from 'cc';
import { FruitView, } from '../Fruits/FruitViews/FruitView';
import { Subject } from "../Utils/Subject";

const { ccclass } = _decorator;

export type BucketViewCtx = {
    onCollectFruit: Subject<{ fruit: FruitView }>;
};

@ccclass('BucketView')
export class BucketView extends Component {
    private ctx: BucketViewCtx;
    private collider: Collider2D | null = null;

    public Initialize(ctx: BucketViewCtx) {
        this.ctx = ctx;
    }

    protected onLoad(): void {
        this.collider = this.getComponent(Collider2D);

        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private onBeginContact(self: Collider2D, other: Collider2D, contact: IPhysics2DContact | null) {
        const fruit = other.node.getComponent(FruitView);

        if (fruit) {
            this.ctx.onCollectFruit.next({ fruit: fruit });
        }
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}
