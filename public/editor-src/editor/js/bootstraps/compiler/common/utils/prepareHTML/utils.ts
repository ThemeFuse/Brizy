import { Arr, Bool, Str } from "@brizy/readers";
import { mPipe, or } from "fp-utilities";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { triggersSelector } from "visual/redux/selectors";
import { Store } from "visual/redux/store";
import { TriggerType, Triggers } from "visual/types";
import { makeAttr } from "visual/utils/i18n/attribute";
import { isInternalPopup, isPopup } from "visual/utils/models";

const encodeData = (data: unknown): string =>
  encodeURIComponent(JSON.stringify(data));

const decodeData = (data: string): unknown =>
  JSON.parse(decodeURIComponent(data));

const convertString = (name: string): string =>
  name.replace(/([A-Z])/g, (letter) => `_${letter.toLowerCase()}`);

const getData = mPipe(Str.read, decodeData, Arr.read);
const readValue = or(Str.read, Bool.read);

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

export function getRootAttr(
  config: ConfigCommon,
  store: Store
): Record<string, string | boolean> {
  if (!isPopup(config)) {
    return {};
  }

  const reduxState = store.getState();
  const triggers: Triggers = triggersSelector(reduxState);
  return triggers
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
}

export function getRootClassNames(config: ConfigCommon): Array<string> {
  const popupSettings = config.ui?.popupSettings ?? {};
  const embedded = popupSettings.embedded;

  if (isPopup(config)) {
    const isInternal = isInternalPopup(config);
    const cls = [
      "brz",
      "brz-conditions-popup",
      isInternal
        ? "brz-conditions-internal-popup"
        : "brz-conditions-external-popup"
    ];

    if (embedded) {
      cls.push("brz-conditions-popup--static");
    }

    return cls;
  }

  return [
    "brz",
    "brz-root__container",
    "brz-reset-all",
    "brz-root__container-page"
  ];
}
