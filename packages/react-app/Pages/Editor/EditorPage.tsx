import { PageEditor } from './components';
import { useEditorContext } from './EditorContext';

export function EditorPage() {
    const { isLoading, setIsLoading } = useEditorContext();
    return (
        <div style={{ height: '100%', width: '100%', margin: '3rem' }}>
            <div>{isLoading ? 'Loading...' : 'Editor is ready'}</div>
            <button onClick={() => setIsLoading(!isLoading)}>Toggle Loading State</button>
            {/*<PageEditor />*/}
        </div>
    );
}
