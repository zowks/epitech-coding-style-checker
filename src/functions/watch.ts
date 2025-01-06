import { watch, type WatchEventType } from 'node:fs';
import PathBucket from '../classes/PathBucket';
import output from './output';
import bananaVera from '../commands/bananaVera';
import gitCheckIgnore from '../commands/gitCheckIgnore';
import Arguments from '../classes/Arguments';

async function handleWatch(event: WatchEventType, filename: string | null): Promise<void> {
    if (!filename || event !== 'change' || !PathBucket.filter(filename))
        return;

    if (!new Arguments().noIgnore && !gitCheckIgnore([filename]).length)
        return;

    output(await bananaVera([filename]));
}

export default async (paths: string[]): Promise<void> => {
    const controller = new AbortController;
    process.on('SIGINT', () => controller.abort('SIGINT'));

    for (const path of paths)
        watch(
            path,
            { recursive: true, signal: controller.signal },
            handleWatch
        );
}
