import React from "react";
import items from "./items";

export default function BottomPanel() {
  const panelItems = items.map((Item, index) => <Item key={index} />);

  return (
    <div className="brz-ed-fixed-bottom-panel">
      <ul className="brz-ul">{panelItems}</ul>
    </div>
  );
}
