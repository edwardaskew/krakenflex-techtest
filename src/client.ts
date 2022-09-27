import { IClient, Outage, SiteInfo, EnhancedOutage } from "./interfaces";
import retry from "./retry";
import axios, { Axios } from "axios";



export class Client implements IClient {
    private readonly _axios: Axios;

    constructor(apiKey: string, baseUrl: string, retries: number = 1) {
        this._axios = axios.create({
            baseURL: baseUrl,
            // See https://github.com/axios/axios/issues/4184, the fix is currently in the 1.0-alpha release
            // so let's just ignore it until that gets out of alpha
            // @ts-ignore
            headers: { common: {"x-api-key": apiKey }}
        });

        // wrap methods with retry logic
        function shouldRetry(reason: any): boolean {
            if (axios.isAxiosError(reason)) {
                // Only retry for 5xx responses
                return reason.response.status >= 500;
            }
            return false;
        }
        
        this.getOutages = retry(this.getOutages.bind(this), retries, shouldRetry);
        this.getSiteInfo = retry(this.getSiteInfo.bind(this), retries, shouldRetry);
        // postSiteOutages is explicitly *not* retried as a POST may not be idempotent and we have
        // no way of know how far the server got in processing the request before generating an error
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