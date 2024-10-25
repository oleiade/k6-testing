import { Locator } from "k6/browser";
import {
  createExpectation as createNonRetryingExpectation,
  type Expectation as NonRetryingExpectation,
} from "./expectNonRetrying.ts";
import {
  createExpectation as createRetryingExpectation,
  type Expectation as RetryingExpectation,
} from "./expectRetrying.ts";

export const expect: ExpectFunction = Object.assign(
  function (value: unknown) {
    if (isLocator(value)) {
      return createRetryingExpectation(value as Locator, false);
    } else {
      return createNonRetryingExpectation(value, false);
    }
  },
  {
    soft: function (value: unknown) {
      if (isLocator(value)) {
        return createRetryingExpectation(value as Promise<Locator>, true);
      } else {
        return createNonRetryingExpectation(value, true);
      }
    },
  }
);

interface ExpectFunction {
  (value: unknown): NonRetryingExpectation | RetryingExpectation;
  soft(value: unknown): NonRetryingExpectation | RetryingExpectation;
}

//FIXME: For a reason I ignore, the type Locator is not recognized as a type in the isLocator function
// if I use instanceof. I believe this might be a limitation of how types are defined in k6.
function isLocator(value: unknown): value is Locator {
  const locatorProperties = [
    "clear",
    "isEnabled",
    "isHidden",
    "getAttribute",
    "selectOption",
    "press",
    "type",
    "dispatchEvent",
    "dblclick",
    "setChecked",
    "isDisabled",
    "focus",
    "innerText",
    "inputValue",
    "check",
    "isEditable",
    "fill",
    "textContent",
    "hover",
    "waitFor",
    "click",
    "uncheck",
    "isChecked",
    "isVisible",
    "innerHTML",
    "tap",
  ];

  const hasLocatorProperties = (value: object): boolean => {
    return locatorProperties.every((prop) => prop in value);
  };

  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    hasLocatorProperties(value)
  );
}
