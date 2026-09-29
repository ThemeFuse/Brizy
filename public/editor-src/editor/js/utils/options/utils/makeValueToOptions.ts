import type { ElementModel } from "visual/component/Elements/Types";
import type { FromElementModelGetter } from "visual/component/Options/Type";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import type { Store } from "visual/redux/store";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Animation/converters";
import type { Value } from "visual/utils/options/Animation/types/Value";
import { DESKTOP } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";

export const makeOptionValueToAnimation = (data: {
  v: ElementModel;
  store: Store;
  prefix?: string;
}): Partial<Value> => {
  const { v, prefix = "hover" } = data;

  const getDesktop: FromElementModelGetter = (k) =>
    defaultValueValue({
      v,
      key: createOptionId(prefix, k),
      device: DESKTOP,
      state: NORMAL
    });

  return fromElementModel(getDesktop);
};
