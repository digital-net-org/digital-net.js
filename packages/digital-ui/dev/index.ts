import '../src';
import '../src/digital-ui.css';
import { StoryPage } from './modules/StoryPage';

function handleHotReload() {
    if (import.meta.hot) {
        import.meta.hot.accept('./modules/StoryPage', newModule => {
            if (newModule) {
                const nav = document.getElementById('nav');
                if (nav) {
                    nav.innerHTML = '';
                }
                storyPage = new newModule.StoryPage();
            }
        });
    }
}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
let storyPage = new StoryPage();
handleHotReload();
