import React, { ReactElement } from "react";
import EditorComponent, {
  ComponentsMeta
} from "visual/editorComponents/EditorComponent";
import defaultValue from "./defaultValue.json";
import Toolbar from "visual/component/Toolbar";
import { ElementModel } from "visual/component/Elements/Types";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";

type Value = ElementModel & {
  label: string;
  value: string;
};

type Props = {
  meta: ComponentsMeta;
  toolbarExtend: PortalToolbarProps;
};

export default class FiltersOption extends EditorComponent<Value, Props> {
  static get componentId(): string {
    return "FiltersOption";
  }

  static defaultValue = defaultValue;

  renderForEdit(v: Value): ReactElement {
    return (
      <Toolbar
        // @ts-expect-error: Need convert toolbarConfig to TS
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig, {
          allowExtend: true
        })}
      >
        <div className="brz-filters__select__item brz-filters__select__input">
          <input
            className="brz-input brz-input__select"
            value={v.label}
            disabled
          />
        </div>
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactElement {
    return <option value={v.label}>{v.label}</option>;
  }
}
