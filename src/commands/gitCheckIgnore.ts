/**
 * 
 * @throws {Error} If an error occurred while running `git check-ignore`
 */
export default function (paths: string[]): string[] {
    const subprocess = Bun.spawnSync([
        'git',
        'check-ignore',
        '--verbose',
        '--non-matching',
        ...paths
    ]);

    if (!subprocess.success && subprocess.exitCode !== 1)
        throw new Error('An error occurred while running GitCheckIgnore', { cause: subprocess.stderr });

    const kept: string[] = [];
    for (const line of String(subprocess.stdout).split('\n'))
        if (line.startsWith('::\t'))
            kept.push(line.slice(3));

    return kept;
}
