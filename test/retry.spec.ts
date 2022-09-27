import retry from "../src/retry";

import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
import sinon from "sinon";

describe("retry", () => {
    it("should retry an async function a maximum number of times if it fails", async () => {
        // Arrange
        const fn = sinon.fake.rejects("Error");

        // Act
        const promise = retry(fn, 3)();

        // Assert
        expect(promise).to.be.rejectedWith("Error");
        promise.finally(() => expect(fn.callCount).to.equal(3))
    });

    it("should return the function's value on success", async () => {
        // Arrange
        let count = 0
        const fn = sinon.fake(() => {
            if(count < 2){
                ++count;
                return Promise.reject("Error");
            }
            return Promise.resolve("Sucess");
        });

        // Act
        const result = await retry(fn, 3)();

        // Assert
        expect(result).to.equal("Sucess");
        expect(fn.callCount).to.equal(3);
    });

    it("should not attempt a retry if shouldRetry returns false", async () => {
        // Arrange
        const fn = sinon.fake.rejects("Error");

        // Act
        const promise = retry(fn, 3, () => false)();

        // Assert
        expect(promise).to.be.rejectedWith("Error");
        promise.finally(() => expect(fn.callCount).to.equal(1))
    })
})