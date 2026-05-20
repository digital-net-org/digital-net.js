export interface ArticlePayload {
    title: string;
    description?: string;
    content?: string;
    slug: string;
    pageId?: string | null;
}
