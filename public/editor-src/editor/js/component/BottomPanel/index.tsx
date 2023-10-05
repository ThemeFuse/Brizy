import React, { ComponentType, ReactElement, useMemo } from "react";
import items from "./items";

const objectIsReactClassObject = (o: unknown): o is { displayName: string } => {
  if (typeof o === "object" && o !== null) {
    return "displayName" in o;
  }
  return false;
};

const isComponentType = (c: unknown): c is ComponentType =>
  typeof c === "function" || objectIsReactClassObject(c);

export default function BottomPanel(): ReactElement {
  const panelItems = useMemo(() => {
    return items.filter(isComponentType).map((Item, index): ReactElement => {
      // @ts-expect-error: Type 'undefined' is not assignable to type 'Element | null'.
      return <Item key={index} />;
    });
  }, []);

  return (
    <div className="brz-ed-fixed-bottom-panel">
      <ul className="brz-ul">{panelItems}</ul>
    </div>
  );
}
