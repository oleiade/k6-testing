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
     * toBeDefined asserts that the value is not `undefined`.
     *
     * @param soft if true, the assertion will mark the test as failed without interrupt
     */
    toBeDefined(soft: boolean = false): void {
      assert(value !== undefined, `Expected ${value} to be defined`, soft);
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
     * Asserts that the value is greater than or equal to the expected value.
     *
     * @param expected
     * @param soft
     */
    toBeGreaterThanOrEqual(expected: number, soft: boolean = false): void {
      assert(
        (value as number) >= expected,
        `Expected ${value} to be greater than or equal to ${expected}`,
        soft
      );
    },

    /**
     * Ensures that value is an instance of a class. Uses instanceof operator.
     *
     * @param expected The class or constructor function.
     * @param soft
     */
    // deno-lint-ignore ban-types
    toBeInstanceOf(expected: Function, soft: boolean = false): void {
      assert(
        value instanceof expected,
        `Expected ${value} to be an instance of ${expected}`
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

    /**
     * Ensures that value <= expected for number or big integer values.
     *
     * @param expected The value to compare to.
     * @param soft
     */
    toBeLessThanOrEqual(
      expected: number | bigint,
      soft: boolean = false
    ): void {
      assert(
        (value as number) <= expected,
        `Expected ${value} to be less than or equal to ${expected}`,
        soft
      );
    },

    /**
     * Ensures that value is NaN.
     *
     * @param soft
     */
    toBeNaN(soft: boolean = false): void {
      assert(isNaN(value as number), `Expected ${value} to be NaN`, soft);
    },

    /**
     * Ensures that value is null.
     *
     * @param soft
     */
    toBeNull(soft: boolean = false): void {
      assert(value === null, `Expected ${value} to be null`, soft);
    },

    /**
     * Ensures that value is true in a boolean context, anything but false, 0, '', null, undefined or NaN.
     * Use this method when you don't care about the specific value.
     *
     * @param soft
     */
    toBeTruthy(soft: boolean = false): void {
      assert(!!value, `Expected ${value} to be truthy`, soft);
    },

    /**
     * Ensures that value is `undefined`.
     *
     * @param soft
     */
    toBeUndefined(soft: boolean = false): void {
      assert(value === undefined, `Expected ${value} to be undefined`, soft);
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
     * Ensures that value has a `.length` property equal to expected.
     * Useful for arrays and strings.
     *
     * @param expected
     * @param soft
     */
    toHaveLength(expected: number, soft: boolean = false): void {
      assert(
        (value as Array<unknown>).length === expected,
        `Expected ${value} to have a length of ${expected}`,
        soft
      );
    },
  };
}
