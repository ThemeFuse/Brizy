import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Animation/converters";
import { Value } from "visual/utils/options/Animation/types/Value";
import { DESKTOP } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";
import { Store } from "visual/redux/store";

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
