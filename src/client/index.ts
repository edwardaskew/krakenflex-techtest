export interface Outage {
    id: string;
    begin: string;
    end: string
}

export interface SiteInfo {
    id: string;
    name: string;
    devices: { id: string; name: string }[];
}


export interface EnhancedOutage extends Outage {
    name: string;
};

export interface IClient {
    getOutages(): Promise<Outage[]>;
    getSiteInfo(id: string): Promise<SiteInfo>;
    postSiteOutages(id: string, outages: EnhancedOutage[]): Promise<void>;
}