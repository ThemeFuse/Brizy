import { ValuePartial } from "visual/component/Controls/Transform/types/Value";
import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { defaultValueValue } from "visual/utils/onChange/device";
import { fromElementModel } from "visual/utils/options/Transform/converters";
import {
  DESKTOP,
  MOBILE,
  ResponsiveMode,
  TABLET
} from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";
import { Store } from "visual/redux/store";

const transformIsActive = (v: ValuePartial): boolean =>
  !!(v.rotate || v.flip || v.offset || v.scale || v.skew);

const getter =
  (device: ResponsiveMode, v: ElementModel): FromElementModelGetter =>
  (k) =>
    defaultValueValue({
      v,
      key: createOptionId("transform", k),
      device,
      state: NORMAL
    });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const hasTransform = (v: ElementModel, _: Store): boolean => {
  const getDesktop = getter(DESKTOP, v);
  const getTablet = getter(TABLET, v);
  const getMobile = getter(MOBILE, v);

  const desktopModel = fromElementModel(getDesktop);
  const tabletModel = fromElementModel(getTablet);
  const mobileModel = fromElementModel(getMobile);

  const desktopTransform = transformIsActive(desktopModel);
  const tabletTransform = transformIsActive(tabletModel);
  const mobileTransform = transformIsActive(mobileModel);

  return desktopTransform || tabletTransform || mobileTransform;
};
