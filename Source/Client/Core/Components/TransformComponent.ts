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

    public GetScale(): Vector3 {
        return this.scale;
    }

    public SetScale(scale: Vector3) {
        this.scale = scale;
    }

    public GetRotation(): Vector3 {
        return this.rotation;
    }

    public SetRotation(rotation: Vector3) {
        this.rotation = rotation;
    }

    public override Update(deltaTime: number) {
        
    }
}