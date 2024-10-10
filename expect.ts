import { assert } from "./assert.ts";

// Define the `expect` function that returns assertion methods
export function expect(value: unknown) {
  return {
    /**
     * Asserts that the value is equal to the expected value.
     *
     * @param expected the expected value
     * @param soft if true, the assertion will mark the test as failed without interrupting the execution
     */
    toBe(expected: unknown, soft: boolean = false): void {
      assert(value === expected, `Expected ${value} to be ${expected}`, soft);
    },

    /**
     * Asserts that the value is close to the expected value with a given precision.
     *
     * @param expected the expected value
     * @param precision the number of decimal places to consider
     * @param soft  if true, the assertion will mark the test as failed without interrupting the execution
     */
    toBeCloseTo(
      expected: number,
      precision: number = 2,
      soft: boolean = false
    ): void {
      const diff = Math.abs((value as number) - expected);
      const pass = diff < Math.pow(10, -precision); // Check if the difference is within the tolerance
      assert(
        pass,
        `Expected ${value} to be close to ${expected} with precision ${precision}, but got a difference of ${diff}`,
        soft
      );
    },

    /**
     * Asserts that the value is equal to the expected value.
     *
     * @param expected the expected value
     * @param soft if true, the assertion will mark the test as failed without interrupt
     */
    toEqual(expected: unknown, soft: boolean = false): void {
      assert(
        JSON.stringify(value) === JSON.stringify(expected),
        `Expected ${JSON.stringify(value)} to equal ${JSON.stringify(
          expected
        )}`,
        soft
      );
    },

    /**
     * Asserts that the value is truthy.
     *
     * @param soft if true, the assertion will mark the test as failed without interrupt
     */
    toBeTruthy(soft: boolean = false): void {
      assert(!!value, `Expected ${value} to be truthy`, soft);
    },

    /**
     * Asserts that the value is truthy.
     *
     * @param soft if true, the assertion will mark the test as failed without interrupt
     */
    toBeFalsy(soft: boolean = false): void {
      assert(!value, `Expected ${value} to be falsy`, soft);
    },

    /**
     * Asserts that the value is greater than the expected value.
     *
     * @param expected the expected value
     * @param soft if true, the assertion will mark the test as failed without interrupt
     */
    toBeGreaterThan(expected: number, soft: boolean = false): void {
      assert(
        (value as number) > expected,
        `Expected ${value} to be greater than ${expected}`,
        soft
      );
    },

    /**
     * Asserts that the value is less than the expected value.
     *
     * @param expected the expected value
     * @param soft if true, the assertion will mark the test as failed without interrupt
     */
    toBeLessThan(expected: number, soft: boolean = false): void {
      assert(
        (value as number) < expected,
        `Expected ${value} to be less than ${expected}`,
        soft
      );
    },
  };
}
