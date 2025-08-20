import Entity from './Entity';

export default class Scene {
    private name: string;

    private entities: Entity[];

    public constructor(name: string) {
        this.name = name;
    }

    public Update(deltaTime: number) {
        for (const entity of this.entities) {
            entity.Update(deltaTime);
        }
    }

    public Render() {

    }
}