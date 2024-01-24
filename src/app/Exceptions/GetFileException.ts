import chalk from "chalk";

export class GetFileException extends Error{
    constructor(error: NodeJS.ErrnoException) {
        const message = chalk.red(error.code, "No file found in directory...");
        super(message);
    }
}