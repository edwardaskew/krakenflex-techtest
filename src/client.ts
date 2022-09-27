import { IClient, Outage, SiteInfo, EnhancedOutage } from "./interfaces";
import axios, { Axios } from "axios";

export class Client implements IClient {
    private readonly _axios: Axios;

    constructor(apiKey: string, baseUrl: string) {
        this._axios = axios.create({
            baseURL: baseUrl,
            // See https://github.com/axios/axios/issues/4184, the fix is currently in the 1.0-alpha release
            // so let's just ignore it until that gets out of alpha
            // @ts-ignore
            headers: { common: {"x-api-key": apiKey }}
        });
    }

    async getOutages(): Promise<Outage[]> {
        const response = await this._axios.get<Outage[]>("/outages");
        return response.data;
    }
    async getSiteInfo(id: string): Promise<SiteInfo> {
        const response = await this._axios.get<SiteInfo>(`/site-info/${id}`);
        return response.data;
    }
    async postSiteOutages(id: string, outages: EnhancedOutage[]): Promise<any> {
        const response = await this._axios.post(`/site-outages/${id}`, outages);
        return response.data;
    }

}