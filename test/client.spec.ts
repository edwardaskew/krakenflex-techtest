/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "../src/client";

import { expect } from "chai";
import { EnhancedOutage } from "interfaces";

// Uses the httpbin echo service to inspect the requests sent
// This is more than a little hacky as it's not respecting the typescript 
// return types so expect abuse of `any` ahead...
describe("Client", () => {
    
    const client = new Client("test-api-key", "https://httpbin.org/anything")
    it("sends the api key when requesting outages", async () => {
        // Arrange

        // Act
        const data: any = await client.getOutages();

        // Assert
        expect(data.headers).to.have.property("X-Api-Key", "test-api-key");
        expect(data.url).to.equal("https://httpbin.org/anything/outages");
    });

    it("sends the api key and site id when requesting site-info", async () => {
        // Arrange

        // Act
        const data: any = await client.getSiteInfo("test-site");

        // Assert
        expect(data.headers).to.have.property("X-Api-Key", "test-api-key");
        expect(data.url).to.equal("https://httpbin.org/anything/site-info/test-site");
    });

    it("sends the enhanced outages as json when posting to site-outages", async () => {
        // Arrange
        const testOutages: EnhancedOutage[] = [{
            id: "test-site",
            begin: "2022-01-01T00:00:00.000Z",
            end: "2023-01-01T00:00:00.000Z",
            name: "test-device"
        }]

        // Act
        const data: any = await client.postSiteOutages("test-site", testOutages);

        // Assert
        expect(data.headers).to.have.property("X-Api-Key", "test-api-key");
        expect(data.url).to.equal("https://httpbin.org/anything/site-outages/test-site");
        expect(data.json).to.eql(testOutages);
    })
})