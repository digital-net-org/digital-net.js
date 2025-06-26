export interface IDbConfig {
    stores: ReadonlyArray<string>;
    name: string;
    version?: number;
}
