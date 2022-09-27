import { Outage, IClient } from "../src/interfaces";
import { main, filterOutages, enhanceOutages } from "../src/main";

import { expect } from "chai";
import sinon from "sinon";


describe("Main module", ()=> {
    const testData: Outage[] = [{
        "id": "86b5c819-6a6c-4978-8c51-a2d810bb9318",
        "begin": "2022-02-16T07:01:50.149Z",
        "end": "2022-10-03T07:46:31.410Z"
    },
    {
        "id": "86b5c819-6a6c-4978-8c51-a2d810bb9318",
        "begin": "2022-05-09T04:47:25.211Z",
        "end": "2022-12-02T18:37:16.039Z"
    },
    {
        "id": "9ed11921-1c5b-40f4-be66-adb4e2f016bd",
        "begin": "2022-04-12T08:11:21.333Z",
        "end": "2022-12-13T07:20:57.984Z"
    }];

    const fullDeviceMap = new Map([
        ["86b5c819-6a6c-4978-8c51-a2d810bb9318", "Test-Device1"],
        ["9ed11921-1c5b-40f4-be66-adb4e2f016bd", "Test-Device2"]
    ]);


    describe("filterOutages", () => {
        it("filters outages that begin before the boundary time", () => {
            // Arrange

            // Act
            const result = filterOutages(testData, fullDeviceMap, "2022-03-01T00:00:00.000Z");

            // Assert
            expect(result).to.eql(testData.slice(1));
        });

        it("filters outages with ids not in the device map", () => {
            // Arrange

            // Act
            const result = filterOutages(testData, new Map([["86b5c819-6a6c-4978-8c51-a2d810bb9318", "Test-Device1"]]), "2022-01-01T00:00:00.000Z");

            // Assert
            expect(result).to.eql(testData.slice(0, -1));
        });

        it("leaves an outage in if it began exactly at the boundary time", () => {
            // Arrange

            //Act
            const result = filterOutages(testData, fullDeviceMap, "2022-04-12T08:11:21.333Z");

            // Assert
            expect(result).to.deep.contain({
                "id": "9ed11921-1c5b-40f4-be66-adb4e2f016bd",
                "begin": "2022-04-12T08:11:21.333Z",
                "end": "2022-12-13T07:20:57.984Z"
            });
        });
    });

    describe("enhanceOutages", () => {
        it("adds names", () => {
            // Arrange
            const expected = [{
                "id": "86b5c819-6a6c-4978-8c51-a2d810bb9318",
                "begin": "2022-02-16T07:01:50.149Z",
                "end": "2022-10-03T07:46:31.410Z",
                "name": "Test-Device1"
            },
            {
                "id": "86b5c819-6a6c-4978-8c51-a2d810bb9318",
                "begin": "2022-05-09T04:47:25.211Z",
                "end": "2022-12-02T18:37:16.039Z",
                "name": "Test-Device1"
            },
            {
                "id": "9ed11921-1c5b-40f4-be66-adb4e2f016bd",
                "begin": "2022-04-12T08:11:21.333Z",
                "end": "2022-12-13T07:20:57.984Z",
                "name": "Test-Device2"
            }];

            // Act
            const result = enhanceOutages(testData, fullDeviceMap);

            // Assert
            expect(result).to.eql(expected);
        });

        it("sets the name of outages with unknown ids to `undefined`", () => {
            // Arrange
            const data = [{
                "id": "00000000-0000-0000-0000-000000000000",
                "begin": "2022-04-12T08:11:21.333Z",
                "end": "2022-12-13T07:20:57.984Z",
            }];

            // Act
            const result = enhanceOutages(data, fullDeviceMap);

            // Assert
            expect(result).to.eql([{
                "id": "00000000-0000-0000-0000-000000000000",
                "begin": "2022-04-12T08:11:21.333Z",
                "end": "2022-12-13T07:20:57.984Z",
                "name": undefined
            }])
        });
    });

    describe("main", () => {
        const mockClient: IClient = {
            getOutages() {
                return Promise.resolve(testData);
            },
            getSiteInfo() {
                return Promise.resolve({
                    id: "test-site",
                    name: "Test Site",
                    devices: Array.from(fullDeviceMap).map(([k, v]: [string, string]) => ({id: k, name: v}))
                });
            },
            postSiteOutages: () => Promise.reject()
        };

        it("posts the result to the client's postSiteOutages", async () => {
            // Arrange
            const args = {
                begin: "2022-01-01T00:00:00.000Z",
                siteId: "test-site",
                dryRun: false
            }
            const spy =  sinon.spy();
            mockClient.postSiteOutages = spy;

            // Act
            await main(mockClient, args);

            // Assert
            expect(spy.calledOnce).to.be.true;
            expect(spy.firstCall.args).to.eql(["test-site", [{
                    "id": "86b5c819-6a6c-4978-8c51-a2d810bb9318",
                    "begin": "2022-02-16T07:01:50.149Z",
                    "end": "2022-10-03T07:46:31.410Z",
                    "name": "Test-Device1"
                },
                {
                    "id": "86b5c819-6a6c-4978-8c51-a2d810bb9318",
                    "begin": "2022-05-09T04:47:25.211Z",
                    "end": "2022-12-02T18:37:16.039Z", 
                    "name": "Test-Device1"
                },
                {
                    "id": "9ed11921-1c5b-40f4-be66-adb4e2f016bd",
                    "begin": "2022-04-12T08:11:21.333Z",
                    "end": "2022-12-13T07:20:57.984Z",
                    "name": "Test-Device2"
                }]]);
        });

        it("skips postSiteOutages if dryRun is true", async () => {
            // Arrange
            const args = {
                begin: "2022-01-01T00:00:00.000Z",
                siteId: "test-site",
                dryRun: true
            }
            const spy = sinon.spy();
            mockClient.postSiteOutages = spy;
            const logSpy = sinon.spy();

            // Act
            await main(mockClient, args, logSpy);

            // Assert
            expect(spy.notCalled).to.be.true;
            expect(logSpy.calledOnce).to.be.true;
        })
    });
});