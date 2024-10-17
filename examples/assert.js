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
