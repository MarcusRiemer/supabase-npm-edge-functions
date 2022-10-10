import { produce } from "immer";

export const CORE_DATA = {
  "foo": [1,2,3]
}

export function update(data: number[]) {
  return produce(CORE_DATA, (state) => {
    state.foo = data;
  });
}