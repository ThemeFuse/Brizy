import { Store } from "visual/redux/store";
import { getFontStyles } from "./getFontStyles";

interface Data {
  id: string;
  store: Store;
}

export function getFontStyle(data: Data) {
  const { id, store } = data;

  return getFontStyles({
    includeDeleted: true,
    store
  }).find((fontStyle) => fontStyle.id === id);
}
