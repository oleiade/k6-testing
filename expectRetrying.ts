import { assert } from "./assert.ts";
import { colorize } from "./colors.ts";
import { Locator } from "k6/browser";

export interface Expectation {
  /**
   * Ensures the Locator points to a checked input.
   */
  toBeChecked(): Promise<void>;

  /**
   * Ensures the Locator points to a disabled element.
   * Element is disabled if it has "disabled" attribute or is disabled via 'aria-disabled'.
   *
   * Note that only native control elements such as HTML button, input, select, textarea, option, optgroup can be disabled by setting "disabled" attribute.
   * "disabled" attribute on other elements is ignored by the browser.
   */
  toBeDisabled(): Promise<void>;

  /**
   * Ensures the Locator points to an editable element.
   */
  toBeEditable(): Promise<void>;

  /**
   * Ensures the Locator points to an enabled element.
   */
  toBeEnabled(): Promise<void>;

  /**
   * Ensures that Locator either does not resolve to any DOM node, or resolves to a non-visible one.
   */
  toBeHidden(): Promise<void>;

  /**
   * Ensures that Locator points to an attached and visible DOM node.
   */
  toBeVisible(): Promise<void>;

  /**
   * Ensures the Locator points to an element with the given input value. You can use regular expressions for the value as well.
   *
   * @param value {string} the expected value of the input
   */
  toHaveValue(value: string): Promise<void>;
}

/**
 * createExpectation is a factory function that creates an expectation object for a given value.
 *
 * @param locator the value to create an expectation for
 * @param isSoft whether the expectation should be a soft assertion
 * @returns an expectation object over the given value exposing the Expectation set of methods
 */
export function createExpectation(
  locator: Locator,
  isSoft: boolean
): Expectation {
  return {
    async toBeChecked(): Promise<void> {
      const isChecked = await locator.isChecked();
      assert(
        isChecked,
        await createErrorContext(
          `Expected locator to be checked`,
          isChecked,
          true
        ),
        isSoft
      );
    },

    async toBeDisabled(): Promise<void> {
      const isDisabled = await locator.isDisabled();
      assert(
        isDisabled,
        await createErrorContext(
          `Expected locator to be disabled`,
          isDisabled,
          true
        ),
        isSoft
      );
    },

    async toBeEditable(): Promise<void> {
      const isEditable = await locator.isEditable();
      assert(
        isEditable,
        await createErrorContext(
          `Expected locator to be editable`,
          isEditable,
          true
        ),
        isSoft
      );
    },

    async toBeEnabled(): Promise<void> {
      const isEnabled = await locator.isEnabled();
      assert(
        isEnabled,
        await createErrorContext(
          `Expected locator to be enabled`,
          isEnabled,
          true
        ),
        isSoft
      );
    },

    async toBeHidden(): Promise<void> {
      const isHidden = await locator.isHidden();
      assert(
        isHidden,
        await createErrorContext(
          `Expected locator to be hidden`,
          isHidden,
          true
        ),
        isSoft
      );
    },

    async toBeVisible(): Promise<void> {
      const isVisible = await locator.isVisible();
      assert(
        isVisible,
        await createErrorContext(
          `Expected locator to be visible`,
          isVisible,
          true
        ),
        isSoft
      );
    },

    async toHaveValue(expectedValue: string): Promise<void> {
      const actualValue = await locator.inputValue();
      assert(
        expectedValue === actualValue,
        await createErrorContext(
          `Expected locator to have value`,
          actualValue,
          expectedValue
        ),
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

function createErrorContext(
  message: string,
  actualValue: unknown,
  expectedValue: unknown
): string {
  const errorHeader = colorize(message, "red");
  const errorContext = createExpectationMessage({
    actualValue,
    expectedValue,
    at: new Error(),
  });

  return `${errorHeader}\n${errorContext}`;
}

function createExpectationMessage(
  context: ExpectationContext,
  options: { colorize: boolean } = { colorize: true }
): string {
  let actualValue: string = JSON.stringify(context.actualValue);
  let expectedValue: string = JSON.stringify(context.expectedValue);

  if (options?.colorize) {
    actualValue = colorize(actualValue, "red");
    expectedValue = colorize(expectedValue, "green");
  }

  return `\n  Expected: ${expectedValue}\n  Received: ${actualValue}\n  At:`;
}
