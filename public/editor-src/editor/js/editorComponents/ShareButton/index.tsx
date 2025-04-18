import classnames from "classnames";
import React, { ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import Items from "./Items";
import defaultValue from "./defaultValue.json";
import { styleItem } from "./styles";
import * as toolbar from "./toolbar";
import { Props, Value } from "./types";

class ShareButton extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.ShareButton {
    return ElementTypes.ShareButton;
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { customCSS } = v;
    const { meta } = this.props;

    const className = classnames(
      "brz-shareButton",
      this.css(
        this.getComponentId(),
        this.getId(),
        styleItem({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      meta,
      toolbarExtend: this.makeToolbarPropsFromConfig2(toolbar, undefined, {
        allowExtend: false
      })
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        {({ ref: cssRef }) => (
          <Wrapper {...this.makeWrapperProps({ className, ref: cssRef })}>
            {
              // @ts-expect-error: Need transform EditorArrayComponents to ts
              <Items {...itemProps} />
            }
          </Wrapper>
        )}
      </CustomCSS>
    );
  }
}

export default ShareButton;
