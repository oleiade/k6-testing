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

`assert(condition: boolean, message: string): void` checks a condition and fails the test if the condition is false. 

`assertEquals(lhs: unknown, rhs: unknown, message: string, soft?: boolean): void`: checks if two values are equal and fails the test if they are not. If the `soft` option is true, the assertion will mark the test as failed without interrupting the execution.

```javascript
import { assert, assertEquals } from "../dist/index.js";

export const options = {
  // Make k6 run 3 test iterations to illustrate the test
  // immediate failure, and the test execution stops.
  iterations: 3,
};

export default function () {
  // Assert enables users to assert a given condition statement is true.
  assert(true === true, "true is expected to remain true");

  // assertEquals is a helper function built on top of assert and
  // asserts the equality of two values.
  assertEquals(1, 1, "1 is expected to equal 1");

  // If the condition is true, nothing happens and the test execution continues.
  assert(1 === 1, "1 is expected to remain 1");

  // If the condition is false, an error is thrown, the iteration is stopped, the
  // test execution stops, and the whole test is marked as failed, returning the
  // exit code 108.
  assert("sun" === "moon", "sun is expected to be moon");
  assertEquals("sun", "moon", "sun is expected to be moon");
}
```

### Expect

#### Hard expectation

`expect(value: unknown): Expectation` creates an expectation object for the given value. Which can then be chained with any of the following matchers:

##### Matchers

| Matcher                                                                             | Description                                                                   |
|-------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| `toBe(expected: unknown, soft: boolean = false): void`                              | asserts that the value is equal to the expected value.                        |
| `toBeCloseTo(expected: number, precision: number = 2, soft: boolean = false): void` | asserts that the value is close to the expected value with a given precision. |
| `toEqual(expected: unknown, soft: boolean = false): void`                           | asserts that the value is equal to the expected value.                        |
| `toBeTruthy(soft: boolean = false): void`                                           | asserts that the value is truthy.                                             |
| `toBeFalsy(soft: boolean = false): void`                                            | asserts that the value is falsy.                                              |
| `toBeGreaterThan(expected: number, soft: boolean = false): void`                    | asserts that the value is greater than the expected value.                    |
| `toBeLessThan(expected: number, soft: boolean = false): void`                       | asserts that the value is less than the expected value.                       |

##### Example

```javascript
import { expect } from "../dist/index.js";

export const options = {
  // Make k6 run 3 test iterations to illustrate the test
  // immediate failure, and the test execution stops.
  iterations: 3,
};

export default function () {
  // expect is a helper function built on top of assert and
  // exposes an intuitive API for expressing expectations towards
  // the code under test.
  expect(true).toBe(true);

  // Its default execution behavior is similar to assert: if the expectation is
  // met, nothing happens and the test execution continues.
  expect(10).toBeCloseTo(10.2, 0.1);

  // If the expectation is not met, an error is thrown, the iteration is stopped,
  // the test execution stops, and the whole test is marked as failed, returning
  // the exit code 108.
  //
  // The main advantage of `expect` over `assert` is that it provides a more
  // expressive error message, which helps to understand what went wrong:
  //
  //   ERRO[0000] test aborted: Expected value sun to be undefined
  //
  //   Expected: "undefined"
  //   Received: "sun"
  //   At: at assert (file:///Users/theocrevon/Dev/oleiade/k6-testing/assert.ts:33:20(17))
  //
  expect("sun").toBeUndefined();
}
```

#### Soft expectation

The `expect` function can also be used to create soft expectations, which will not interrupt the test execution when the expectation is not met. To create a soft expectation, chain the `soft(value: unknown)` method to the expectation object, and use [matchers](#matchers) as usual:

```javascript
import { expect } from "../dist/index.js";

export const options = {
  // Make k6 run 3 test iterations to illustrate that soft expectations
  // do not stop the test execution, but rather mark iterations and the test as failed, but
  // continue the test execution.
  iterations: 1,
};

export default function () {
  // soft expectations are created by chaining the `soft` method on the `expect` helper.
  // The API following the expectation remains the same as with `expect`.
  expect.soft(true).toBe(true);

  // Using `soft` turns the expectation into a soft expectation, meaning that in case of failure,
  // instead of failing the iteration and immediately exit the test execution, the iteration and test
  // will be marked as failed, but the test execution will keep going on.
  expect.soft("sun").toBeUndefined();

  // It means the following expectation will be executed, despite the previous one failing.
  expect.soft(10).toBeCloseTo(10.2, 0.1);

  // This expecation will be executed as well, despite the previous one failing.
  expect.soft(1).toEqual(2);
}
```