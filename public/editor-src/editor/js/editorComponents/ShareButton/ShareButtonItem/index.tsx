import classnames from "classnames";
import React, { ReactNode } from "react";
import { TextEditor } from "visual/component/Controls/TextEditor";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { ItemValue, View } from "../types";
import { getNetworkInfo, getView } from "../utils";
import defaultValue from "./defaultValue.json";
import * as sidebarExtend from "./sidebarExtend";
import { style } from "./styles";
import * as toolbarExtend from "./toolbarExtend";

export default class ShareButtonItem extends EditorComponent<ItemValue> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.ShareButtonItem {
    return ElementTypes.ShareButtonItem;
  }

  handleLabelChange = (customLabelText: string): void => {
    this.patchValue({ customLabelText });
  };

  renderForEdit(v: ItemValue, vs: ItemValue, vd: ItemValue): ReactNode {
    const {
      iconType,
      iconName,
      network,
      customLabelText,
      view,
      targetUrl,
      href
    } = v;

    const networkInfo = getNetworkInfo(network);
    const _view = getView(view);

    const className = classnames(
      "brz-shareButton__item",
      { "brz-shareButton__icon-only": _view === View.Icon },
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarExtend, sidebarExtend)}
      >
        {({ ref }) => (
          <div
            className={className}
            {...makeDataAttr({ name: "network", value: network })}
            {...makeDataAttr({ name: "target", value: targetUrl })}
            {...makeDataAttr({ name: "href", value: href })}
            ref={ref}
          >
            {iconName && iconType && (
              <div className="brz-shareButton__item-icon">
                <ThemeIcon
                  name={networkInfo.iconName}
                  type={networkInfo.iconType}
                />
              </div>
            )}
            <div className="brz-shareButton__item-text">
              {customLabelText === "" ? (
                <span className="brz-span">{networkInfo.labelText}</span>
              ) : (
                <TextEditor
                  value={customLabelText}
                  onChange={this.handleLabelChange}
                />
              )}
            </div>
          </div>
        )}
      </Toolbar>
    );
  }
}
