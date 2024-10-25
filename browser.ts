import { assert } from "./assert.ts";
import { colorize } from "./colors.ts";
import { Locator } from "k6/browser";
import exec from "k6/execution";

/**
 * The expect function is a factory function that creates an expectation object for a given value.
 */
export const expect: ExpectFunction = Object.assign(
  function (locator: Promise<Locator>) {
    return createExpectation(locator, false); // Hard assertions by default
  },
  {
    soft: function (locator: Promise<Locator>) {
      return createExpectation(locator, true);
    },
  }
);

/**
 * A function that creates an expectation object for a given value.
 *
 * It can either act as an hard assertion (default) or a soft assertion.
 */
interface ExpectFunction {
  (locator: Promise<Locator>): Expectation;
  soft(value: Promise<Locator>): Expectation;
}

interface Expectation {
  /**
   * Asserts that the locator is visible
   */
  toBeVisible(): void;

  /**
   * Asserts that the locator is hidden
   */
  toBeHidden(): void;

  /**
   * Asserts that the locator has the given value
   *
   * @param value
   */
  toHaveValue(value: string): void;
}

/**
 * createExpectation is a factory function that creates an expectation object for a given value.
 *
 * @param locator the value to create an expectation for
 * @param isSoft whether the expectation should be a soft assertion
 * @returns an expectation object over the given value exposing the Expectation set of methods
 */
function createExpectation(
  locator: Promise<Locator>,
  isSoft: boolean
): Expectation {
  return {
    async toBeVisible(): Promise<void> {
      console.log(`toBeVisible called`);
      const awaitedLocator = await locator;
      const isVisible = await awaitedLocator.isVisible();
      console.log(`isVisible: ${isVisible}`);

      assert(
        isVisible,
        `expected locator to be visible, but it was not`,
        isSoft
      );
    },

    async toBeHidden(): Promise<void> {
      console.log(`toBeHidden called`);
      const awaitedLocator = await locator;
      const isHidden = await awaitedLocator.isHidden();
      console.log(`isHidden: ${isHidden}`);

      assert(
        isHidden,
        `expected locator to be visible, but it was not`,
        isSoft
      );
    },

    async toHaveValue(value: string): Promise<void> {
      console.log(`toHaveValue called`);
      const awaitedLocator = await locator;
      const actualValue = await awaitedLocator.inputValue();
      console.log(`actualValue: ${actualValue}`);

      exec.test.abort(`test aborted`);
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
