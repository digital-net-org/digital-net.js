import {
    DN_API_FORM,
    DN_API_FORM_BY_ID,
    DN_API_FORM_FIELDS_NESTED,
    DN_API_FORM_FIELD_BY_ID_NESTED,
    DN_API_FORM_FIELDS_SCHEMA,
    DN_API_FORM_SUBMISSIONS,
    DN_API_FORM_SUBMISSION_BY_ID,
} from '../../routes';
import { CatalogRunner } from '../CatalogRunner';
import type { HttpClient } from '../../HttpClient';
import type {
    FormDto,
    FormSubmissionDto,
    JsonPatchOp,
    QueryResult,
    Result,
    SchemaProperty,
} from '../../types';
import type { CatalogCallbacks } from '../types';
import type { FormCreatePayload, FormFieldPayload, FormQuery, FormSubmissionQuery } from './types';

export class FormCatalog {
    private readonly http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    /** GET `cms/forms/:id` — JWT/ApiKey */
    public async getById(id: string, options: CatalogCallbacks<FormDto> = {}): Promise<Result<FormDto>> {
        return CatalogRunner.run<FormDto>(this.http, { path: DN_API_FORM_BY_ID, slugs: { id } }, options);
    }

    /** GET `cms/forms` — paginated list — JWT/ApiKey */
    public async getList(
        query: FormQuery = {},
        options: CatalogCallbacks<QueryResult<FormDto>> = {}
    ): Promise<Result<QueryResult<FormDto>>> {
        return CatalogRunner.run<QueryResult<FormDto>>(
            this.http,
            { path: DN_API_FORM, params: query as Record<string, unknown> },
            options
        );
    }

    /** POST `cms/forms` — Returns the new form id. — JWT/ApiKey */
    public async create(
        payload: FormCreatePayload,
        options: CatalogCallbacks<string> = {}
    ): Promise<Result<string>> {
        return CatalogRunner.run<string>(
            this.http,
            { method: 'POST', path: DN_API_FORM, body: payload },
            options
        );
    }

    /** PATCH `cms/forms/:id` — body = JSON Patch (RFC 6902) — JWT/ApiKey */
    public async update(id: string, ops: JsonPatchOp[], options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'PATCH',
                path: DN_API_FORM_BY_ID,
                slugs: { id },
                body: ops,
                headers: { 'Content-Type': 'application/json-patch+json' },
            },
            options
        );
    }

    /** DELETE `cms/forms/:id` — JWT/ApiKey */
    public async delete(id: string, options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            { method: 'DELETE', path: DN_API_FORM_BY_ID, slugs: { id } },
            options
        );
    }

    /** GET `cms/forms/fields/schema` — Returns the FormField schema. — JWT/ApiKey */
    public async getFieldSchema(
        options: CatalogCallbacks<SchemaProperty[]> = {}
    ): Promise<Result<SchemaProperty[]>> {
        return CatalogRunner.run<SchemaProperty[]>(this.http, { path: DN_API_FORM_FIELDS_SCHEMA }, options);
    }

    /** POST `cms/forms/:formId/fields` — Creates a field attached to the form. — JWT/ApiKey */
    public async createField(
        formId: string,
        payload: FormFieldPayload,
        options: CatalogCallbacks<string> = {}
    ): Promise<Result<string>> {
        return CatalogRunner.run<string>(
            this.http,
            {
                method: 'POST',
                path: DN_API_FORM_FIELDS_NESTED,
                slugs: { formId },
                body: payload,
            },
            options
        );
    }

    /** PATCH `cms/forms/:formId/fields/:fieldId` — body = JSON Patch — JWT/ApiKey */
    public async updateField(
        formId: string,
        fieldId: string,
        ops: JsonPatchOp[],
        options: CatalogCallbacks<null> = {}
    ): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'PATCH',
                path: DN_API_FORM_FIELD_BY_ID_NESTED,
                slugs: { formId, fieldId },
                body: ops,
                headers: { 'Content-Type': 'application/json-patch+json' },
            },
            options
        );
    }

    /** DELETE `cms/forms/:formId/fields/:fieldId` — JWT/ApiKey */
    public async deleteField(
        formId: string,
        fieldId: string,
        options: CatalogCallbacks<null> = {}
    ): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            {
                method: 'DELETE',
                path: DN_API_FORM_FIELD_BY_ID_NESTED,
                slugs: { formId, fieldId },
            },
            options
        );
    }

    /** GET `cms/forms/submissions?formId=...` — JWT/ApiKey */
    public async getSubmissions(
        query: FormSubmissionQuery = {},
        options: CatalogCallbacks<QueryResult<FormSubmissionDto>> = {}
    ): Promise<Result<QueryResult<FormSubmissionDto>>> {
        return CatalogRunner.run<QueryResult<FormSubmissionDto>>(
            this.http,
            { path: DN_API_FORM_SUBMISSIONS, params: query as Record<string, unknown> },
            options
        );
    }

    /** GET `cms/forms/submissions/:id` — JWT/ApiKey */
    public async getSubmissionById(
        id: string,
        options: CatalogCallbacks<FormSubmissionDto> = {}
    ): Promise<Result<FormSubmissionDto>> {
        return CatalogRunner.run<FormSubmissionDto>(
            this.http,
            { path: DN_API_FORM_SUBMISSION_BY_ID, slugs: { id } },
            options
        );
    }

    /** DELETE `cms/forms/submissions/:id` — JWT/ApiKey */
    public async deleteSubmission(id: string, options: CatalogCallbacks<null> = {}): Promise<Result> {
        return CatalogRunner.run<null>(
            this.http,
            { method: 'DELETE', path: DN_API_FORM_SUBMISSION_BY_ID, slugs: { id } },
            options
        );
    }
}
