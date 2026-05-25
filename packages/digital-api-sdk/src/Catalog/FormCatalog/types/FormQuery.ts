export interface FormQuery {
    name?: string;
    published?: boolean;
    path?: string;
    size?: number;
    index?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
}

export interface FormSubmissionQuery {
    formId?: string;
    size?: number;
    index?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
}
