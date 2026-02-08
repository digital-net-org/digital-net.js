import { Story } from './Story';
import { StoryLayout } from './StoryLayout';

export class StoryPage {
    /**
     * Dynamically imports all story modules from the stories directory.
     */
    private static storyModules: Record<string, unknown> = import.meta.glob('../stories/**/*.stories.ts', {
        eager: true,
    });

    private layout: StoryLayout;
    private stories: Map<string, Story> = new Map();
    private activeStory: Story | null = null;

    public constructor() {
        this.layout = new StoryLayout();
        this.initialize();

        // Listen to URL changes
        window.addEventListener('popstate', () => this.syncFromUrl());
    }

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
                this.stories.set(name, story);
                this.layout.buildNavButton({
                    name,
                    category: story.category,
                    onSync: this.syncFromUrl,
                });
            }
        }
        this.syncFromUrl();
    }

    private setStory = (story?: Story) => {
        this.activeStory = story ?? null;
        this.layout.setPreview(story);
        if (story) {
            story.onUpdate = () => (this.activeStory === story ? this.layout.setPreview(story) : void 0);
        }
    };

    private syncFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const storyName = params.get('story');
        this.layout.unselectAllNavButtons();

        if (storyName && this.stories.has(storyName)) {
            const storyInstance = this.stories.get(storyName)!;
            this.layout.selectNavButton(storyName);
            this.layout.setTitle(
                [...(storyInstance.category ? [storyInstance.category] : []), storyName].filter(Boolean).join('/')
            );
            this.setStory(storyInstance);
        } else {
            this.layout.setTitle();
            this.setStory();
        }
    };
}
