import {Cli} from "./app/Cli/Cli.js";

abstract class App {
    static async main(): Promise<void> {
        const cli = new Cli();
        await cli.run();
    }
}

await App.main();