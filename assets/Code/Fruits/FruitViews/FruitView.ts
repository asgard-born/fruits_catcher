import { _decorator, Component } from 'cc';
import { FruitType, FruitTypeEnum } from '../FruitType';

const { ccclass, property } = _decorator;

@ccclass('FruitView')
export class FruitView extends Component {
    @property({ type: FruitTypeEnum })
    public fruitType: FruitType = FruitType.None;

    @property(Number)
    public scores: number = 100;

    public fall(deltaTime: number, speed: number): void {
        
    }
}
