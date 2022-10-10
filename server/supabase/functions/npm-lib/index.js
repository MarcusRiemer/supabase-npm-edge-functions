"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.CORE_DATA = void 0;
const immer_1 = require("immer");
exports.CORE_DATA = {
    "foo": [1, 2, 3]
};
function update(data) {
    return (0, immer_1.produce)(exports.CORE_DATA, (state) => {
        state.foo = data;
    });
}
exports.update = update;
