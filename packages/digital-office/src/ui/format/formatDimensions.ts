export function formatDimensions(width?: number | null, height?: number | null): string {
    if (!width || !height) return '—';
    return `${width} × ${height}`;
}
