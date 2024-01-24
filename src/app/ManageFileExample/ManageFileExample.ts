import chalk from "chalk";
import fs from "fs";
import {GetFileException} from "../Exceptions/GetFileException.js";
import {NoUrlsFoundException} from "../Exceptions/NoUrlsFoundException.js";

export interface Url {
    [key: string]: string;
}

export class ManageFileExample {
    static #regex = new RegExp("\\[([^[\\]]*?)\\]\\((https?:\\/\\/[^\\s?#.].[^\\s]*)\\)", "gm");
    readonly #encoding: BufferEncoding;

    constructor(encoding: BufferEncoding) {
        this.#encoding = encoding;
    }

    // public getFile(filePath: string): void | GetFileException {
    //     fs.readFile(filePath, this.#encoding, (error, text) => {
    //        if(error) throw new GetFileException(error);
    //        return text;
    //     });
    // }

    // public getFileWithThen(filePath: string): void | GetFileException{
    //     fs.promises.readFile(filePath, this.#encoding)
    //         .then((text) => console.log(chalk.green(text)))
    //         .catch((error) => {
    //             throw new GetFileException(error);
    //         });
    // }

    public async getUrlsFromFile(filePath: string): Promise<Url[] | GetFileException | NoUrlsFoundException> {
        try {
            const text = await fs.promises.readFile(filePath, this.#encoding);

            return this.extractLinks(text);
        } catch (error) {
            if (error instanceof NoUrlsFoundException) throw error;

            throw new GetFileException(error as NodeJS.ErrnoException);
        } finally {
            console.log(chalk.yellow("Done processing..."))
        }
    }

    private extractLinks(text: string): Url[] | NoUrlsFoundException {
        const pattersFound = [...text.matchAll(ManageFileExample.#regex)];

        const urls = pattersFound?.map(patterFound => ({[patterFound[1]]: patterFound[2]}));

        if (urls?.length === 0) throw new NoUrlsFoundException('No Url found in this file');

        return urls;
    }
}