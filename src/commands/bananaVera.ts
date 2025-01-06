import { cpus } from 'os';

type RuleType = 'FATAL' | 'MAJOR' | 'MINOR' | 'INFO';

export type Report = {
    [path: string]: {
        line: string;
        type: RuleType;
        code: string;
        comment: string;
    }[];
}

const comments = (await Bun.file('/usr/local/lib/vera++/code_to_comment').text())
    .split('\n')
    .reduce((comments, line) => {
        const [code, comment] = line.split(':');
        if (!code || !comment)
            return comments;

        comments[code] = comment.charAt(0).toUpperCase() + comment.slice(1);

        return comments;
    }, {} as { [code: string]: string });

function splitIntoChunks<T>(items: T[], chunkSize: number): T[][] {
    const chunks = [];
    while (items.length)
        chunks.push(items.splice(0, chunkSize));

    return chunks;
}

function formatStdout(stdout: string): Report {
    const report: Report = {};
    for (const substring of stdout.split('\n')) {
        if (!substring)
            continue;

        const [path, line, type, code] = substring.split(':');
        (report[path] ??= []).push({
            line,
            type: type.slice(1) as RuleType,
            code,
            comment: comments[code] ?? ''
        });
    }

    return report;
}

/**
 * 
 * @throws {Error} If an error occurred while running `vera++`
 */
export default async function (paths: string[]): Promise<Report> {
    const chunks = splitIntoChunks(
        paths,
        Math.ceil(paths.length / cpus().length)
    );

    let stdout = '';
    await Promise.all(
        chunks.map(async (chunk) => {
            const subprocess = Bun.spawn([
                'vera++',
                '--no-duplicate',
                '--profile',
                'epitech',
                ...chunk
            ], { stderr: 'pipe' });

            if (await subprocess.exited !== 0)
                throw new Error(
                    'An error occurred while running Vera++',
                    { cause: await new Response(subprocess.stderr).text() }
                );

            stdout += await new Response(subprocess.stdout).text();
        })
    );

    return formatStdout(stdout);
}
