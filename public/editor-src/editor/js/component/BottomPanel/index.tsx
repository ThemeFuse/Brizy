import React, { ComponentType, ReactElement } from "react";
import { usePluginSlot } from "visual/plugins/PluginProvider";
import { SlotErrorBoundary } from "visual/plugins/SlotErrorBoundary";
import { useConfig } from "visual/providers/ConfigProvider";
import { makeBzelmAttr } from "visual/utils/i18n/attribute";
import { getComponents } from "./items";

const objectIsReactClassObject = (o: unknown): o is { displayName: string } => {
  if (typeof o === "object" && o !== null) {
    return "displayName" in o;
  }
  return false;
};

const isComponentType = (c: unknown): c is ComponentType =>
  typeof c === "function" || objectIsReactClassObject(c);

export default function BottomPanel(): JSX.Element {
  const config = useConfig();
  const panelItems = getComponents(config)
    .filter(isComponentType)
    .map((Item, index): ReactElement => {
      return <Item key={index} />;
    });

  const contributions = usePluginSlot("bottomPanel");

  return (
    <div className="brz-ed-fixed-bottom-panel">
      <ul className="brz-ul" {...makeBzelmAttr("publish-options")}>
        {panelItems}
      </ul>
      {contributions.length > 0 && (
        <SlotErrorBoundary>
          {contributions.map((c) => c.component && <c.component key={c.id} />)}
        </SlotErrorBoundary>
      )}
    </div>
  );
}
