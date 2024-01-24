export class NoUrlsFoundException extends Error{
    constructor(message: string) {
        super(message);
    }
}