import { watch, type WatchEventType } from 'node:fs';
import PathBucket from '../classes/PathBucket';
import output from './output';
import bananaVera from '../commands/bananaVera';
import gitCheckIgnore from '../commands/gitCheckIgnore';
import Arguments from '../classes/Arguments';

async function handleWatch(event: WatchEventType, filename: string | null, parent: string): Promise<void> {
    if (!filename || event !== 'change')
        return;

    const path = parent + filename;
    if (!PathBucket.filter(path) || (!new Arguments().noIgnore && !gitCheckIgnore([path]).length))
        return;

    console.clear();
    output(await bananaVera([path]));
}

export default async (paths: string[]): Promise<void> => {
    const controller = new AbortController;
    process.on('SIGINT', () => controller.abort('SIGINT'));

    for (const path of paths)
        watch(
            path,
            { recursive: true, signal: controller.signal },
            (event, filename) => handleWatch(event, filename, path)
        );
}
