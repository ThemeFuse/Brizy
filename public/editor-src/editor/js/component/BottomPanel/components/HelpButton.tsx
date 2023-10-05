import React, { ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { BottomPanelItem } from "./Item";

function HelpButton(): ReactElement {
  return (
    <BottomPanelItem paddingSize="medium" active pointer title="Help">
      <EditorIcon icon={"nc-help"} />
    </BottomPanelItem>
  );
}

export default HelpButton;
