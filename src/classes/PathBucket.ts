import { isAbsolute, normalize, relative, resolve } from 'node:path/posix';
import { exists, readdir, stat } from 'node:fs/promises';

const excludedDirs = ['./tests/', './bonus/', './.git/'] as const;

export default class PathBucket {
    private readonly _paths: Set<string> = new Set();

    public get paths(): string[] {
        return [...this._paths];
    }

    /**
     * 
     * @throws {Error} If a path does not exist
     */
    public async add(paths: string[]): Promise<void> {
        await Promise.all(paths.map(async path => {
            const normalized = PathBucket.normalize(path);

            if (!PathBucket.filter(normalized))
                return;

            if (!await exists(normalized))
                throw new Error(`Path ${normalized} does not exist`);

            this._paths.add(normalized);
        }));
    }

    /**
     * 
     * @throws {Error} If a path is not a file nor a directory
     */
    public async files(): Promise<string[]> {
        const files: Set<string> = new Set();

        await Promise.all(this.paths.map(async path => {
            const stats = await stat(path);

            if (stats.isFile())
                files.add(path);
            else if (stats.isDirectory())
                for (const file of await this._unpack(path))
                    files.add(file);
            else
                throw new Error(`Path ${path} is not a file nor a directory`);
        }));

        return [...files];
    }

    /**
     * Filters whether the given `path` starts with any of the excluded directories. *(`./tests/`, `./bonus/`, `./.git/`)*
     * @param path - The path to be checked against the excluded directories.
     * @returns `true` if the path does not start with any of the excluded directories, otherwise `false`.
     */
    public static filter(path: string): boolean {
        return !excludedDirs.find((directory) => path.startsWith(directory));
    }

    public static normalize(path: string): string {
        const { abs, rel } = isAbsolute(path) ?
            { abs: normalize(path), rel: relative('.', path) } :
            { abs: resolve(path), rel: './' + normalize(path) };

        return abs.length < rel.length ? abs : rel;
    }

    private async _unpack(directory: string): Promise<string[]> {
        const files: string[] = [];

        for (const dirent of await readdir(directory, { recursive: true, withFileTypes: true })) {
            if (!dirent.isFile())
                continue;

            const normalized = dirent.parentPath ?
                PathBucket.normalize(`${dirent.parentPath}/${dirent.name}`) :
                PathBucket.normalize(dirent.name);

            if (!PathBucket.filter(normalized))
                continue;

            files.push(normalized);
        }

        return files;
    }
}
