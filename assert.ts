import { fail } from "k6";
import exec from "k6/execution";

/**
 * assert is a function that checks a condition and fails the test if the condition is false.
 *
 * As a default, a failing assertion will immediately abort the whole test, exit with code 108, and
 * display an error message. If you want to continue the test after a failing assertion, you can pass
 * `true` as the third argument to `assert`.
 *
 * @param condition condition to assert the truthyness of
 * @param message the message to display if the condition is false
 * @param soft if true, the assertion will mark the test as failed without interrupting the execution
 */
export function assert(
  condition: boolean,
  message: string,
  soft?: boolean
): void {
  if (condition) {
    return;
  }

  if (soft) {
    // in the event of a soft assertion, we mark the test as failed
    // without interrupting the execution
    fail(message);
  } else {
    // otherwise, we immediately abort the test
    exec.test.abort(message);
  }
}

/**
 * assertEquals is a function that checks if two values are equal and fails the test if they are not.
 *
 * As a default, a failing assertion will immediately abort the whole test, exit with code 108, and
 * display an error message. If you want to continue the test after a failing assertion, you can pass
 * `true` as the third argument to `assert`.
 *
 * @param lhs the left-hand side of the comparison
 * @param rhs the right-hand side of the comparison
 * @param message the message to display if the values are not equal
 * @param soft if true, the assertion will mark the test as failed without interrupting the execution
 */
export function assertEquals(
  lhs: unknown,
  rhs: unknown,
  message: string,
  soft?: boolean
): void {
  assert(lhs === rhs, message, soft);
}
