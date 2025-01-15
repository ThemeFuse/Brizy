import classnames from "classnames";
import React, { ReactNode } from "react";
import { isEditor, isView } from "visual/providers/RenderProvider";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makeAttr } from "visual/utils/i18n/attribute";
import { defaultValueValue } from "visual/utils/onChange";
import * as Str from "visual/utils/reader/string";
import * as State from "visual/utils/stateMode";
import { MValue } from "visual/utils/value";
import { Wrapper } from "../tools/Wrapper";
import Items from "./Items";
import defaultValue from "./defaultValue.json";
import * as Flipboxpatch from "./patch";
import * as sidebar from "./sidebar";
import { style } from "./styles";
import * as toolbar from "./toolbar";
import {
  FlipboxType,
  Meta,
  Patch,
  Props,
  Value,
  State as _State
} from "./types";
import { getHeight } from "./utils";

class Flipbox extends EditorComponent<Value, Props, _State> {
  static get componentId(): ElementTypes.Flipbox {
    return ElementTypes.Flipbox;
  }

  static experimentalDynamicContent = true;
  static defaultValue = defaultValue;

  state = {
    isTransitioned: false,
    height: 0,
    itTurns: false
  };

  lastFlipboxActive: FlipboxType = "front";

  animationFrameId: MValue<number> = undefined;
  updateHeightFrameId: MValue<number> = undefined;

  frontSideNode: MValue<HTMLDivElement> = undefined;
  backSideNode: MValue<HTMLDivElement> = undefined;
  wrapperRef = React.createRef<HTMLDivElement>();

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(toolbar, sidebar, {
      allowExtendFromThirdParty: true
    });
    this.props.extendParentToolbar(toolbarExtend);

    const node = this.wrapperRef.current;

    if (node) {
      this.attachTransitionEvents(node);
    }
  }

  componentWillUnmount(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.updateHeightFrameId) {
      cancelAnimationFrame(this.updateHeightFrameId);
    }

    const node = this.wrapperRef.current;

    if (node) {
      this.detachTransitionEvents(node);
    }
  }

  patchValue(patch: Patch, meta: Meta): void {
    const newPatch = this.handleFlipboxPatch(patch);
    super.patchValue({ ...patch, ...newPatch }, meta);
  }

  handleFlipboxPatch(patch: Patch): Partial<Value> {
    const transitionPatch = Flipboxpatch.onTransition(patch);
    const directionPatch = Flipboxpatch.onDirection(patch);

    if (transitionPatch || directionPatch) {
      this.setState({ isTransitioned: true }, this.resetTransition);

      return { flipboxActive: "front" };
    }

    return {};
  }

  attachTransitionEvents(node: HTMLDivElement): void {
    node.addEventListener("transitionstart", this.handleTransitionStart);
    node.addEventListener("transitionend", this.handleTransitionEnd);
  }

  detachTransitionEvents(node: HTMLDivElement): void {
    node.removeEventListener("transitionstart", this.handleTransitionStart);
    node.removeEventListener("transitionend", this.handleTransitionEnd);
  }

  handleTransitionStart = (): void => {
    const { flipboxActive: currentFlipboxActive } = this.getValue();

    if (this.lastFlipboxActive !== currentFlipboxActive) {
      this.setState({ itTurns: true });
    }
  };

  handleTransitionEnd = (): void => {
    const { flipboxActive: currentFlipboxActive } = this.getValue();

    if (this.lastFlipboxActive !== currentFlipboxActive) {
      this.lastFlipboxActive = currentFlipboxActive;
      this.setState({ itTurns: false });
    }
  };

  setNode = (type: FlipboxType, node: HTMLDivElement): void => {
    this[`${type}SideNode`] = node;
  };

  updateHeight = (): void => {
    const { transition } = this.getValue();
    const { height: currentHeight, itTurns } = this.state;

    this.updateHeightFrameId = requestAnimationFrame(() => {
      if (this.frontSideNode && this.backSideNode && !itTurns) {
        const settings =
          transition === "zoomIn" || transition === "zoomOut"
            ? { resetTransition: true, resetTransform: true }
            : undefined;
        const frontSideHeight = getHeight(this.frontSideNode);
        const backSideHeight = getHeight(this.backSideNode, settings);

        if (
          currentHeight !== backSideHeight &&
          backSideHeight > frontSideHeight
        ) {
          this.setState({
            height: backSideHeight
          });
        }
      }
    });
  };

  resetTransition(): void {
    this.animationFrameId = requestAnimationFrame(() => {
      this.setState({ isTransitioned: false });
    });
  }

  dvv = (key: string): unknown => {
    const v = this.getValue();
    const device = this.getDeviceMode();
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { meta } = this.props;
    const { trigger, transition, direction } = v;
    const { height, isTransitioned } = this.state;

    const flipboxActive = this.dvv("flipboxActive");

    const animationClassName = `brz-flipbox-${transition}-${direction}`;
    const _isView = isView(this.renderContext);
    const _isEditor = isEditor(this.renderContext);

    const className = classnames(
      "brz-flipbox",
      `brz-flipbox-${transition}`,
      {
        [`brz-flipbox-${trigger}`]: _isView,
        "brz-flipbox-back-active": _isEditor && flipboxActive === "back"
      },
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    const classNameContent = classnames(
      "brz-flipbox-content",
      `brz-flipbox-content-${transition}`,
      `brz-flipbox-content-${transition}-${direction}`,
      {
        "brz-flipbox-disable-front": flipboxActive === "back",
        "brz-flipbox--transition": isTransitioned
      }
    );

    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      meta,
      itemProps: {
        v,
        animationClassName,
        flipboxActive,
        trigger,
        setNode: this.setNode,
        updateHeight: this.updateHeight
      }
    });

    const parentStyle = height
      ? {
          minHeight: `${height}px`
        }
      : undefined;

    return (
      <Wrapper
        {...this.makeWrapperProps({ className })}
        attributes={{
          ...(_isView
            ? {
                [makeAttr("trigger")]: Str.read(trigger) ?? "hover",
                [makeAttr("transition")]: transition
              }
            : {})
        }}
      >
        <div
          className={classNameContent}
          style={parentStyle}
          ref={this.wrapperRef}
        >
          {/* @ts-expect-error: Need transform EditorArrayComponents to ts */}
          <Items {...itemsProps} />
        </div>
      </Wrapper>
    );
  }
}

export default Flipbox;
