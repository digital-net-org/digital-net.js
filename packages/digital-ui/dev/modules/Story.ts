import type { TemplateResult } from 'lit';

export abstract class Story {
    public abstract title: string | null;
    public category?: string | null;
    public abstract render(): TemplateResult;
}
