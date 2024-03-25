import React, { ReactNode, createRef } from "react";
import Background from "visual/component/Background";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Content } from "visual/editorComponents/Flipbox/FlipboxItem/Content";
import {
  Props,
  Value
} from "visual/editorComponents/Flipbox/FlipboxItem/types";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import Items from "./Items";
import defaultValue from "./defaultValue.json";

class FlipboxItem extends EditorComponent<Value, Props> {
  static get componentId(): ElementTypes.FlipboxItem {
    return ElementTypes.FlipboxItem;
  }

  static defaultValue = defaultValue;

  flipboxItemRef = createRef<HTMLDivElement>();

  componentDidMount(): void {
    const { type, setNode, updateHeight } = this.props;

    const node = this.flipboxItemRef.current;

    if (node) {
      setNode(type, node);
      updateHeight();
    }
  }

  componentDidUpdate() {
    const { type, updateHeight } = this.props;

    if (type === "back") {
      updateHeight();
    }
  }

  renderForEdit(): ReactNode {
    const { animationClassName, type, flipboxActive, meta, backgroundValue } =
      this.props;

    const isActive = type === flipboxActive;

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      meta,
      isActive
    });

    return (
      <Content
        type={type}
        isActive={isActive}
        animationClassName={animationClassName}
        ref={this.flipboxItemRef}
      >
        <Background value={backgroundValue} meta={meta}>
          {/* @ts-expect-error: Need transform EditorArrayComponents to ts */}
          <Items {...itemsProps} />
        </Background>
      </Content>
    );
  }
}

export default FlipboxItem;
