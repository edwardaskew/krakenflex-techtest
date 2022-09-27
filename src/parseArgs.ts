import yargs from "yargs/yargs";
import { Argv } from "yargs";

export interface ICommandLineArgs {
    apiKey: string;
    begin: string;
    siteId: string;
    baseUrl: string;
    dryRun: boolean;
    retries: number
}

export const parser: Argv<ICommandLineArgs> = yargs()
    .usage("$0 [options] -k <API_KEY>")
    .version()
    .option("apiKey", {
        alias: ["k", "api-key"],
        description: "Api Key to use for authenticating requests.",
        type: "string",
        demandOption: true
    })
    .option("begin", {
        alias: "b",
        description: "filter all outages before this time. Should be an ISO-8601 string in the UTC timezone.",
        default: "2022-01-01T00:00:00.000Z",
    })

    .option("siteId", {
        alias: "s",
        description: "Id of the site to include outages from.",
        default: "norwich-pear-tree"
    })
    .option("baseUrl", {
        alias: ["u", "base-url"],
        description: "Base API url",
        default: "https://api.krakenflex.systems/interview-tests-mock-api/v1"
    })
    .option("dryRun", {
        alias: ["n", "dry-run"],
        description: "Prevents any portentially non-idempotent http methods (in this case the final POST) from executing, instead printing the body that would be sent to the console",
        type: "boolean",
        default: false
    })
    .option("retries", {
        alias: "r",
        description: "Maximum number of retries to attempt if an http request returns a 500 error code (only applied to http requests which should be idempotent)",
        default: 3
    })
    .strict()
    .help()

export function parseArgs(argv: string[]): ICommandLineArgs
{
    return parser
        .parseSync(argv);
}