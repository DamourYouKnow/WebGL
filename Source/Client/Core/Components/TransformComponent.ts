import { Vector3 } from "../Math/Vector";
import BehaviorComponent from "./BehaviorComponent";

export default class TransformComponent extends BehaviorComponent {
    private position: Vector3;
    private scale: Vector3;
    private rotation: Vector3;

    public GetPosition(): Vector3 {
        return this.position;
    }

    public SetPosition(position: Vector3) {
        this.position = position;
    }

    public override Update(deltaTime: number) {
        
    }
}