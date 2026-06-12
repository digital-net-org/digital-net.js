export class StreamRequestError extends Error {
    public readonly status: number;

    public constructor(status: number) {
        super(`Mutation stream request failed with status ${status}.`);
        this.status = status;
    }
}
