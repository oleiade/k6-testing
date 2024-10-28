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
  toBeDisabled(options?: RetryOptions): Promise<void>;

  /**
   * Ensures the Locator points to an editable element.
   */
  toBeEditable(options?: RetryOptions): Promise<void>;

  /**
   * Ensures the Locator points to an enabled element.
   */
  toBeEnabled(options?: RetryOptions): Promise<void>;

  /**
   * Ensures that Locator either does not resolve to any DOM node, or resolves to a non-visible one.
   */
  toBeHidden(options?: RetryOptions): Promise<void>;

  /**
   * Ensures that Locator points to an attached and visible DOM node.
   */
  toBeVisible(options?: RetryOptions): Promise<void>;

  /**
   * Ensures the Locator points to an element with the given input value. You can use regular expressions for the value as well.
   *
   * @param value {string} the expected value of the input
   */
  toHaveValue(value: string, options?: RetryOptions): Promise<void>;
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
    async toBeChecked(options?: RetryOptions): Promise<void> {
      await withRetry(async () => {
        const isChecked = await locator.isChecked();
        assert(
          isChecked,
          createErrorContext(`Expected locator to be checked`, isChecked, true),
          isSoft
        );
      }, options);
    },

    async toBeDisabled(options?: RetryOptions): Promise<void> {
      await withRetry(async () => {
        const isDisabled = await locator.isDisabled();
        assert(
          isDisabled,
          createErrorContext(
            `Expected locator to be disabled`,
            isDisabled,
            true
          ),
          isSoft
        );
      }, options);
    },

    async toBeEditable(options?: RetryOptions): Promise<void> {
      await withRetry(async () => {
        const isEditable = await locator.isEditable();
        assert(
          isEditable,
          createErrorContext(
            `Expected locator to be editable`,
            isEditable,
            true
          ),
          isSoft
        );
      }, options);
    },

    async toBeEnabled(options?: RetryOptions): Promise<void> {
      await withRetry(async () => {
        const isEnabled = await locator.isEnabled();
        assert(
          isEnabled,
          createErrorContext(`Expected locator to be enabled`, isEnabled, true),
          isSoft
        );
      }, options);
    },

    async toBeHidden(options?: RetryOptions): Promise<void> {
      await withRetry(async () => {
        const isHidden = await locator.isHidden();
        assert(
          isHidden,
          createErrorContext(`Expected locator to be hidden`, isHidden, true),
          isSoft
        );
      }, options);
    },

    async toBeVisible(options?: RetryOptions): Promise<void> {
      await withRetry(async () => {
        const isVisible = await locator.isVisible();
        assert(
          isVisible,
          createErrorContext(`Expected locator to be visible`, isVisible, true),
          isSoft
        );
      }, options);
    },

    async toHaveValue(
      expectedValue: string,
      options?: RetryOptions
    ): Promise<void> {
      await withRetry(async () => {
        const actualValue = await locator.inputValue();
        assert(
          expectedValue === actualValue,
          createErrorContext(
            `Expected locator to have value`,
            actualValue,
            expectedValue
          ),
          isSoft
        );
      }, options);
    },
  };
}

// Default configuration for retry behavior
interface RetryOptions {
  /**
   * Maximum amount of time to retry in milliseconds.
   */
  timeout?: number;

  /**
   * Time between retries in milliseconds.
   */
  interval?: number;
}

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  timeout: 5000, // 5 seconds default timeout
  interval: 100, // 100ms between retries
};

/**
 * Implements retry logic for async assertions
 * @param assertion Function that performs the actual check
 * @param options Retry configuration
 * @returns Promise that resolves when assertion passes or rejects if timeout is reached
 */
async function withRetry(
  assertion: () => Promise<void>,
  options: RetryOptions = {}
): Promise<void> {
  const timeout: number = options.timeout ?? DEFAULT_RETRY_OPTIONS.timeout;
  const interval: number = options.interval ?? DEFAULT_RETRY_OPTIONS.interval;
  const startTime: number = Date.now();
  let lastError: Error | null = null;

  while (Date.now() - startTime < timeout) {
    try {
      await assertion();
      return; // Success case, we exit immediately
    } catch (error) {
      lastError = error as Error;
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }

  throw lastError ?? new Error("Expect condition not met within timeout");
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
