import yargs from "yargs/yargs";

interface ICommandLineArgs {
    apiKey: string;
    begin: string;
    siteId: string;
    
}

const args: ICommandLineArgs = yargs()
    .option("apiKey", {
        alias: ["k", "api-key"],
        description: "Api Key to use for authenticating requests.",
        type: "string",
        demandOption: true
    })
    .option("begin", {
        alias: "b",
        description: "filter all outages before this time. Should be an ISO8061 string in the UTC timezone.",
        default: "2022-01-01T00:00:00.000Z",
    })
    
    .option("siteId", {
        alias: "s",
        description: "Id of the site to include outages from.",
        default: "norwich-pear-tree"
    })
    .strict()
    .parseSync(process.argv.slice(2))

function main(args: ICommandLineArgs){
}

main(args);