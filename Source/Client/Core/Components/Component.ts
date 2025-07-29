import { Entity } from "../Entity";

export abstract class Component {
    private entity: Entity;

    public constructor(entity: Entity) {
        this.entity = entity;
    }

    public Update(deltaTime: number) {

    }

    public SetEntity(entity: Entity) {
        // TODO: Remove component from previous entity if it exists
        this.entity = entity;
    }
}