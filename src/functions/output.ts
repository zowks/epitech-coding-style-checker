import type { Report } from "../commands/bananaVera";
import { stdout } from "bun";

const colors = {
    FATAL: 'blood',
    MAJOR: 'red',
    MINOR: 'yellow',
    INFO: 'blue'
} as const;

export default (report: Report) => {
    for (const [path, violations] of Object.entries(report)) {
        Bun.write(stdout, `${path}\n\n`.strong.underline);
        for (const { type, line, code, comment } of violations) {
            Bun.write(stdout, `${` ⏺ ${type.padEnd(5)} ${code}:`.strong} ${comment}\n`[colors[type]]);
            Bun.write(stdout, `   ${path}:${line}\n\n`.italic.grey);
        }
        Bun.write(stdout, '\n');
    }
}
// │
// └─
