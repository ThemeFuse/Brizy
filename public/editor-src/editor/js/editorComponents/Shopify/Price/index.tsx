import classnames from "classnames";
import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import PortalToolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { css } from "visual/utils/cssStyle";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { Wrapper } from "../../tools/Wrapper";
import { Model } from "./Model";
import defaultValue from "./defaultValue.json";
import { getItems as sidebar } from "./sidebar";
import { style } from "./styles";
import { getItems as toolbar } from "./toolbar";

export class Price extends EditorComponent<Model> {
  static get componentId(): "Price" {
    return "Price";
  }

  static defaultValue = defaultValue;

  handleTextChange = (patch: ElementModel): void => this.patchValue(patch);

  renderForEdit(v: Model, vs: Model, vd: Model): React.ReactNode {
    const { customCSS, itemId } = v;

    const className = classnames(
      "brz-shopify-price",
      css(this.getId(), this.getId(), style(v, vs, vd))
    );

    return (
      <PortalToolbar
        {...this.makeToolbarPropsFromConfig2(
          { getItems: toolbar },
          { getItems: sidebar }
        )}
      >
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: makeDataAttr({ name: "product-handle", value: itemId })
            })}
          >
            <span className="price">45</span>
            <span className="currency">$</span>
          </Wrapper>
        </CustomCSS>
      </PortalToolbar>
    );
  }
}
