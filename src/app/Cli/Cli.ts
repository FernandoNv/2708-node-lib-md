import {ManageFileExample, Url} from "../ManageFileExample/ManageFileExample.js";
import fs from "fs";
import chalk from "chalk";
import {HttpValidation} from "../HttpValidation/HttpValidation.js";

export class Cli {
    private manageFileExample: ManageFileExample;
    private httpValidation: HttpValidation;
    private readonly path: string;
    private readonly encoding: BufferEncoding;
    private readonly valid: string;

    constructor() {
        const args = process.argv.slice(2);
        if (args[0] === '--valid') {
            args.push(args.shift() as string);
        }
        this.path = args[0];
        this.encoding = args[1] !== '--valid' ? args[1] as BufferEncoding ?? 'utf-8' : 'utf-8';
        this.valid = args[2] !== undefined ? args[2] : args[1];
        this.manageFileExample = new ManageFileExample(this.encoding);
        this.httpValidation = new HttpValidation();
    }

    async run(): Promise<void> {
        try {
            fs.lstatSync(this.path);
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                console.log(chalk.red('File or directory not found'));
                return;
            }
        }

        if (fs.lstatSync(this.path).isFile()) await this.runFile();

        if (fs.lstatSync(this.path).isDirectory()) await this.runDirectory();
    }

    private async runDirectory(): Promise<void> {
        const files = await fs.promises.readdir(this.path);
        for (const file of files) {
            const filePath = `${this.path}/${file}`;
            const urls: Url[] = await this.manageFileExample.getUrlsFromFile(filePath) as Url[];
            await this.printUrls(urls, filePath);
        }
    }

    private async runFile(): Promise<void> {
        const urls: Url[] = await this.manageFileExample.getUrlsFromFile(this.path) as Url[];
        await this.printUrls(urls, this.path);
    }

    private async printUrls(urls: Url[], file: string): Promise<void> {
        if (this.valid) {
            const urlsValid = await this.httpValidation.toValidUrls(urls);
            console.log(urlsValid);
            return;
        }
        console.log(chalk.yellow('Urls '), chalk.black.bgGreen(file), urls);
    }
}