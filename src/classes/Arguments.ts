import { stdout } from "bun";
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
        let version = false;
        ({
            positionals: this._paths,
            values: {
                help,
                version,
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
                version: {
                    type: 'boolean',
                    default: false,
                    short: 'v'
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

        if (help) this._help();
        if (version) this._version();
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
        Bun.write(
            stdout,
            `coding-style - A simple Epitech C coding style checker\n`.strong.underline +
            `${'Usage:'.strong} ${Bun.argv[1].split('/').pop()} [option(s)] [path(s) ...]\n\n`.blue +
            `${'Options:'.strong}\n`.yellow +
            `   ${'-h, --help'.strong}\t\tDisplay this help message\n`.yellow +
            `   ${'-v, --version'.strong}\tDisplay the current version\n`.yellow +
            `   ${'-w, --watch'.strong}\t\tWatch for file changes & re-run automatically\n`.yellow +
            `   ${'--no-ignore'.strong}\t\tIgnore ${'.gitignore'.italic} pattern(s)\n`.yellow
        );
        exit(0);
    }

    private _version(): never {
        Bun.write(stdout, `${'coding-style version:'.strong} ${'v1.0.0'.blue}\n`);
        exit(0);
    }
}
