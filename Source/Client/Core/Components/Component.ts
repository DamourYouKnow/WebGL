import Entity from "../Entity";

export default abstract class Component {
    private entity: Entity;

    public constructor(entity: Entity) {
        this.entity = entity;
    }

    public SetEntity(entity: Entity) {
        // TODO: Remove component from previous entity if it exists
        this.entity = entity;
    }
}