import type { Report } from "../commands/bananaVera";
import { stdout } from "bun";

const colors = {
    FATAL: 'blood',
    MAJOR: 'red',
    MINOR: 'yellow',
    INFO: 'blue'
} as const;

export default (report: Report) => {
    const summary = { FATAL: 0, MAJOR: 0, MINOR: 0, INFO: 0 };

    for (const [path, violations] of Object.entries(report)) {
        Bun.write(stdout, `${path}\n\n`.strong.underline);
        for (const { type, line, code, comment } of violations) {
            summary[type]++;
            Bun.write(
                stdout,
                `${` ⏺ ${type.padEnd(5)} ${code}:`.strong} ${comment}\n`[colors[type]] +
                `   ${path}:${line}\n\n`.italic.grey
            );
        }
        Bun.write(stdout, '\n');
    }

    Object.entries(summary).map(([type, count], index) => {
        if (index !== 0)
            Bun.write(stdout, ' | '.grey.strong);

        Bun.write(
            stdout,
            `${String(count).underline.strong} ${type}`[colors[type as keyof typeof colors]]
        );
    });
    Bun.write(stdout, '\n');
}
