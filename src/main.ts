#!/usr/local/bin/bun

Object.defineProperties(String.prototype, {
    strong: { get() { return `\x1b[1m${this}\x1b[22m` } },
    underline: { get() { return `\x1b[4m${this}\x1b[24m` } },
    italic: { get() { return `\x1b[3m${this}\x1b[23m` } },
    grey: { get() { return `\x1b[38;5;232m${this}\x1b[39m` } },
    blue: { get() { return `\x1b[38;5;12m${this}\x1b[39m` } },
    yellow: { get() { return `\x1b[38;5;11m${this}\x1b[39m` } },
    red: { get() { return `\x1b[38;5;9m${this}\x1b[39m` } },
    blood: { get() { return `\x1b[38;5;160m${this}\x1b[39m` } }
});

import { exit } from 'process';
import { stderr } from 'bun';

import Arguments from './classes/Arguments';
import PathBucket from './classes/PathBucket';

import once from './functions/once';
import watch from './functions/watch';


try {
    const args = new Arguments();
    const bucket = new PathBucket();

    await bucket.add(args.paths);

    if (args.watch)
        await watch(bucket.paths);
    else
        await once(await bucket.files());
} catch (e) {
    if (!(e instanceof Error)) throw e;

    Bun.write(stderr, `${(e.name + ':').strong.underline} ${e.message}\n`.red);
    if (e.cause)
        Bun.write(stderr, String(e.cause).italic.grey + '\n');

    exit(1);
}
