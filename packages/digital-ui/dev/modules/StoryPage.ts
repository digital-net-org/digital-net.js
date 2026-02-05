import { type TemplateResult, render } from 'lit';
import { Story } from './Story';
import { StoryError } from './StoryError';

export class StoryPage {
    private static storyModules: Record<string, unknown> = import.meta.glob('../stories/**/*.stories.ts', {
        eager: true,
    });

    private pageElements: {
        nav: HTMLElement;
        preview: HTMLDivElement;
        title: HTMLTitleElement;
        themeLightBtn: HTMLButtonElement;
        themeDarkBtn: HTMLButtonElement;
    };

    public constructor() {
        const nav = document.getElementById('nav');
        const preview = document.getElementById('preview') as HTMLDivElement | null;
        const title = document.getElementById('title') as HTMLTitleElement | null;
        const themeLightBtn = document.getElementById('theme-light') as HTMLButtonElement | null;
        const themeDarkBtn = document.getElementById('theme-dark') as HTMLButtonElement | null;

        if (!nav || !preview || !title || !themeLightBtn || !themeDarkBtn) {
            throw new StoryError('Required page elements not found');
        }
        this.pageElements = { nav, preview, title, themeLightBtn, themeDarkBtn };
        this.setTitle();
        this.initialize();
    }

    /**
     * Sets the page title. If no title is provided, it defaults to the document's title.
     * @param title
     */
    public setTitle = (title?: string) => (this.pageElements.title.innerText = title ?? document.title);

    /**
     * Renders the provided template into the preview area. If no template is provided, it clears the preview.
     * @param template
     */
    public setPreview = (template?: TemplateResult) => render(template ?? '', this.pageElements.preview);

    /**
     * Initializes the story page by loading all story modules, creating navigation buttons, and setting up
     * click handlers to display the corresponding story templates.
     */
    public initialize() {
        for (const path in StoryPage.storyModules) {
            const mod = StoryPage.storyModules[path] as any;

            for (const exportName in mod) {
                const ExportedItem = mod[exportName];

                if (typeof ExportedItem !== 'function' || !(ExportedItem.prototype instanceof Story)) {
                    continue;
                }

                const story = new ExportedItem() as Story;
                const name = story.title || exportName;
                const template = story.render();
                this.buildStoryNavigation({ name, category: story.category || undefined, template });
            }
        }
        this.initializeTheme();
    }

    /**
     * Builds a navigation button for a story and appends it to the navigation area. If a category is provided,
     * the button is nested under a collapsible details element.
     * @param payload
     */
    public buildStoryNavigation(payload: { name: string; category?: string; template: TemplateResult }) {
        const btn = document.createElement('button');
        btn.className = 'nav-item';
        btn.textContent = payload.name;
        btn.id = payload.name;

        btn.onclick = e => {
            const target = e.target as HTMLButtonElement | null;
            if (!target) {
                return;
            }
            if (target.id !== payload.name || !target.className.includes('active')) {
                document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
                target.classList.add('active');
                this.setTitle(
                    [...(payload.category ? [payload.category] : []), payload.name].filter(Boolean).join('/')
                );
                this.setPreview(payload.template);
            } else {
                target.classList.remove('active');
                this.setTitle();
                this.setPreview();
            }
        };

        let element: HTMLButtonElement | HTMLDetailsElement = btn;
        if (payload.category) {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = payload.category;
            details.appendChild(summary);
            details.appendChild(btn);
            element = details;
        }

        this.pageElements.nav.appendChild(element);
    }

    private initializeTheme() {
        this.pageElements.themeLightBtn.addEventListener('click', () => {
            document.body.setAttribute('data-theme', 'dark');
            window.localStorage.setItem('theme', 'dark');
        });
        this.pageElements.themeDarkBtn.addEventListener('click', () => {
            document.body.setAttribute('data-theme', 'light');
            window.localStorage.setItem('theme', 'light');
        });

        const initialTheme = window.localStorage.getItem('theme');
        if (initialTheme) {
            document.body.setAttribute('data-theme', initialTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            window.localStorage.setItem('theme', 'dark');
            document.body.setAttribute('data-theme', 'dark');
        } else {
            window.localStorage.setItem('theme', 'light');
            document.body.setAttribute('data-theme', 'light');
        }
    }
}
