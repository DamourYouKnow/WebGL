import RenderComponent from "./RenderComponent";

export default class StaticMeshComponent extends RenderComponent {
    public override Render(context: WebGLRenderingContext) {
        throw new Error("Method not implemented.");
    }
}
