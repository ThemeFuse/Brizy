import classnames from "classnames";
import React, { ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { Patch } from "visual/component/BoxResizer/types";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { HoverAnimation } from "visual/component/HoverAnimation/HoverAnimation";
import { getHoverAnimationOptions } from "visual/component/HoverAnimation/utils";
import Link from "visual/component/Link";
import { makeOptionValueToAnimation } from "visual/component/Options/types/utils/makeValueToOptions";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { hasSizing } from "visual/editorComponents/Button/utils";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import Config from "visual/global/Config";
import { blocksDataSelector, deviceModeSelector } from "visual/redux/selectors";
import { getStore } from "visual/redux/store";
import { Block } from "visual/types";
import { css } from "visual/utils/cssStyle";
import { pipe } from "visual/utils/fp";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import * as Num from "visual/utils/reader/number";
import * as State from "visual/utils/stateMode";
import * as Str from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { MValue, isNullish } from "visual/utils/value";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style, styleIcon } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Props, Value } from "./types";

const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

const restrictions = {
  width: {
    "%": { min: 10, max: 100 }
  },
  height: {
    "%": { min: 5, max: Infinity }
  }
};

const isNan = pipe(Num.read, isNullish);

export default class Button extends EditorComponent<Value, Props> {
  static get componentId(): "Button" {
    return "Button";
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  handleResizerChange = (patch: Patch): void => this.patchValue(patch);

  handleTextChange = (patch: { [k: string]: string }): void =>
    this.patchValue(patch);

  renderIcon(v: Value, vs: Value, vd: Value): ReactNode {
    const { iconName, iconType } = v;

    const iconClassName = classnames(
      css(
        `${this.getComponentId()}-icon`,
        `${this.getId()}-icon`,
        styleIcon(v, vs, vd)
      )
    );

    return (
      <ThemeIcon className={iconClassName} name={iconName} type={iconType} />
    );
  }

  renderSubmit(v: Value, vs: Value, vd: Value, content: ReactNode): ReactNode {
    const {
      cssClassPopulation,
      customClassName,
      cssIDPopulation,
      customID,
      tabsState,
      type
    } = v;
    const device = deviceModeSelector(this.getReduxState());
    const state = State.mRead(tabsState);

    const populationClassName =
      cssClassPopulation === ""
        ? Str.mRead(customClassName)
        : Str.mRead(cssClassPopulation);

    const className = classnames(
      "brz-btn",
      "brz-btn-submit",
      populationClassName,
      css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, hasSizing(v, device, state), device)
      )
    );

    const componentType = IS_EDITOR ? "a" : "button";
    const id: string =
      cssIDPopulation === "" ? customID : (cssIDPopulation as string);

    return (
      <Wrapper
        {...this.makeWrapperProps({ className })}
        component={componentType}
        attributes={{
          ...this.props.attributes,
          ...(id && { id })
        }}
      >
        {hasSizing(v, device, state) && type !== "submit" ? (
          <BoxResizer
            points={resizerPoints}
            value={v}
            onChange={this.handleResizerChange}
            restrictions={restrictions}
          >
            {content}
          </BoxResizer>
        ) : (
          content
        )}
      </Wrapper>
    );
  }

  renderLink(v: Value, vs: Value, vd: Value, content: ReactNode): ReactNode {
    const {
      linkType,
      linkAnchor,
      linkToSlide,
      linkExternalBlank,
      linkExternalType,
      linkExternalRel,
      linkPopup,
      linkUpload,
      actionClosePopup,
      customClassName,
      customID,
      cssIDPopulation,
      cssClassPopulation,
      pageLink,
      tabsState
    } = v;

    const state = State.mRead(tabsState);
    const device = deviceModeSelector(this.getReduxState());

    const _className =
      cssClassPopulation === ""
        ? Str.mRead(customClassName)
        : Str.mRead(cssClassPopulation);

    const _id =
      cssIDPopulation === "" ? Str.mRead(customID) : Str.mRead(cssIDPopulation);

    const className = classnames(
      "brz-btn",
      _className,
      css(
        `${this.getComponentId()}-bg`,
        `${this.getId()}-bg`,
        style(v, vs, vd, hasSizing(v, device, state), device)
      ),
      {
        "brz-popup2__action-close":
          linkType === "action" && actionClosePopup === "on"
      }
    );

    const hrefs = {
      anchor: linkAnchor,
      story: isNan(linkToSlide) ? "" : `slide-${linkToSlide}`,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload,
      page: pageLink,
      action: "",
      lightBox: ""
    };

    const slideAnchor =
      linkType === "story" && !isNan(linkToSlide)
        ? { "data-brz-link-story": linkToSlide }
        : {};

    const props: {
      type: string;
      href: string;
      target: string;
      rel: string;
      className: string;
      onDragStart?: (e: Event) => void;
      draggable?: string;
      id: string;
    } = {
      type: linkType,
      href: hrefs[linkType],
      target: linkExternalBlank,
      rel: linkExternalRel,
      className: className,
      id: _id
    };

    if (IS_EDITOR) {
      props.onDragStart = (e) => {
        e.preventDefault();
        return false;
      };
      props.draggable = "false";
    }

    return (
      <Wrapper
        {...this.makeWrapperProps({ attributes: props, slide: slideAnchor })}
        component={Link}
      >
        {hasSizing(v, device, state) ? (
          <BoxResizer
            points={resizerPoints}
            value={v}
            onChange={this.handleResizerChange}
            restrictions={restrictions}
          >
            {content}
          </BoxResizer>
        ) : (
          content
        )}
      </Wrapper>
    );
  }

  renderPopups(): ReactNode {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        let {
          value: { popupId }
        } = itemData;

        const { blockId } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(getStore().getState());
          const blockData = globalBlocks[itemData.value._id];

          popupId = blockData.value.popupId;
        }

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : itemData.type === "GlobalBlock"
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...popupsProps} />;
  }

  dvv = (key: string): MValue<Literal> => {
    const v = this.getValue();
    const device = deviceModeSelector(this.getReduxState());
    const state = State.mRead(v.tabsState);

    return defaultValueValue({ v, key, device, state });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { type, iconName, iconType, customCSS, tabsState } = v;
    const IS_STORY = isStory(Config.getAll());
    const state = State.mRead(tabsState);
    const device = deviceModeSelector(this.getReduxState());

    const renderIcon = iconName && iconType;
    const hoverName = Str.read(this.dvv("hoverName")) ?? "none";
    const content =
      hasSizing(v, device, state) && IS_EDITOR && type !== "submit" ? (
        <div className="brz-btn--story-container">
          {renderIcon && this.renderIcon(v, vs, vd)}
          <Text id="text" v={v} onChange={this.handleTextChange} />
        </div>
      ) : (
        <>
          {renderIcon && this.renderIcon(v, vs, vd)}
          <Text id="text" v={v} onChange={this.handleTextChange} />
        </>
      );

    const renderButton =
      type === "link"
        ? this.renderLink(v, vs, vd, content)
        : this.renderSubmit(v, vs, vd, content);

    const options = makeOptionValueToAnimation(v);

    const { cloneableAnimationId } = this.props.meta;
    const animationId = Str.read(cloneableAnimationId) ?? this.getId();
    const isHidden = IS_STORY || (IS_PREVIEW && hoverName === "none");

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            <HoverAnimation
              animationId={animationId}
              className="brz-btn-hover__unset-height"
              cssKeyframe={hoverName}
              options={getHoverAnimationOptions(options, hoverName)}
              isHidden={isHidden}
            >
              {renderButton}
            </HoverAnimation>
          </CustomCSS>
        </Toolbar>
        {shouldRenderPopup(v, blocksDataSelector(getStore().getState())) &&
          this.renderPopups()}
      </>
    );
  }
}
