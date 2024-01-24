import {Url} from "../ManageFileExample/ManageFileExample.js";

export type UrlValid = Url & {
    status: number | string;
}

export class HttpValidation {

    public async toValidUrls(urls: Url[]): Promise<UrlValid[]> {
        const urlsValue = this.extractUrlsValue(urls);
        const urlsStatus = await this.checkUrlsStatus(urlsValue);

        return urls.map((url, index) => ({
            ...url,
            status: urlsStatus[index]
        } as UrlValid))
    }

    public extractUrlsValue(urls: Url[]): string[] {
        return urls.map(url => Object.values(url).join());
    }

    private async checkUrlsStatus(urlsValue: string[]): Promise<(number | string)[]> {
        return await Promise.all(urlsValue.map(async (urlValue) => {
            try {
                const response = await fetch(urlValue);
                return response.status;
            } catch (error) {
                return this.handleUrlErrorMessage(error);
            }
        }));
    }

    private handleUrlErrorMessage(error: unknown): string {
        if ((error as any).cause.code === 'ENOTFOUND') {
            return 'url does not exist';
        }
        return 'Unexpected error';
    }
}