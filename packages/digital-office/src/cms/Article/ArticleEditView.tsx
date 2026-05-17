import { useParams } from 'react-router';
import { DnView } from '../../ui';

export function ArticleEditView() {
    const { id } = useParams<{ id: string }>();
    return (
        <DnView title="Édition d'un article" description={`Article ${id}`}>
            {/* US-ART-04/US-ART-05 */}
        </DnView>
    );
}
