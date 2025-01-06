import { exit } from "node:process";
import { parseArgs } from "node:util";

export default class Arguments {
    private static _instance: Arguments;

    private readonly _paths: string[] = [];
    private readonly _noIgnore: boolean = false;
    private readonly _watch: boolean = false;

    constructor(args: string[] = Bun.argv.slice(2)) {
        if (Arguments._instance)
            return Arguments._instance;
        Arguments._instance = this;

        let help = false;
        ({
            positionals: this._paths,
            values: {
                help,
                'no-ignore': this._noIgnore,
                watch: this._watch
            }
        } = parseArgs({
            args,
            allowPositionals: true,
            strict: true,
            options: {
                help: {
                    type: 'boolean',
                    default: false,
                    short: 'h'
                },
                'no-ignore': {
                    type: 'boolean',
                    default: false
                },
                watch: {
                    type: 'boolean',
                    default: false,
                    short: 'w'
                }
            }
        }));

        if (help)
            this._help();
    }

    get paths(): string[] {
        if (!this._paths.length)
            return ['.'];
        return this._paths;
    }

    get noIgnore(): boolean {
        return this._noIgnore;
    }

    get watch(): boolean {
        return this._watch;
    }

    private _help(): never {
        exit(0);
    }
}
