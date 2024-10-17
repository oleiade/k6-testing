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
  expect(true).toBe(false);

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
  //  ERRO[0000] test aborted: Expected value sun to be undefined
  //
  //  Expected: "undefined"
  //  Received: "sun"
  //  At: at assert (file:///Users/theocrevon/Dev/oleiade/k6-testing/assert.ts:33:20(17))
  //
  expect("sun").toBeUndefined();
}
