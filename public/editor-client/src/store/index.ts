import { proxy } from "valtio/vanilla";
import type { State } from "./types";

export const store = proxy<State>({
  symbols: {
    toCreate: [],
    toUpdate: [],
    toDelete: []
  }
});
