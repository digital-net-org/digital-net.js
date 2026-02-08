import '../src';
import '../src/digital-ui.css';
import { StoryPage } from './modules/StoryPage';

function handleHotReload() {
    if (import.meta.hot) {
        import.meta.hot.accept('./modules/StoryPage', newModule => {
            if (newModule) {
                const nav = document.getElementById('nav');
                if (nav) nav.innerHTML = '';
                storyPage = new newModule.StoryPage();
            }
        });

        import.meta.hot.dispose(() => {
            if (storyPage && typeof (storyPage as any).dispose === 'function') {
                (storyPage as any).dispose();
            }
        });
    }
}

let storyPage = new StoryPage();
handleHotReload();
