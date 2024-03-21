import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { fromElementModel } from "visual/utils/options/Animation/converters";
import { Value } from "visual/utils/options/Animation/types/Value";
import { DESKTOP } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";

export const makeOptionValueToAnimation = (
  v: ElementModel,
  prefix: undefined | string = "hover"
): Partial<Value> => {
  const getDesktop: FromElementModelGetter = (k) =>
    defaultValueValue({
      v,
      key: createOptionId(prefix, k),
      device: DESKTOP,
      state: NORMAL
    });

  return fromElementModel(getDesktop);
};
