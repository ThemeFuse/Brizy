import classnames from "classnames";
import React from "react";
import { Arr, Bool, Str } from "@brizy/readers";
import { mPipe, or } from "fp-utilities";
import { Root } from "visual/component/Root";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import {
  pageDataDraftBlocksSelector,
  triggersSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { projectClassName } from "../utils/projectClassName";
import { baseToStatic } from "./baseToStatic";
import { makeAttr } from "visual/utils/i18n/attribute";
import { Triggers, TriggerType } from "visual/types";
import { isExternalPopup, isInternalPopup } from "visual/utils/models";
import { compileProject } from "../compileProject";
import { addFirst, getIn, setIn } from "timm";
import { Asset } from "../transforms/assets";
import { Output } from "./types";

interface Props {
  store: Store;
  config: ConfigCommon;
}

const encodeIdsList = [
  TriggerType.Scrolling,
  TriggerType.Showing,
  TriggerType.Devices,
  TriggerType.Referrer,
  TriggerType.LoggedIn,
  TriggerType.CurrentUrl,
  TriggerType.CurrentDate,
  TriggerType.LastVisitDate,
  TriggerType.TimeFrom,
  TriggerType.Cookie,
  TriggerType.OS,
  TriggerType.OtherPopups,
  TriggerType.SpecificPopup
];

const encodeData = (data: unknown): string =>
  encodeURIComponent(JSON.stringify(data));
const decodeData = (data: string): unknown =>
  JSON.parse(decodeURIComponent(data));
const convertString = (name: string): string =>
  name.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);

const getData = mPipe(Str.read, decodeData, Arr.read);
const readValue = or(Str.read, Bool.read);

export const popupToStatic = async (props: Props): Promise<Output> => {
  const { store, config } = props;
  const { PagePopup } = EditorGlobal.getComponents();

  if (!PagePopup) {
    throw Error("Missing PagePopup Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const dbValue = pageDataDraftBlocksSelector(reduxState);
  const triggers: Triggers = triggersSelector(reduxState);
  const isInternal = isInternalPopup(config);
  const isExternal = isExternalPopup(config);
  // if we add external popup to brizy page - his global styles rewrite page global styles
  const className = isExternal ? projectClassName(config) : undefined;
  const popupSettings = config.ui?.popupSettings ?? {};
  const embedded = popupSettings.embedded;
  const rootClassName = classnames("brz-conditions-popup", "brz", {
    "brz-conditions-popup--static": embedded,
    "brz-conditions-internal-popup": isInternal,
    "brz-conditions-external-popup": isExternal
  });

  const attr = triggers
    .filter((t) => t.active)
    .reduce(
      (acc, item) => {
        const { id, value } = item;
        const convertedKey = makeAttr(convertString(id));

        if (encodeIdsList.includes(id)) {
          const itemValue = getData(acc[convertedKey]);

          acc[convertedKey] = itemValue
            ? encodeData([...itemValue, value])
            : encodeData([value]);
        } else {
          const v = readValue(value);
          if (v !== undefined) {
            acc[convertedKey] = v;
          }
        }

        return acc;
      },
      {} as Record<string, string | boolean>
    );

  const Page = (
    <Root className={rootClassName} type="popup" attr={attr}>
      {/* @ts-expect-error: Missing optional props */}
      <PagePopup
        className={className}
        dbValue={dbValue}
        reduxState={reduxState}
      />
    </Root>
  );

  const output = await baseToStatic({ store, Page, config });

  if (isInternal) {
    return output;
  }

  // For External Popup we need to embedded global css(pallet) inside pageStyles
  const projectAssets = compileProject(config);
  const pageStylesPath = ["assets", "freeStyles", "pageStyles"];
  const pageStyles = (getIn(output, pageStylesPath) ?? []) as Array<Asset>;
  const newPageStyles = addFirst(pageStyles, projectAssets);

  return setIn(
    output,
    ["assets", "freeStyles", "pageStyles"],
    newPageStyles
  ) as Output;
};
