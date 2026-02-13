import { render } from 'lit';
import { StoryError } from './StoryError';
import type { Story } from './Story';

export class StoryLayout {
    public nav: HTMLElement;
    public preview: HTMLDivElement;
    public title: HTMLTitleElement;
    public themeLightBtn: HTMLButtonElement;
    public themeDarkBtn: HTMLButtonElement;

    public constructor() {
        const nav = document.getElementById('nav');
        const preview = document.getElementById('preview') as HTMLDivElement | null;
        const title = document.getElementById('title') as HTMLTitleElement | null;
        const themeLightBtn = document.getElementById('theme-light') as HTMLButtonElement | null;
        const themeDarkBtn = document.getElementById('theme-dark') as HTMLButtonElement | null;

        if (!nav || !preview || !title || !themeLightBtn || !themeDarkBtn) {
            throw new StoryError('Required page elements not found');
        }

        this.nav = nav;
        this.preview = preview;
        this.title = title;
        this.themeLightBtn = themeLightBtn;
        this.themeDarkBtn = themeDarkBtn;

        this.setTitle();
        this.initializeTheme();
    }

    /**
     * Sets the page title. If no title is provided, it defaults to the document's title.
     * @param title
     */
    public setTitle = (title?: string) => (this.title.innerText = title ?? document.title);

    /**
     * Renders the provided story into the preview area. If no story is provided, it clears the preview.
     * @param story
     */
    public setPreview = (story?: Story | null | undefined) =>
        story ? story?.renderIn(this.preview) : (this.preview.innerHTML = '');

    /**
     * Set a button as active in the navigation area based on the provided name.
     * @param name The id of the navigation button.
     */
    public selectNavButton(name: string) {
        const btn = this.nav.querySelector(`.nav-item#${name}`);
        const details = btn?.closest('details');
        if (details) {
            details.open = true;
        }

        btn?.classList.add('active');
    }

    /**
     * Unselect all navigation buttons from the navigation area.
     */
    public unselectAllNavButtons() {
        this.nav.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    }

    /**
     * Builds a navigation button for a story and appends it to the appropriate category in the navigation.
     * @param payload An object containing the name, category and the url sync action.
     */
    public buildNavButton(payload: { name: string; category?: string | null | undefined; onSync: () => void }) {
        const btn = document.createElement('button');
        btn.className = 'nav-item';
        btn.textContent = payload.name;
        btn.id = payload.name;
        btn.onclick = () => {
            const params = new URLSearchParams(window.location.search);
            if (params.get('story') === payload.name) {
                params.delete('story');
            } else {
                params.set('story', payload.name);
            }
            window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
            payload.onSync();
        };

        if (payload.category) {
            const summary = this.buildNavSummary(payload.category);
            summary.appendChild(btn);
        } else {
            this.nav.appendChild(btn);
        }
    }

    private buildNavSummary(category: string) {
        let details = this.nav.querySelector(`details[data-category="${category}"]`) as HTMLDetailsElement;

        if (!details) {
            details = document.createElement('details');
            details.dataset.category = category;
            const summary = document.createElement('summary');
            summary.textContent = category;
            details.appendChild(summary);
            this.nav.appendChild(details);
        }
        return details;
    }

    private initializeTheme() {
        this.themeLightBtn.addEventListener('click', () => {
            document.body.setAttribute('data-theme', 'dark');
            window.localStorage.setItem('theme', 'dark');
        });
        this.themeDarkBtn.addEventListener('click', () => {
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
