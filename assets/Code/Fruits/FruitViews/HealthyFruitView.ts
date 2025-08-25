import { _decorator, Vec3 } from 'cc';
import { FruitView } from './FruitView';

const { ccclass } = _decorator;

@ccclass('HealthyFruit')
export class HealthyFruit extends FruitView {
    public fall(deltaTime: number, speed: number) {
        const pos = this.node.position;
        this.node.setPosition(new Vec3(pos.x, pos.y - speed * deltaTime, pos.z));
    }
}
