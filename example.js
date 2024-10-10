import { assert, expect } from "./dist/index.js";

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
  assert(1 === 1, "1 should be equal to 1");
  expect(1).toEqual(1);
}

export function sadFunc() {
  assert(2 === 1, "1 should be equal to 1");
}
