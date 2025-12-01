import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import { styles } from "./styles";
import * as toolbar from "./toolbar";

const resizerPoints = ["centerLeft", "centerRight"];

export default class Search extends EditorComponent {
  static defaultValue = defaultValue;
  inputRef = React.createRef();

  static get componentId() {
    return ElementTypes.Search;
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  handleInputChange = (e) =>
    this.patchValue({
      label: e.target.value
    });

  handleInputClick = (e) => {
    e.preventDefault();

    this.inputRef.current?.classList.add("brz-ed-dd-cancel");
  };

  handleInputBlur = () => {
    this.inputRef.current?.classList.remove("brz-ed-dd-cancel");
  };

  renderButton() {
    const buttonsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.props.meta
      }
    });

    return <EditorArrayComponent {...buttonsProps} />;
  }

  renderIcon() {
    return (
      <ThemeIcon
        className="brz-search-icon__style1"
        type="editor"
        name="search"
      />
    );
  }

  renderForEdit(v, vs, vd) {
    const { searchStyle, customCSS, label, className: _className } = v;
    const className = classnames(
      "brz-search-container",
      `brz-search-container--${searchStyle}`,
      _className,
      this.css(
        this.getComponentId(),
        this.getId(),
        styles({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const resizerRestrictions = {
      width: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      tabletWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      mobileWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      }
    };

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
                <BoxResizer
                  points={resizerPoints}
                  restrictions={resizerRestrictions}
                  meta={this.props.meta}
                  value={v}
                  onChange={this.handleResizerChange}
                >
                  <form className="brz-form brz-search-form" noValidate>
                    {searchStyle !== "classic" && this.renderIcon()}
                    <input
                      name="s"
                      ref={this.inputRef}
                      className="brz-input brz-search"
                      autoComplete="off"
                      value={label}
                      onChange={this.handleInputChange}
                      onClick={this.handleInputClick}
                      onBlur={this.handleInputBlur}
                    />
                    {searchStyle === "classic" && this.renderButton()}
                  </form>
                </BoxResizer>
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { searchStyle, customCSS, label, className: _className } = v;
    const className = classnames(
      "brz-search-container",
      `brz-search-container--${
        searchStyle === "fullScreen" ? "minimal" : searchStyle
      }`,
      _className,
      this.css(
        this.getComponentId(),
        this.getId(),
        styles({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const formAction = this.getGlobalConfig()?.urls?.site;

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          <form
            className="brz-form brz-search-form"
            action={formAction}
            method="get"
          >
            <label for="search-field" className="sr-only">
              {label}
            </label>
            {searchStyle !== "classic" && this.renderIcon()}
            <input
              name="s"
              id="search-field"
              className="brz-input brz-search"
              placeholder={label}
            />
            {searchStyle === "classic" && this.renderButton()}
          </form>
        </Wrapper>
      </CustomCSS>
    );
  }
}
