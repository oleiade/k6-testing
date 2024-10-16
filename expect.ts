import { assert } from "./assert.ts";
import { colorize } from "./colors.ts";

/**
 * The expect function is a factory function that creates an expectation object for a given value.
 */
export const expect: ExpectFunction = Object.assign(
  function (value: unknown) {
    return createExpectation(value, false); // Hard assertions by default
  },
  {
    soft: function (value: unknown) {
      return createExpectation(value, true); // Soft assertions when using expect.soft()
    },
  }
);

/**
 * A function that creates an expectation object for a given value.
 *
 * It can either act as an hard assertion (default) or a soft assertion.
 */
interface ExpectFunction {
  (value: unknown): Expectation;
  soft(value: unknown): Expectation;
}

interface Expectation {
  /**
   * Asserts that the value is equal to the expected value.
   *
   * @param expected the expected value
   */
  toBe(expected: unknown): void;

  /**
   * Asserts that the value is close to the expected value with a given precision.
   *
   * @param expected the expected value
   * @param precision the number of decimal places to consider
   */
  toBeCloseTo(expected: number, precision?: number): void;

  /**
   * Asserts that the value is not `undefined`.
   */
  toBeDefined(): void;

  /**
   * Asserts that the value is truthy.
   */
  toBeFalsy(): void;

  /**
   * Asserts that the value is greater than the expected value.
   *
   * @param expected the expected value
   */
  toBeGreaterThan(expected: number): void;

  /**
   * Asserts that the value is greater than or equal to the expected value.
   *
   * @param expected
   */
  toBeGreaterThanOrEqual(expected: number): void;

  /**
   * Ensures that value is an instance of a class. Uses instanceof operator.
   *
   * @param expected The class or constructor function.
   */
  // deno-lint-ignore ban-types
  toBeInstanceOf(expected: Function): void;

  /**
   * Asserts that the value is less than the expected value.
   *
   * @param expected the expected value
   */
  toBeLessThan(expected: number): void;

  /**
   * Ensures that value <= expected for number or big integer values.
   *
   * @param expected The value to compare to.
   */
  toBeLessThanOrEqual(expected: number | bigint): void;

  /**
   * Ensures that value is NaN.
   */
  toBeNaN(): void;

  /**
   * Ensures that value is null.
   */
  toBeNull(): void;

  /**
   * Ensures that value is true in a boolean context, anything but false, 0, '', null, undefined or NaN.
   * Use this method when you don't care about the specific value.
   */
  toBeTruthy(): void;

  /**
   * Ensures that value is `undefined`.
   */
  toBeUndefined(): void;

  /**
   * Asserts that the value is equal to the expected value.
   *
   * @param expected the expected value
   */
  toEqual(expected: unknown): void;

  /**
   * Ensures that value has a `.length` property equal to expected.
   * Useful for arrays and strings.
   *
   * @param expected
   */
  toHaveLength(expected: number): void;
}

/**
 * createExpectation is a factory function that creates an expectation object for a given value.
 *
 * @param value the value to create an expectation for
 * @param isSoft whether the expectation should be a soft assertion
 * @returns an expectation object over the given value exposing the Expectation set of methods
 */
function createExpectation(value: unknown, isSoft: boolean): Expectation {
  return {
    toBe(expected: unknown): void {
      const errorHeader = colorize(
        `Expected value ${value} to be ${expected}`,
        "red"
      );

      const errorContext = createExpectationMessage(
        createExpectationContext(value, expected, new Error())
      );

      // const errorInfo = `
      //   Expected value: ${colorize(JSON.stringify(expected), "green")}
      //   Received value: ${colorize(JSON.stringify(value), "red")}
      //   At: ${colorize(new Error().stack?.split("\n")[2], "brightBlack")}

      // `;

      assert(
        value === expected,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },
    toBeCloseTo(expected: number, precision: number = 2): void {
      const diff = Math.abs((value as number) - expected);
      const pass = diff < Math.pow(10, -precision);
      assert(
        pass,
        `Expected ${value} to be close to ${expected} with precision ${precision}, but got a difference of ${diff}`,
        isSoft
      );
    },
    toBeDefined(): void {
      assert(value !== undefined, `Expected ${value} to be defined`, isSoft);
    },
    toBeFalsy(): void {
      assert(!value, `Expected ${value} to be falsy`, isSoft);
    },
    toBeGreaterThan(expected: number | bigint): void {
      assert(
        (value as number) > expected,
        `Expected ${value} to be greater than ${expected}`,
        isSoft
      );
    },
    toBeGreaterThanOrEqual(expected: number | bigint): void {
      assert(
        (value as number) >= expected,
        `Expected ${value} to be greater than or equal to ${expected}`,
        isSoft
      );
    },
    // deno-lint-ignore ban-types
    toBeInstanceOf(expected: Function): void {
      assert(
        value instanceof expected,
        `Expected ${value} to be an instance of ${expected}`,
        isSoft
      );
    },
    toBeLessThan(expected: number | bigint): void {
      assert(
        (value as number) < expected,
        `Expected ${value} to be less than ${expected}`,
        isSoft
      );
    },
    toBeLessThanOrEqual(expected: number | bigint): void {
      assert(
        (value as number) <= expected,
        `Expected ${value} to be less than or equal to ${expected}`,
        isSoft
      );
    },
    toBeNaN(): void {
      assert(isNaN(value as number), `Expected ${value} to be NaN`, isSoft);
    },
    toBeNull(): void {
      assert(value === null, `Expected ${value} to be null`, isSoft);
    },
    toBeTruthy(): void {
      assert(!!value, `Expected ${value} to be truthy`, isSoft);
    },
    toBeUndefined(): void {
      assert(value === undefined, `Expected ${value} to be undefined`, isSoft);
    },
    toEqual(expected: unknown): void {
      assert(
        JSON.stringify(value) === JSON.stringify(expected),
        `Expected ${JSON.stringify(value)} to equal ${JSON.stringify(
          expected
        )}`,
        isSoft
      );
    },
    toHaveLength(expected: number): void {
      assert(
        (value as Array<unknown>).length === expected,
        `Expected ${value} to have a length of ${expected}`,
        isSoft
      );
    },
  };
}

interface ExpectationContext {
  actualValue: unknown;
  expectedValue: unknown;
  at: string;
}

function createExpectationContext(
  actualValue: unknown,
  expectedValue: unknown,
  at: Error
): ExpectationContext {
  return {
    actualValue,
    expectedValue,
    at: at.stack?.split("\n")[2] ?? "",
  };
}

function createExpectationMessage(context: ExpectationContext): string {
  return `
  Expected: ${colorize(JSON.stringify(context.expectedValue), "green")}
  Received: ${colorize(JSON.stringify(context.actualValue), "red")}
  At:`;
}
