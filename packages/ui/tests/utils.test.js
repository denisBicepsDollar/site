import assert from "node:assert/strict";
import {test} from "node:test";
import {cn} from "../lib/utils.js";

test("cn merges conflicting Tailwind utilities", () => {
    assert.equal(cn("p-2", "p-4"), "p-4");
    assert.equal(cn("text-red-500", "text-blue-500"), "text-blue-500");
});
