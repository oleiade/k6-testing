# k6-testing

**!! this is a prototype, that's definetly not ready for production use !!**

Functional testing primitives for k6

## Overview

`k6-testing` is a functional testing library for [k6](https://k6.io/), designed to provide a familiar API for performing assertions in your test scripts. This library allows you to interrupt the execution immediately when things go wrong, ensuring that your tests fail fast and provide clear feedback.

## Features

- **Assertions**: Perform various assertions to validate your test conditions.
- **Immediate Execution Interruption**: Fail fast by interrupting the test execution immediately when an assertion fails.
- **Familiar API**: Use a familiar API for assertions, making it easy to write and maintain tests.

## Using

To produce a javascript bundle, importable from a k6 script, use the following command:

```sh
deno task build 
```

## API

### Assert

`assert(condition: boolean, message: string, soft?: boolean): void`: checks a condition and fails the test if the condition is false. If the `soft` option is true, the assertion will mark the test as failed without interrupting the execution.

`assertEquals(lhs: unknown, rhs: unknown, message: string, soft?: boolean): void`: checks if two values are equal and fails the test if they are not. If the `soft` option is true, the assertion will mark the test as failed without interrupting the execution.

```javascript
import { assert, assertEquals } from "./dist/index.js";

export const options = {
  scenarios: {
    happy: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      exec: "happyFunc",
    },
    sad: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      exec: "sadFunc",
    },
  },
};

export function happyFunc() {
  assert(true, "This should pass");
  assertEquals(1, 1, "1 should equal 1");
}

export function sadFunc() {
  assert(false, "This should fail");
  assertEquals(1, 2, "1 should not equal 2");
}
```

### Expect

`expect(value: unknown): Expectation`: creates an expectation object for the given value. Which can then be chained with any of the following matchers:
* `toBe(expected: unknown, soft: boolean = false): void`: asserts that the value is equal to the expected value.
* `toBeCloseTo(expected: number, precision: number = 2, soft: boolean = false): void`: asserts that the value is close to the expected value with a given precision.
* `toEqual(expected: unknown, soft: boolean = false): void`: asserts that the value is equal to the expected value.
* `toBeTruthy(soft: boolean = false): void`: asserts that the value is truthy.
* `toBeFalsy(soft: boolean = false): void`: asserts that the value is falsy.
* `toBeGreaterThan(expected: number, soft: boolean = false): void`: asserts that the value is greater than the expected value.
* `toBeLessThan(expected: number, soft: boolean = false): void`: asserts that the value is less than the expected value.

```javascript
import { expect } from "./dist/index.js";

export const options = {
  scenarios: {
    happy: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      exec: "happyFunc",
    },
    sad: {
      executor: "shared-iterations",
      vus: 1,
      iterations: 1,
      exec: "sadFunc",
    },
  },
};

export function happyFunc() {
  expect(true).toBe(true, "This should pass");
  expect(1).toBe(1, "1 should equal 1");
}

export function sadFunc() {
  expect(false).toBe(true, "This should fail");
  expect(1).toBe(2, "1 should not equal 2");
}
```