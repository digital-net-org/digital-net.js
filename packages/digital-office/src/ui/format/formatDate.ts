export function formatDate(iso?: string | null, format: 'full' | 'dateOnly' = 'full'): string {
    if (!iso) return '—';
    try {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            ...(format === 'full' ? { hour: '2-digit', minute: '2-digit' } : {}),
        }).format(new Date(iso));
    } catch {
        return iso;
    }
}
