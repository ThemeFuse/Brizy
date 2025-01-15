import classnames from "classnames";
import React, { Component, ReactElement, ReactNode, createRef } from "react";
import { RenderType, isEditor } from "visual/providers/RenderProvider";
import { DeviceMode } from "visual/types";
import { encodeToString } from "visual/utils/string";

export interface Props {
  children: ReactNode;
  renderContext: RenderType;
  className?: string;
  position?: "right-start" | "left-start" | "bottom-start";
  target?: null | HTMLElement;
  mods?: Record<DeviceMode, "vertical" | "horizontal">;
  placement?: Record<DeviceMode, Props["position"]>;
}

interface State {
  position: Props["position"];
}

class MenuDropDown extends Component<Props, State> {
  static defaultProps = {
    className: "",
    position: "right-start",
    target: null
  };

  state: State = {
    position: this.props.position
  };

  content = createRef<HTMLUListElement>();

  node: HTMLUListElement | null = null;

  isReposition = false;

  componentDidMount(): void {
    this.node = this.content.current;
    this.reposition();
  }

  componentDidUpdate(): void {
    if (this.isReposition) {
      return;
    }

    this.reposition();
  }

  getClassName(): string {
    return classnames("brz-menu__dropdown", this.props.className);
  }

  reposition(): void {
    let { target } = this.props;

    if (!target) {
      target = window.document.body;
    }

    const { left = 0, right = 0 } = this.node?.getBoundingClientRect() ?? {};
    const { width: targetWidth } = target.getBoundingClientRect();

    if (right >= targetWidth) {
      this.isReposition = true;
      this.setState(
        { position: "left-start" },
        () => (this.isReposition = false)
      );
    }

    if (left <= 0) {
      this.isReposition = true;
      this.setState(
        { position: "right-start" },
        () => (this.isReposition = false)
      );
    }
  }

  renderForView(): ReactElement {
    const { mods, placement, children } = this.props;
    const settings = encodeToString({ mods, placement });

    return (
      <ul data-settings={settings} className={this.getClassName()}>
        {children}
      </ul>
    );
  }

  renderForEdit(): ReactElement {
    return (
      <ul
        ref={this.content}
        data-popper-placement={this.state.position}
        className={this.getClassName()}
      >
        {this.props.children}
      </ul>
    );
  }

  render(): ReactElement {
    return isEditor(this.props.renderContext)
      ? this.renderForEdit()
      : this.renderForView();
  }
}

export default MenuDropDown;
