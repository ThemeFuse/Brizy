import React from "react";
import classnames from "classnames";
import Config from "visual/global/Config";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import EditorIcon from "visual/component/EditorIcon";
import Toolbar from "visual/component/Toolbar";
import { css } from "visual/utils/cssStyle";
import { styles } from "./styles";
import * as toolbar from "./toolbar";
import * as sidebar from "./sidebar";
import defaultValue from "./defaultValue.json";
import BoxResizer from "visual/component/BoxResizer";

const resizerPoints = ["centerLeft", "centerRight"];

export default class Search extends EditorComponent {
  static get componentId() {
    return "Search";
  }
  static defaultValue = defaultValue;

  inputRef = React.createRef();

  handleResizerChange = patch => this.patchValue(patch);

  handleInputChange = e =>
    this.patchValue({
      label: e.target.value
    });

  handleInputClick = e => {
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
    return <EditorIcon className="brz-search-icon__style1" icon="nc-search" />;
  }

  renderForEdit(v, vs, vd) {
    const { searchStyle, customCSS, label, className: _className } = v;
    const className = classnames(
      "brz-search-container",
      `brz-search-container--${searchStyle}`,
      _className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styles(v, vs, vd)
      )
    );
    const resizerRestrictions = {
      width: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      tabletWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      },
      mobileWidth: {
        px: {
          min: 5,
          max: 1000
        },
        "%": {
          min: 5,
          max: 100
        }
      }
    };

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <div className={className}>
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
          </div>
        </CustomCSS>
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
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styles(v, vs, vd)
      )
    );
    const formAction = Config.get("urls").site;

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={className}>
          <form
            className="brz-form brz-search-form"
            action={formAction}
            method="get"
          >
            {searchStyle !== "classic" && this.renderIcon()}
            <input
              name="s"
              className="brz-input brz-search"
              placeholder={label}
            />
            {searchStyle === "classic" && this.renderButton()}
          </form>
        </div>
      </CustomCSS>
    );
  }
}
