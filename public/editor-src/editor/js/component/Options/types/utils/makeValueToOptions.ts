import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { fromElementModel } from "visual/component/Options/types/dev/Animation/converters";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { DESKTOP } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";
import { Value } from "../dev/Animation/types/Value";

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
