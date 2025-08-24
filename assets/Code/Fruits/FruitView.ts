import { _decorator, Component, Prefab } from 'cc';
import { FruitType, FruitTypeEnum } from './FruitType';

const { ccclass, property } = _decorator;

@ccclass('FruitView')
export class FruitView extends Component {
    @property({ type: FruitTypeEnum })
    fruitType: FruitType = FruitType.None;

    private onAddToBucket() {
        ;
    }
}
