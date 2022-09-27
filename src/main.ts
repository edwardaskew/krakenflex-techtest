import { EnhancedOutage, IClient, Outage } from "interfaces";

export async function main(client: IClient, args: {begin: string, siteId: string, dryRun: boolean}, logger=console.log.bind(console)) {

    // 1. Retrieve all outages from the `GET /outages` endpoint
    const outages = await client.getOutages();

    // 2. Retrieve information from the `GET /site-info/{siteId}` endpoint for the site with the ID `args.siteId`
    const siteInfo = await client.getSiteInfo(args.siteId);
    const deviceMap = new Map(siteInfo.devices.map(d => [d.id, d.name]));

    // 3. Filter out any outages that began before `args.begin` or don't have an ID that is in the list of
    //    devices in the site information
    const filteredOutages = filterOutages(outages, deviceMap, args.begin);

    // 4. For the remaining outages, attach the display name of the device in the site information to each appropriate outage
    const enhancedOutages = enhanceOutages(filteredOutages, deviceMap);

    // 5. Send this list of outages to `POST /site-outages/{siteId}` for the site with the ID `args.siteId`
    if(args.dryRun) {
        logger(JSON.stringify(enhancedOutages, null, 4));
    }
    else {
        await client.postSiteOutages(args.siteId, enhancedOutages);
    }
}

export function filterOutages(outages: Outage[], devices: Map<string, string>, begin: string): Outage[]
{
    // This relies on lexographic ordering of ISO 8601 strings also ordering sequentially by time
    return outages.filter(o => o.begin >= begin && devices.has(o.id))
}

export function enhanceOutages(outages: Outage[], devices: Map<string,string>): EnhancedOutage[]
{
    return outages.map(o => ({...o, name: devices.get(o.id)}));
}