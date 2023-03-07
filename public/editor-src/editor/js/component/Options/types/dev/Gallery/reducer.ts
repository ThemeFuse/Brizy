import { replaceAt } from "timm";
import * as Arr from "visual/utils/array";
import { Actions } from "./types/Actions";
import * as Item from "./types/Item";
import { maxId } from "./utils";

export function reducer(
  s: Item.Item<number>[],
  a: Actions
): Item.Item<number>[] {
  switch (a.type) {
    case "Add": {
      const max = maxId(s);
      return [...s, ...a.payload.map((p, i) => Item.loading(i + max + 1, p))];
    }
    case "Remove":
      return s.filter((i) => i.id !== a.payload);
    case "Sort":
      return Arr.move(a.payload.from, a.payload.to, s);
    case "FetchError": {
      const item = Arr.findIndex(
        (i) => i.id === a.payload.id && i.__type === "loading",
        s
      );

      return item === undefined
        ? s
        : replaceAt(s, item, Item.error(a.payload.id, a.payload.message));
    }
    case "FetchSuccess": {
      const item = Arr.findIndex(
        (i) => i.id === a.payload.id && i.__type === "loading",
        s
      );

      return item === undefined
        ? s
        : replaceAt(s, item, Item.thumbnail(a.payload.id, a.payload.data));
    }
  }
}
