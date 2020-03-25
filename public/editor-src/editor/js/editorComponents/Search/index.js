import React from "react";
import classnames from "classnames";
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

class Search extends EditorComponent {
  static get componentId() {
    return "Search";
  }
  static defaultValue = defaultValue;

  input = React.createRef();

  handleClick = e => {
    e.preventDefault();
    const node = this.input.current;
    node && node.classList.add("brz-ed-dd-cancel");
  };

  handleBlur = () => {
    const node = this.input.current;
    node && node.classList.remove("brz-ed-dd-cancel");
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
    return <EditorIcon icon="nc-search" />;
  }

  renderForEdit(v, vs, vd) {
    const { searchStyle, customCSS, label, className: _className } = v;
    const className = classnames(
      "brz-search-container",
      `brz-search-container__${searchStyle}`,
      _className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styles(v, vs, vd)
      )
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        <CustomCSS selectorName={this.getId()} css={customCSS}>
          <div className={className}>
            <form className="brz-form brz-search-form" noValidate>
              {searchStyle !== "classic" && this.renderIcon()}
              <input
                name="s"
                ref={this.input}
                className="brz-input brz-search"
                autoComplete="off"
                onClick={this.handleClick}
                onBlur={this.handleBlur}
                value={label}
                onChange={e => {
                  this.patchValue({
                    label: e.target.value,
                    placeholder: e.target.value
                  });
                }}
              />
              {searchStyle === "classic" && this.renderButton()}
            </form>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v, vs, vd) {
    const { searchStyle, customCSS, label, className: _className } = v;
    const className = classnames(
      "brz-search-container",
      `brz-search-container__${
        searchStyle === "fullScreen" ? "minimal" : searchStyle
      }`,
      _className,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styles(v, vs, vd)
      )
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={className}>
          <form className="brz-form brz-search-form" action="/" method="get">
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

export default Search;
