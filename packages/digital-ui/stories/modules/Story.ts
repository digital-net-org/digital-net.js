import { type TemplateResult, render } from 'lit';

export abstract class Story {
    public abstract title: string | null;
    public category?: string | null;

    /**
     * Return a pretty-printed JSON string for display in the story.
     */
    public static toJson = (value: any) => JSON.stringify(value, null, 4);

    /**
     * Renders the story's template into the provided HTML element.
     * @param element
     */
    public renderIn(element: HTMLElement) {
        render(this.render(), element);
        this.onRender?.(element);
    }

    /**
     * Implement this method to return the template for your story using the `html` function from `lit`.
     */
    public abstract render(): TemplateResult;

    /**
     * Implement this event on stories with reactive state to trigger a re-render on change.
     */
    public onUpdate?: () => void;

    /**
     * Implement this event to trigger any side effects after the story has rendered.
     * @param element The container where the story was rendered.
     */
    public onRender?: (element: HTMLElement) => void;

    protected requestUpdate() {
        this.onUpdate?.();
    }
}
