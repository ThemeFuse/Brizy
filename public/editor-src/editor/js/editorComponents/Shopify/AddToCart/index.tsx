import classnames from "classnames";
import React, { ReactNode } from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementModel } from "visual/component/Elements/Types";
import PortalToolbar from "visual/component/Toolbar";
import CustomCSS from "visual/component/CustomCSS";
import { css } from "visual/utils/cssStyle";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import { style } from "./styles";
import { Text } from "visual/component/ContentOptions/types";
import ThemeIcon from "visual/component/ThemeIcon";

export interface Value extends ElementModel {
  itemId: string;
  text: string;
}

export class AddToCart extends EditorComponent<Value> {
  static get componentId(): "AddToCart" {
    return "AddToCart";
  }

  static defaultValue = defaultValue;

  handleTextChange = (patch: { [k: string]: string }): void =>
    this.patchValue(patch);

  renderIcon(v: Value): ReactNode {
    const { iconName, iconType } = v;

    if (iconName && iconType) {
      return (
        <ThemeIcon
          className="brz-shopify-icon-cart"
          name={iconName}
          type={iconType}
        />
      );
    }
  }
  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classnames(
      "brz-shopify-add-to-cart",
      css(this.getComponentId(), this.getId(), style(v, vs, vd))
    );

    return (
      <PortalToolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: { "data-product-handle": v.itemId }
            })}
            component={"button"}
          >
            {this.renderIcon(v)}
            <Text id="text" v={v} onChange={this.handleTextChange} />
          </Wrapper>
        </CustomCSS>
      </PortalToolbar>
    );
  }
}
