export type SheetType = 'css' | 'js' | 'html';

export interface PageSheet {
    id?: string;
    name: string;
    type: SheetType;
    content: string;
    published: boolean;
}
