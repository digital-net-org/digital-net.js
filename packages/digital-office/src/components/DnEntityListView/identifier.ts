export interface EntityIdentifier {
    singular: string;
    plural: string;
    gender: 'm' | 'f';
}

export function resolveDeleteLabel(gender: 'm' | 'f', plural: boolean): string {
    const root = gender === 'f' ? 'supprimée' : 'supprimé';
    return plural ? root + 's' : root;
}

export function resolveNextLabel(gender: 'm' | 'f', plural: boolean): string {
    const root = gender === 'f' ? 'suivante' : 'suivant';
    return plural ? root + 's' : root;
}
