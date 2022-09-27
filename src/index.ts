import { main } from "./main";
import { parseArgs } from "./parseArgs";
import { Client } from "./client";


const args = parseArgs(process.argv.slice(2));
const client = new Client(args.apiKey, args.baseUrl);

main(client, args);