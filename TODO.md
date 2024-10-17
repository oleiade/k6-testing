## To do and investigate

* [ ] One big piece missing, is to mark the test as "failed", but keep executing to the end of the test when using soft expectations. (does abort actually does that?)
* [ ] The engine needs a way to mark the test as failed and communicate the exit code to use eventually, once the execution is actually done.
* [ ] Add the ability to configure `expect` in the init context: soft/hard assertions, with the ability to do soft on demand + ability to select exit code on failur
* [ ] To support 👆 we need the ability to select the exit code to use in various failure conditions
* [ ] Keep the setup example to illustrate how it's useful as a best practice
* [ ] Display a proper log of where the test failed (stack trace, execution log?)
* [ ] Can we automatically hide the summary if an expectation failed?
* [ ] DOES `aborted` and `failed` tests run teardown still

## Open Questions

* [ ] Should soft use `check` under the hood?
* [ ] Core change necessary to allow failed checks to modify the exit code at the very minimum, maybe even better to allow the user to define the exit code of k6 under different failure conditions
* [ ] When a test is marked as failed (?), or aborted/exited, we should probably not display the summary, as it looks "too happy".

## Explore

An idea we've explored was to have a top-level `expect.configure` call that would allow to define whether we want all expectations to be soft, and what exit code to use in case of failure. This would allow to have a global configuration for all expectations, and then override it on a per-expectation basis.

```javascript
expect.configure({
  // Expectations in the whole script WILL BE treated as soft expectations
  soft: true,

  // With `soft` would be automatically set to 0, but offers the flexibility to the user to pick up what makes sense for them
  //
  // Under the hood this would need to configure the exit code k6 should exit with eventually, maybe by updating a new option in the options object
  // such as options.onFailureExitCode = 110
  //
  // THIS IS THE EXIT CODE THAT THE CLI WOULD RETURN TO THE SYSTEM: The k6-agent/cloud would need to introduce intelligence around this
  onSuccess: {
    exitCode: 0,
  },

  onFailure: {
    markTestAsFailed: true,
    exitCode: 108,
  },
});
```

To be possible, we need to have a way to mark the test as failed, and to communicate the exit code to use eventually, once the execution is actually done. We already have issue [#680](https://github.com/grafana/k6/issues/680) suggesting to do something along those lines.

```javascript
export const options = {
  // Make k6 run 3 test iterations to illustrate that soft expectations
  // do not stop the test execution, but rather mark iterations and the test as failed, but
  // continue the test execution.
  iterations: 1,

  // IDEA
  // This is probably less confusing for the user to be able to say "if you abort, use this exit code"
  onExitCondition: {
    aborted: {
      exitCode: 108,
    },
  },
};
```

## Dissmissed

```javascript
// IDEA for marking exit code on failure
on.lifecycle("afterTeardown", () => s3.deleteObject()); // Probably bad
on.lifecycle("afterTeardown", () => exit(108)); // Probably bad
exec.markTestAsFailed(108); // Probably bad
// WHY? Because of the order of execution, we can't guarantee ordering, and those operations
// Might happen out of order.
```