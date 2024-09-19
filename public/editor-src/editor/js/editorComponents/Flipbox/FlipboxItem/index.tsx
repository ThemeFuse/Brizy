import React, { createRef, JSX } from "react";
import Background from "visual/component/Background";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Trigger } from "../types";
import { Content } from "./Content";
import defaultValue from "./defaultValue.json";
import Items from "./Items";
import { Props, Value } from "./types";

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

  componentDidUpdate(): void {
    const { type, updateHeight } = this.props;

    if (type === "back") {
      updateHeight();
    }
  }

  renderFlipboxItem(isActive: boolean): JSX.Element {
    const { animationClassName, type, meta, backgroundValue } = this.props;

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

  renderForEdit(): JSX.Element {
    const { type, flipboxActive } = this.props;

    const isActive = type === flipboxActive;

    return this.renderFlipboxItem(isActive);
  }

  renderForView(): JSX.Element {
    const { type, trigger } = this.props;

    const isActive = type === "front" && trigger === Trigger.Click;

    return this.renderFlipboxItem(isActive);
  }
}

export default FlipboxItem;
