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
