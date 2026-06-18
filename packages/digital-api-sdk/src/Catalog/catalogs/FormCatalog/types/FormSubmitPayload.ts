export interface FormSubmitPayload {
    values: Record<string, string | null>;
    submitterIp?: string;
    userAgent?: string;
}
