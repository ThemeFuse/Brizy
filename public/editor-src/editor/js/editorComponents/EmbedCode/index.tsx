import { EmbedCode as EmbedCodeComponent } from "@brizy/component/src/Flex/EmbedCode";
import classNames from "classnames";
import React, { JSX, createRef } from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import { attachRefs } from "visual/utils/react";
import type { MValue } from "visual/utils/value";
import { Wrapper } from "../tools/Wrapper";
import { BaseEmbedCode } from "./Base";
import { observe, unobserve } from "./observer";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import type { Meta, ObserverCallback, Value } from "./types";
import { VisibleElement } from "./types";

const resizerPoints = ["centerLeft", "centerRight"];

export default class EmbedCode extends BaseEmbedCode {
  wrapperRef = createRef<HTMLElement>();
  contentRef: MValue<HTMLElement>;

  state = {
    visibleElement: VisibleElement.Placeholder
  };

  componentDidMount() {
    const contentNode = this.getContentNode();

    if (contentNode) {
      observe(contentNode, this.handleContentVisibility);
    }
  }

  componentWillUnmount() {
    const contentNode = this.getContentNode();

    if (contentNode) {
      unobserve(contentNode);
    }
  }

  handleContentVisibility: ObserverCallback = (entry) => {
    const { target } = entry;
    const { visibleElement: currentVisibleElement } = this.state;

    const { height } = target.getBoundingClientRect();

    const nextVisibleElement =
      height > 1 ? VisibleElement.Content : VisibleElement.Placeholder;

    if (currentVisibleElement !== nextVisibleElement) {
      this.setState({ visibleElement: nextVisibleElement });
    }
  };

  getContentNode(): HTMLElement | null {
    if (this.contentRef) {
      return this.contentRef;
    }

    const node =
      this.wrapperRef.current?.querySelector<HTMLElement>(".brz-embed-content");

    if (node) {
      this.contentRef = node;
      return node;
    }

    return null;
  }

  renderContent(): JSX.Element {
    const { visibleElement } = this.state;
    const { code } = this.getValue();

    const placeholderClassname = classNames({
      "brz-d-none": visibleElement !== VisibleElement.Placeholder
    });

    const contentClassname = classNames({
      "brz-embed-content--hidden": visibleElement !== VisibleElement.Content
    });

    return (
      <>
        <Placeholder icon="iframe" className={placeholderClassname} />
        <EmbedCodeComponent
          code={code}
          className="brz-blocked"
          parentClassName={contentClassname}
        />
      </>
    );
  }

  handleValueChange(newValue: Value, meta: Meta) {
    if (meta.patch.code) {
      super.handleValueChange({ ...newValue, code: newValue.code }, meta);
    } else {
      super.handleValueChange(newValue, meta);
    }
  }

  handleResizerChange = (patch: { [key: string]: number }): void =>
    this.patchValue(patch);

  renderForEdit(v: Value, vs: Value, vd: Value): JSX.Element {
    const className = classNames(
      "brz-embed-code",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
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
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef, this.wrapperRef]);
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
                  {this.renderContent()}
                </BoxResizer>
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
