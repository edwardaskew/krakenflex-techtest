
/**
 * Wraps a function that returns a promise to retry it up to a maximum number of times
 * @param fn function to call that returns a promise that may be rejected
 * @param retries maximum number of times to retry the function
 * @param shouldRetry a predicate called on any error produced by the promise to determine whether a retry should be attempted. By default always returns true
 * @returns A new function that will return a promise that will resolve if `fn` returns a sucessfully resolving promise within `retries` attempts, 
 * otherwise it will be rejected
 */
export default function retry<T>(fn: (...args: any[]) => Promise<T>, retries: number, shouldRetry?: (failure: any) => boolean): (...args: any) => Promise<T>
{
    return async function(...args: any){
        shouldRetry = shouldRetry || (_ => true);
        for (let i = 0; i < retries; ++i) {
            try {
                return await fn(...args);
            }
            catch (e: any) {
                if (!shouldRetry(e)) {
                    throw e;
                }
            }
        }
    }
    
}