import { assert } from "./assert.ts";
import { colorize } from "./colors.ts";
import { check } from "k6";

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

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: expected,
        at: new Error(),
      });

      const errorMessage = `${errorHeader}
      ${errorContext}`;

      if (isSoft) {
        console.log(`SOFT ASSERTION WITH CHECK`);
        check(
          value,
          {
            [`Expected value ${value} to be ${expected}`]: (value: unknown) => {
              console.log(`is ${value} === ${expected}? ${value === expected}`);
              value === expected;
            },
          },
          { kind: "expect" }
        );

        // exec.setAbortExitCode(108);
      } else {
        assert(
          value === expected,
          `${errorHeader}
          ${errorContext}`,
          isSoft
        );
      }
    },

    toBeCloseTo(expected: number, precision: number = 2): void {
      const diff = Math.abs((value as number) - expected);
      const pass = diff < Math.pow(10, -precision);

      const errorHeader = colorize(
        `Expected value ${value} to be close to ${expected} with precision ${precision}, but got a difference of ${diff}`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: expected,
        at: new Error(),
      });

      assert(
        pass,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeDefined(): void {
      const errorHeader = colorize(
        `Expected value ${value} to be defined`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: "!= undefined",
        at: new Error(),
      });

      assert(
        value !== undefined,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeFalsy(): void {
      const errorHeader = colorize(
        `Expected value ${value} to be falsy`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: "false",
        at: new Error(),
      });

      assert(
        !value,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeGreaterThan(expected: number | bigint): void {
      const errorHeader = colorize(
        `Expected value ${value} to be greater than ${expected}`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: `${value} > ${expected}`,
        at: new Error(),
      });

      assert(
        (value as number) > expected,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeGreaterThanOrEqual(expected: number | bigint): void {
      const errorHeader = colorize(
        `Expected value ${value} to be greater than or equal to ${expected}`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: `${value} >= ${expected}`,
        at: new Error(),
      });

      assert(
        (value as number) >= expected,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    // deno-lint-ignore ban-types
    toBeInstanceOf(expected: Function): void {
      const errorHeader = colorize(
        `Expected value ${value} to be an instance of ${expected}`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: `instanceof ${expected}`,
        at: new Error(),
      });

      assert(
        value instanceof expected,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeLessThan(expected: number | bigint): void {
      const errorHeader = colorize(
        `Expected value ${value} to be less than ${expected}`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: `${value} < ${expected}`,
        at: new Error(),
      });

      assert(
        (value as number) < expected,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeLessThanOrEqual(expected: number | bigint): void {
      const errorHeader = colorize(
        `Expected value ${value} to be less than or equal to ${expected}`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: `${value} <= ${expected}`,
        at: new Error(),
      });

      assert(
        (value as number) <= expected,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeNaN(): void {
      const errorHeader = colorize(`Expected value ${value} to be NaN`, "red");

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: "NaN",
        at: new Error(),
      });

      assert(
        isNaN(value as number),
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeNull(): void {
      const errorHeader = colorize(`Expected value ${value} to be null`, "red");
      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: "null",
        at: new Error(),
      });

      assert(
        value === null,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeTruthy(): void {
      const errorHeader = colorize(
        `Expected value ${value} to be truthy`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: "true",
        at: new Error(),
      });

      assert(
        !!value,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toBeUndefined(): void {
      const errorHeader = colorize(
        `Expected value ${value} to be undefined`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: "undefined",
        at: new Error(),
      });

      assert(
        value === undefined,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toEqual(expected: unknown): void {
      const errorHeader = colorize(
        `Expected value ${JSON.stringify(value)} to equal ${JSON.stringify(
          expected
        )}`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: expected,
        at: new Error(),
      });

      assert(
        JSON.stringify(value) === JSON.stringify(expected),
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },

    toHaveLength(expected: number): void {
      const errorHeader = colorize(
        `Expected value ${value} to have a length of ${expected}`,
        "red"
      );

      const errorContext = createExpectationMessage({
        actualValue: value,
        expectedValue: expected,
        at: new Error(),
      });

      assert(
        (value as Array<unknown>).length === expected,
        `${errorHeader}
        ${errorContext}`,
        isSoft
      );
    },
  };
}

interface ExpectationContext {
  actualValue: unknown;
  expectedValue: unknown;
  at?: Error;
}

function createExpectationMessage(context: ExpectationContext): string {
  const actualValue: string = JSON.stringify(context.actualValue);
  const expectedValue: string = JSON.stringify(context.expectedValue);

  return `
  Expected: ${colorize(expectedValue, "green")}
  Received: ${colorize(actualValue, "red")}
  At:`;
}
