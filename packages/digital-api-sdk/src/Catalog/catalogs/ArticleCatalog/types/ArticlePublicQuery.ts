export interface ArticlePublicQuery {
    name?: string;
    pageId?: string;
    size?: number;
    index?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
}
