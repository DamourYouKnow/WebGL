import Component from "./Component";

export default abstract class RenderComponent extends Component {
    public abstract Render(context: WebGLRenderingContext);
}