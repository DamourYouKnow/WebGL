import { Component } from "./Component";
import { Vector3 } from "../Math/Vector";

export class TransformComponent extends Component {
    private position: Vector3;

    public GetScenePosition(): Vector3 {
        return this.position;
    }

    public SetScenePosition(position: Vector3) {
        this.position = position;
    }

    public Update(deltaTime: number) {
        
    }
}