import { Arr, Bool, Str } from "@brizy/readers";
import classnames from "classnames";
import { mPipe, or } from "fp-utilities";
import React, { useCallback } from "react";
import { addFirst, getIn, setIn } from "timm";
import { RootContainer } from "visual/component/RootContainer";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import EditorGlobal from "visual/global/Editor";
import { useConfig } from "visual/providers/ConfigProvider";
import { EditorMode } from "visual/providers/EditorModeProvider";
import { ServerStyleSheet } from "visual/providers/StyleProvider/ServerStyleSheet";
import {
  pageDataDraftBlocksSelector,
  triggersSelector
} from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { TriggerType, Triggers } from "visual/types";
import { makeAttr } from "visual/utils/i18n/attribute";
import { isExternalPopup, isInternalPopup } from "visual/utils/models";
import { compileProject } from "../compileProject";
import { Providers } from "../controls/Providers";
import { Asset } from "../transforms/assets";
import { projectClassName } from "../utils/projectClassName";
import { baseToStatic } from "./baseToStatic";
import { Output } from "./types";

interface Props {
  store: Store;
  config: ConfigCommon;
  editorMode: EditorMode;
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

const RenderPage = (props: {
  store: Store;
  editorMode: EditorMode;
  className?: string;
}) => {
  const { store, editorMode, className } = props;
  const { PagePopup } = EditorGlobal.getComponents();

  const config = useConfig();
  const getGlobalConfig = useCallback(() => config, [config]);

  if (!PagePopup) {
    throw Error("Missing PagePopup Components", EditorGlobal.getComponents());
  }

  const reduxState = store.getState();
  const dbValue = pageDataDraftBlocksSelector(reduxState);

  return (
    <>
      {/* @ts-expect-error: Missing optional props */}
      <PagePopup
        className={className}
        dbValue={dbValue}
        reduxStore={store}
        reduxState={reduxState}
        renderContext="view"
        editorMode={editorMode}
        getGlobalConfig={getGlobalConfig}
      />
    </>
  );
};

export const popupToStatic = (props: Props): Output => {
  const { store, config, editorMode } = props;
  const reduxState = store.getState();
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
  const sheet = new ServerStyleSheet();

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
    <Providers
      store={store}
      sheet={sheet.instance}
      config={config}
      editorMode={editorMode}
    >
      <RootContainer className={rootClassName} attr={attr}>
        <RenderPage
          className={className}
          store={store}
          editorMode={editorMode}
        />
      </RootContainer>
    </Providers>
  );

  const output = baseToStatic({ store, Page, sheet: sheet.instance, config });

  if (isInternal) {
    return output;
  }

  // For External Popup we need to embedded global css(pallet) inside pageStyles
  const projectAssets = compileProject(config, store);
  const pageStylesPath = ["assets", "freeStyles", "pageStyles"];
  const pageStyles = (getIn(output, pageStylesPath) ?? []) as Array<Asset>;
  const newPageStyles = addFirst(pageStyles, projectAssets);

  return setIn(
    output,
    ["assets", "freeStyles", "pageStyles"],
    newPageStyles
  ) as Output;
};
