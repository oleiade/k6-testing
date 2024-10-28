# k6-testing

A seamless way to write functional tests in k6 with Playwright-compatible assertions.

> ⚠️ **Note**: This is a prototype project demonstrating the concept. Not yet ready for production use.

## Why k6-testing?

- **✨ Write once, run anywhere**: Copy-paste your Playwright test assertions directly into k6 - they'll work out of the box
- **🎯 Fail fast**: Tests interrupt immediately when assertions fail, giving you quick, clear feedback
- **🔄 Progressive API**: Start simple with `assert`, scale up to expressive `expect` assertions as your needs grow
- **🎭 Familiar API**: Familiar API for anyone coming from Playwright, Deno, or Vite ecosystem
- **🔍 Clear error messages**: Get detailed, actionable feedback when tests fail

## Installation

```sh
deno task build
```

## Quick Start

```javascript
import { expect } from "https://github.com/oleiade/k6-testing/releases/download/v0.2.0/index.js";

export default function () {
  // Simple assertions
  expect(response.status).toBe(200);
  
  // Async assertions with retry (perfect for UI testing)
  await expect(page.locator('.submit-button')).toBeEnabled();
  
  // Soft assertions - continue testing even after failures
  expect.soft(data.userId).toBeDefined();
}
```

For functional testing, metrics and performance are most likely irrelevant, and we recommend executing k6 functional tests in headless mode:

```sh
# Run k6 in headless mode
k6 run --no-summary --quiet examples/browser.js

# If any assertion/expectation fail, a non-zero exit code will be returned
echo $status
```

## Features

### 1. Playwright-Compatible Expectations

Use the same assertions you know from Playwright:

```javascript
// These Playwright assertions work exactly the same in k6
await expect(page.locator('.button')).toBeVisible();
await expect(page.locator('input')).toHaveValue('test');
```

### 2. Auto-Retrying Assertions


Perfect for UI testing, these assertions will retry until the assertion passes, or the assertion timeout is reached. Note that retrying assertions are async, so you must await them.
By default, the timeout for assertions is set to 5 seconds, and the polling interval is set to 100 milliseconds. 

| Assertion            | Description                |
|----------------------|----------------------------|
| `toBeChecked()`      | Element is checked         |
| `toBeDisabled()`     | Element is disabled        |
| `toBeEditable()`     | Element is editable        |
| `toBeEnabled()`      | Element is enabled         |
| `toBeHidden()`       | Element is hidden          |
| `toBeVisible()`      | Element is visible         |
| `toHaveValue(value)` | Element has specific value |

You can customize these values by passing an options object as the second argument to the assertion function:
  
  ```javascript
  await expect(page.locator('.button')).toBeVisible({ timeout: 10000, interval: 500 });
  ```

### 3. Standard Assertions

These assertions allow to test any conditions, but do not auto-retry.

| Assertion                         | Description                      |
|-----------------------------------|----------------------------------|
| `toBe(expected)`                  | Strict equality comparison       |
| `toEqual(expected)`               | Deep equality comparison         |
| `toBeCloseTo(number, precision?)` | Number comparison with precision |
| `toBeTruthy()`                    | Truthy value check               |
| `toBeFalsy()`                     | Falsy value check                |
| `toBeGreaterThan(number)`         | Greater than comparison          |
| `toBeLessThan(number)`            | Less than comparison             |

### 4. Soft Assertions

Keep tests running even after failures - perfect for collecting multiple failures in one run:

```javascript
// Test continues even if assertions fail
expect.soft(response.status).toBe(200);
expect.soft(data.items).toHaveLength(5);
```

### 5. Basic Assertions

Low-level assertions for simple cases:

```javascript
import { assert, assertEquals } from "k6-testing";

assert(condition, "error message");
assertEquals(actual, expected, "error message");
```

## Progressive Testing Approach

k6-testing offers multiple layers of assertion capabilities:

1. **Basic**: Start with simple `assert()` for straightforward checks
2. **Standard**: Use `expect()` for more expressive assertions
3. **Advanced**: Leverage retrying assertions for robust UI testing
4. **Comprehensive**: Combine with soft assertions for thorough test coverage

## Error Handling

Get clear, actionable error messages:

```javascript
expect(value).toBe(expected);
// Error: Expected value to be undefined
//   Expected: undefined
//   Received: "actual value"
```

## Contributing

Contributions are welcome! Check out our [Contributing Guide](CONTRIBUTING.md) for details.

## License

[MIT License](LICENSE)