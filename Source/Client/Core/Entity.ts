import Component from "./Components/Component";
import StaticMeshComponent from "./Components/StaticMeshComponent";
import TransformComponent from "./Components/TransformComponent";



export default class Entity {
    private components: Component[];

    public constructor() {
        this.components = [];
    }

    public AddComponent<TComponent extends Component>(
        component: TComponent
    ): TComponent {
        this.components.push(component);
        return component;
    }

    // TODO: Explicitly define parameters instead of using any type
    public CreateComponent<TComponent extends Component>(
        creator: new(...args: any[]) => TComponent,
        ...args: any[]
    ): TComponent {
        const component = new creator(...args);
        return this.AddComponent(component);
    }

    public RemoveComponent(component: Component) {

    }

    // TODO: Figure out how to encapsule so that this function can only be 
    // called in the App Update() loop.
    public Update(deltaTime: number) {
        for (const component of this.components) {
            // component.Update(deltaTime);
        }
    }
}