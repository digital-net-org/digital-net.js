import type { Entity } from './Entity';

export interface FormSubmissionDto extends Entity {
    formId: string;
    valuesJson: string;
    submitterIp?: string;
    userAgent?: string;
}
