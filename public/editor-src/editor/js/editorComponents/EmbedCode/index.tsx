import { EmbedCode as EmbedCodeComponent } from "@brizy/component/src/Flex/EmbedCode";
import classNames from "classnames";
import React, { JSX, createRef } from "react";
import BoxResizer from "visual/component/BoxResizer";
import type {
  Patch as BoxResizerPatch,
  Point
} from "visual/component/BoxResizer/types";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import { subscribeToEmbedCodeConsent } from "visual/utils/elements/embedCode/consentStore";
import { shouldRunEmbedCodeInEditor } from "visual/utils/elements/embedCode";
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

const resizerPoints = ["centerLeft", "centerRight"] satisfies Point[];

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

export default class EmbedCode extends BaseEmbedCode {
  wrapperRef = createRef<HTMLElement>();
  observedNode: MValue<HTMLElement>;
  unsubscribeConsent: MValue<VoidFunction>;

  state = {
    visibleElement: VisibleElement.Placeholder
  };

  componentDidMount() {
    // Consent lives outside Redux, so subscribe directly — one toggle has to
    // reach every EmbedCode instance on the page at once, including instances
    // inside global blocks and popups.
    this.unsubscribeConsent = subscribeToEmbedCodeConsent(() =>
      this.forceUpdate()
    );

    this.syncContentObserver();
  }

  componentDidUpdate() {
    // The content node exists only while the code is running, so the observer
    // has to be re-attached whenever consent brings it back.
    this.syncContentObserver();
  }

  componentWillUnmount() {
    if (this.observedNode) {
      unobserve(this.observedNode);
      this.observedNode = undefined;
    }

    this.unsubscribeConsent?.();

    super.componentWillUnmount();
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
    return (
      this.wrapperRef.current?.querySelector<HTMLElement>(
        ".brz-embed-content"
      ) ?? null
    );
  }

  syncContentObserver(): void {
    const node = this.getContentNode();

    if (node === (this.observedNode ?? null)) {
      return;
    }

    if (this.observedNode) {
      unobserve(this.observedNode);
    }

    this.observedNode = node ?? undefined;

    if (node) {
      observe(node, this.handleContentVisibility);
    } else if (this.state.visibleElement !== VisibleElement.Placeholder) {
      // Code stopped running — fall back to the placeholder rather than leaving
      // a hidden empty region behind.
      this.setState({ visibleElement: VisibleElement.Placeholder });
    }
  }

  renderContent(): JSX.Element {
    const { visibleElement } = this.state;
    const { code } = this.getValue();
    const runCode = shouldRunEmbedCodeInEditor(this.getGlobalConfig());

    // Keep this derived from runCode as well as state: on revoke the content
    // unmounts in this same render while visibleElement is still Content, and
    // hiding the placeholder here too would blank the element for a frame.
    const placeholderClassname = classNames({
      "brz-d-none": runCode && visibleElement !== VisibleElement.Placeholder
    });

    return (
      <>
        <Placeholder icon="iframe" className={placeholderClassname} />
        {runCode && (
          <EmbedCodeComponent
            code={code}
            className="brz-blocked"
            parentClassName={classNames({
              "brz-embed-content--hidden":
                visibleElement !== VisibleElement.Content
            })}
          />
        )}
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

  handleResizerChange = (patch: BoxResizerPatch["patch"]): void =>
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
