import { parseArgs, parser } from "../src/parseArgs";

import { expect } from "chai";
import sinon from "sinon";

describe("parseArgs", () => {
    it("fails without an api key", () => {
        // Arrange
        const spy = sinon.spy();
        const p = parser.fail(spy);

        // Act
        const result = p.parseSync([]);

        // Assert
        expect(spy.called).to.be.true;
    });

    it("defaults everything except the api key", () => {
        // Arrange
        const argv = ["-k", "test-api-key"];

        // Act
        const result = parseArgs(argv);

        // Assert
        expect(result).to.include({
            apiKey: "test-api-key",
            begin: "2022-01-01T00:00:00.000Z",
            siteId: "norwich-pear-tree",
            baseUrl: "https://api.krakenflex.systems/interview-tests-mock-api/v1",
            dryRun: false
        });
    });

    it("correctly sets dryRun when the flag is present", () => {
        // Arrange
        const argv = ["--dry-run", "-k", "test-api-key"];

        // Act
        const result = parseArgs(argv);

        // Assert
        expect(result.dryRun).to.be.true;
    })
})