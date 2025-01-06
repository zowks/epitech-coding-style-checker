import Arguments from "../classes/Arguments";
import bananaVera from "../commands/bananaVera";
import gitCheckIgnore from "../commands/gitCheckIgnore";
import output from "./output";

export default async (files: string[]): Promise<void> => {
    if (!new Arguments().noIgnore)
        files = gitCheckIgnore(files);

    output(await bananaVera(files));
}
