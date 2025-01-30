import classnames from "classnames";
import { isEqual, pick } from "es-toolkit";
import React, { ReactElement, ReactNode } from "react";
import { Text } from "visual/component/ContentOptions/types";
import CustomCSS from "visual/component/CustomCSS";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  Props as PrevProps
} from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import { makeAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { encodeToString } from "visual/utils/string";
import { collapse, expand } from "../Accordion/utils";
import { Wrapper } from "../tools/Wrapper";
import { Body } from "./Components/Body";
import { Error } from "./Components/Error";
import { Header } from "./Components/Header";
import { List } from "./Components/List";
import { ListItem } from "./Components/ListItem";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarExtendBody from "./sidebarExtendBody";
import * as sidebarExtendHeader from "./sidebarExtendHeader";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import * as toolbarExtentBody from "./toolbarExtendBody";
import * as toolbarExtentHeader from "./toolbarExtendHeader";
import type { MarkerType, Patch, Props, State, Value } from "./types";
import {
  convertMarkerTypeToTag,
  getSelectedElements,
  isStatePatch
} from "./utils";

class TableOfContents extends EditorComponent<Value, Props, State> {
  static defaultValue = defaultValue;
  state: State = {
    isOpened: true,
    headings: []
  };
  headerRef = React.createRef<HTMLDivElement>();
  contentRef = React.createRef<HTMLDivElement>();

  static get componentId(): ElementTypes.TableOfContents {
    return ElementTypes.TableOfContents;
  }

  handleTextChange = (patch: Patch): void => {
    this.patchValue(patch);
  };

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarConfig,
      sidebarConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: false
      }
    );
    this.props.extendParentToolbar(toolbarExtend);

    const { selectedElements, minimized } = this.getValue();

    const isMinimized = minimized === "on";

    const statePatch: Partial<State> = {};

    if (isMinimized) {
      statePatch.isOpened = false;
    } else {
      this.contentRef.current?.parentElement?.classList.add("brz-toc--opened");
    }

    statePatch.headings = this.getHeadings(selectedElements);

    if (isStatePatch(statePatch)) {
      this.setState(statePatch);
    }
  }

  componentDidUpdate(
    prevProps: PrevProps<Value, Props>,
    prevState: State
  ): void {
    const { isOpened: prevIsOpened } = prevState;
    const { isOpened } = this.state;
    const { minimized: prevMinimized } = prevProps.dbValue;
    const { minimized: actualMinimized } = this.props.dbValue;

    const keys = ["selectedElements", "include", "exclude"];
    const oldDbValue = pick(prevProps.dbValue, keys);
    const newDbValue = pick(this.props.dbValue, keys);

    const statePatch: Partial<State> = {};

    if (!isEqual(oldDbValue, newDbValue)) {
      const { selectedElements } = this.getValue();
      statePatch.headings = this.getHeadings(selectedElements);
    }

    if (prevMinimized !== actualMinimized) {
      const prevMinimizedState = prevMinimized === "on";

      if (prevMinimizedState !== isOpened) {
        statePatch.isOpened = !isOpened;
      }
    }

    if (prevIsOpened !== isOpened) {
      if (isOpened) {
        this.handleCollapse();
      } else {
        this.handleExpand();
      }
    }

    if (isStatePatch(statePatch)) {
      this.setState(statePatch);
    }
  }

  handleOpenClose = (): void => {
    this.setState({
      isOpened: !this.state.isOpened
    });
  };

  handleExpand = (): void => {
    const node = this.contentRef.current;

    if (node) {
      const height =
        node.firstElementChild?.getBoundingClientRect().height ?? 0;
      const { animDuration: duration } = this.getValue();

      const header = this.headerRef.current;
      if (header) {
        header.classList.add("brz-blocked");
      }

      expand(node, {
        height,
        duration: duration * 1000,
        onFinish() {
          node.parentElement?.classList.remove("brz-toc--opened");
          if (header) {
            header.classList.remove("brz-blocked");
          }
        }
      });
    }
  };

  handleCollapse = (): void => {
    const node = this.contentRef.current;

    if (node) {
      const height =
        node.firstElementChild?.getBoundingClientRect().height ?? 0;
      const { animDuration: duration } = this.getValue();

      const header = this.headerRef.current;
      if (header) {
        header.classList.add("brz-blocked");
      }

      collapse(node, {
        height,
        duration: duration * 1000,
        onStart() {
          node.parentElement?.classList.add("brz-toc--opened");
        },
        onFinish() {
          if (header) {
            header.classList.remove("brz-blocked");
          }
        }
      });
    }
  };

  getIcon(active: boolean, navIcon: string): ReactElement {
    const icon = active ? `up-arrow-${navIcon}` : `down-arrow-${navIcon}`;

    return isEditor(this.props.renderContext) ? (
      <ThemeIcon type="editor" name={icon} />
    ) : (
      <>
        <ThemeIcon type="editor" name={`up-arrow-${navIcon}`} />
        <ThemeIcon
          className="brz-hidden"
          type="editor"
          name={`down-arrow-${navIcon}`}
        />
      </>
    );
  }

  getHeadings = (selectedElements: string): HTMLElement[] => {
    const { include, exclude } = this.getValue();

    return getSelectedElements(selectedElements, include, exclude);
  };

  renderTocList(markerType: MarkerType): ReactNode {
    const { headings } = this.state;

    const isMarkerNumbers = markerType === "numbers";

    return headings.length > 0 ? (
      <List tag={convertMarkerTypeToTag(markerType)}>
        {headings.map((item: HTMLElement, i: number) => {
          const numberText = isMarkerNumbers ? String(i + 1) : undefined;

          return (
            <ListItem numberText={numberText} key={i}>
              <span className="brz-toc-body__list-content">
                {item.innerText}
              </span>
            </ListItem>
          );
        })}
      </List>
    ) : isEditor(this.props.renderContext) ? (
      <Error message={t("No headings were found.")} />
    ) : (
      ""
    );
  }

  renderContent(v: Value): ReactNode {
    const { textUnderline, navIcon, markerType } = v;
    const { isOpened } = this.state;

    const icon =
      navIcon !== "none" ? this.getIcon(isOpened, navIcon) : undefined;

    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarExtentHeader,
            sidebarExtendHeader
          )}
        >
          {({ ref }) => (
            <Header
              ref={(el) => {
                attachRefs(el, [ref, this.headerRef]);
              }}
              icon={icon}
              onClick={this.handleOpenClose}
            >
              <Text
                id="title"
                v={v}
                onChange={this.handleTextChange}
                className="brz-toc-title"
              />
            </Header>
          )}
        </Toolbar>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(
            toolbarExtentBody,
            sidebarExtendBody
          )}
        >
          {({ ref }) => (
            <Body
              ref={(el) => {
                attachRefs(el, [ref, this.contentRef]);
              }}
              underline={textUnderline === "on"}
            >
              {this.renderTocList(markerType)}
            </Body>
          )}
        </Toolbar>
      </>
    );
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { minimized, tabletMinimized, mobileMinimized } = v;

    const isMinimized =
      minimized === "on" ||
      tabletMinimized === "on" ||
      mobileMinimized === "on";

    const className = classnames(
      "brz-toc",
      { "brz-toc--opened": !isMinimized },
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
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        {({ ref: cssRef }) => (
          <Wrapper {...this.makeWrapperProps({ className, ref: cssRef })}>
            {this.renderContent(v)}
          </Wrapper>
        )}
      </CustomCSS>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const {
      selectedElements,
      markerType,
      minimized,
      tabletMinimized,
      mobileMinimized,
      include,
      exclude,
      animDuration
    } = v;

    const isMinimized =
      minimized === "on" ||
      tabletMinimized === "on" ||
      mobileMinimized === "on";

    const className = classnames(
      "brz-toc",
      { "brz-toc--opened": !isMinimized },
      { "brz-toc-b-none": isMinimized },
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

    const dataAttributes = {
      [makeAttr("data-selected")]: encodeToString(selectedElements),
      [makeAttr("data-minimized")]: minimized,
      [makeAttr("data-minimized-tablet")]: tabletMinimized || minimized,
      [makeAttr("data-minimized-mobile")]: mobileMinimized || minimized,
      [makeAttr("data-include")]: include,
      [makeAttr("data-exclude")]: exclude,
      [makeAttr("data-marker")]: markerType,
      [makeAttr("data-anim-duration")]: animDuration
    };

    return (
      <Wrapper
        {...this.makeWrapperProps({ className })}
        attributes={dataAttributes}
      >
        {this.renderContent(v)}
      </Wrapper>
    );
  }
}

export default TableOfContents;
