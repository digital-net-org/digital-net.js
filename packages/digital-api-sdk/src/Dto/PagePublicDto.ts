import type { OpenGraphEntryPublicDto } from './OpenGraphEntryPublicDto';

export interface PagePublicDto {
    id: string;
    indexed: boolean;
    title?: string | null;
    description?: string | null;
    jsonLd?: string | null;
    redirect?: string | null;
    openGraph: OpenGraphEntryPublicDto[];
}
