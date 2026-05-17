import { useParams } from 'react-router';
import { DnView } from '../../ui';

export function MediaEditView() {
    const { id } = useParams<{ id: string }>();
    return (
        <DnView title="Édition d'un média" description={`Media ${id}`}>
            {/* Étoffé par US-MED-08 (onglet GENERAL) et US-MED-09 (onglet VARIANTS). */}
        </DnView>
    );
}
