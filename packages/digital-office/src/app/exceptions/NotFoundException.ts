export class NotFoundException extends Error {
    public constructor(message: string = 'Resource not found') {
        super(message);
        this.name = 'NotFoundException';
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}
