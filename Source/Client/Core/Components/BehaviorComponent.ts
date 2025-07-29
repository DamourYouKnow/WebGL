import Component from "./Component";

export default abstract class BehaviorComponent extends Component {
    public abstract Update(deltaTime: number);
}