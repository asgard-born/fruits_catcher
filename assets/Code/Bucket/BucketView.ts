import { _decorator, Component, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { FruitView } from '../Fruits/FruitView';
import { DangerFruitView } from '../Fruits/DangerFruitView';

const { ccclass } = _decorator;

@ccclass('BucketView')
export class BucketView extends Component {
    private collider: Collider2D;

    protected onLoad(): void {
        this.collider = this.getComponent(Collider2D);

        if (this.collider) {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }

    private isDangerFruit(fruit: FruitView): fruit is DangerFruitView {
        return fruit instanceof DangerFruitView;
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null): void {
        const fruit = otherCollider.node.getComponent(FruitView);
        let isDangerous = false;

        console.log("FRUIT CATCH!!!");

        if (this.isDangerFruit(fruit)) {
            isDangerous = true;
        }

        if (fruit) {

            this.collectFruit(fruit);
        }
    }

    private collectFruit(fruit: FruitView): void {
        fruit.node.destroy();
    }

    protected onDestroy(): void {
        if (this.collider) {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
    }
}