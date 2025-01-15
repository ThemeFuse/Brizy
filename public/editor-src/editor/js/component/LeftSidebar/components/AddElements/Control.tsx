import classnames from "classnames";
import FuzzySearch from "fuzzy-search";
import React, { Component, Fragment, JSX, ReactElement } from "react";
import { ConnectedProps, connect } from "react-redux";
import _ from "underscore";
import {
  CategoryTitle,
  ShortcodeElement
} from "visual/component/Controls/LeftSidebar/AddElements";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { ProInfo } from "visual/component/ProInfo";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  EditorMode,
  EditorModeContext,
  isStory
} from "visual/global/EditorModeContext";
import UIEvents from "visual/global/UIEvents";
import {
  updateDisabledElements,
  updatePinnedElements
} from "visual/redux/actions2";
import {
  disabledElementsSelector,
  pinnedElementsSelector
} from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Shortcode } from "visual/types";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { setIds } from "visual/utils/models";
import { Category } from "./Category";
import { CollapseShortcodes } from "./CollapseShortcodes";
import { SortData } from "./types";

export interface BaseProps {
  isEditMode: boolean;
  isPinMode: boolean;
  shortcodes: {
    [k: string]: Shortcode[];
  };
  config: ConfigCommon;
  editorMode: EditorMode;
}

type MapStateProps = {
  disabledElements: string[];
  pinnedElements: string[];
};

export interface State {
  disabledElements: Record<string, boolean>;
  pinnedElements: string[];
  inputValue: string;
}

const mapState = (state: ReduxState): MapStateProps => ({
  disabledElements: disabledElementsSelector(state),
  pinnedElements: pinnedElementsSelector(state)
});

const mapDispatch = { updateDisabledElements, updatePinnedElements };
const connector = connect(mapState, mapDispatch);

export type WithBaseProps<T> = ConnectedProps<typeof connector> & T;

export type Props = WithBaseProps<BaseProps>;

class ControlInner extends Component<Props, State> {
  private readonly isPro: boolean;
  private readonly upgradeToPro: string;

  constructor(props: Props) {
    super(props);
    // convert arr to object like {text: true, icon: true}
    const disabledElements = props.disabledElements.reduce(
      (acc, item) => ({
        ...acc,
        [item]: true
      }),
      {}
    );

    const pinnedElements = props.pinnedElements;

    this.state = {
      pinnedElements,
      disabledElements,
      inputValue: ""
    };
    const config = this.props.config;

    this.isPro = isPro(config);
    this.upgradeToPro = config?.urls?.upgradeToPro ?? "";
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.isEditMode !== this.props.isEditMode) {
      this.setState({ inputValue: "" });
    }
    if (prevProps.isEditMode && !this.props.isEditMode) {
      this.props.updateDisabledElements(
        Object.keys(this.state.disabledElements)
      );
    }
    if (prevProps.isPinMode && !this.props.isPinMode) {
      this.props.updatePinnedElements(this.state.pinnedElements);
    }
  }

  handleSortableSort = (data: SortData, shortcodes: Shortcode[]): void => {
    const { from, to } = data;

    const { resolve } = shortcodes[from.elementIndex].component;
    const itemData = setIds(resolve);

    const toContainerPath = to.sortableNode
      .getAttribute(makeAttr("sortable-path"))
      ?.split("-");
    const toContainerType = to.sortableNode.getAttribute(
      makeAttr("sortable-type")
    );
    const toItemPath = [...(toContainerPath ?? []), String(to.elementIndex)];

    // notify React to actually change state accordingly
    UIEvents.emit("dnd.sort", {
      from: {
        itemData,
        itemType: "addable"
      },
      to: {
        containerPath: toContainerPath,
        containerType: toContainerType,
        itemIndex: to.elementIndex,
        itemPath: toItemPath
      }
    });
  };

  handleClick = (shortcodes: Shortcode[], elementIndex: number): void => {
    const { component, pro } = shortcodes[elementIndex];

    if (!pro || this.isPro) {
      const itemData = setIds(component.resolve);
      const slickContainer = document.querySelector(
        ".slick-list .slick-active"
      );
      const sortableContainer = slickContainer?.querySelector(
        makeDataAttrString({ name: "sortable-type", value: "'section'" })
      );

      const containerPath = sortableContainer
        ?.getAttribute(makeAttr("sortable-path"))
        ?.split("-");
      const containerType = "section";
      const itemIndex = slickContainer?.getAttribute("data-index");
      const toItemPath = [...(containerPath ?? []), String(itemIndex)];

      // notify React to actually change state accordingly
      UIEvents.emit("dnd.sort", {
        from: {
          itemData,
          itemType: "addable"
        },
        to: {
          containerPath,
          containerType,
          itemIndex,
          itemPath: toItemPath
        }
      });
    }
  };

  handleDisabledElementsChange = (id: string): void => {
    const { disabledElements } = this.state;

    if (disabledElements[id]) {
      // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
      const { [id]: currentShortcode, ...rest } = disabledElements;

      this.setState({
        disabledElements: rest
      });
    } else {
      this.setState({
        disabledElements: {
          ...disabledElements,
          [id]: true
        }
      });
    }
  };

  handlePinnedElementsChange = (id: string): void => {
    const { pinnedElements } = this.state;

    if (pinnedElements.includes(id)) {
      const filtered = _.without(pinnedElements, id);

      this.setState({
        pinnedElements: filtered
      });
    } else {
      this.setState({
        pinnedElements: [...pinnedElements, id]
      });
    }
  };

  getFilteredShortcodes(shortcodes: Shortcode[]): Shortcode[] {
    const { isEditMode, isPinMode } = this.props;
    const { disabledElements, inputValue, pinnedElements } = this.state;
    const filteredShortcodes = shortcodes.filter(
      ({ component }) =>
        !pinnedElements.includes(component.id) &&
        (isEditMode ||
          isPinMode ||
          (!isEditMode && !disabledElements[component.id]))
    );

    const searcher = new FuzzySearch(filteredShortcodes, [
      "component.title",
      "keywords"
    ]);

    return searcher.search(inputValue);
  }

  getFilteredPinnedElements(ids: string[]): string[] {
    const { inputValue, disabledElements } = this.state;
    const { isEditMode, isPinMode } = this.props;

    const filtered = ids.filter(
      (id) => isEditMode || isPinMode || !disabledElements[id]
    );

    const searcher = new FuzzySearch(filtered);

    return searcher.search(inputValue);
  }

  renderIcon(title: string, icon: string, proElement: boolean): ReactElement {
    const iconNode = (
      <>
        <div className="brz-ed-sidebar__add-elements__icon">
          <EditorIcon icon={icon} />
        </div>
        <span className="brz-span brz-ed-sidebar__add-elements__text">
          {title}
        </span>
      </>
    );

    return proElement ? (
      <Tooltip
        overlayClassName="brz-ed-tooltip--delay-1"
        size="small"
        openOnClick={false}
        overlay={
          <ProInfo
            text={t("Upgrade to PRO to use this element")}
            url={this.upgradeToPro}
          />
        }
        offset={10}
      >
        {iconNode}
      </Tooltip>
    ) : (
      <>
        {iconNode}
        <div className="brz-ed-sidebar__add-elements__tooltip">{title}</div>
      </>
    );
  }

  renderIcons({
    shortcodes,
    isStory,
    config
  }: {
    shortcodes: Shortcode[];
    isStory: boolean;
    config: ConfigCommon;
  }): ReactElement[] {
    const { disabledElements, pinnedElements } = this.state;
    const { isEditMode, isPinMode } = this.props;

    return shortcodes.map(({ component, pro }, index) => {
      const shortcodeIsPro = typeof pro === "function" ? pro(config) : pro;

      const clickFn = isStory
        ? (): void => this.handleClick(shortcodes, index)
        : _.noop;

      const clickEditMode = (): void =>
        this.handleDisabledElementsChange(component.id);

      const clickPinMode = (): void =>
        this.handlePinnedElementsChange(component.id);

      const iconElem = this.renderIcon(
        component.title,
        component.icon,
        !this.isPro && shortcodeIsPro
      );

      const iconContainer = (
        <div
          className={classnames("brz-ed-sidebar__add-elements__item", {
            "brz-ed-sidebar__add-elements__item-pro":
              shortcodeIsPro && !this.isPro
          })}
          onClick={clickFn}
          key={component.id}
        >
          {iconElem}
        </div>
      );

      const isDisabledAndNotPinned =
        disabledElements[component.id] &&
        !pinnedElements.includes(component.id);

      return isPinMode ? (
        <ShortcodeElement
          key={component.id}
          onClick={isDisabledAndNotPinned ? _.noop : clickPinMode}
          iconElement={iconElem}
          isChecked={pinnedElements.includes(component.id)}
          isDisabled={isDisabledAndNotPinned}
        />
      ) : isEditMode ? (
        <ShortcodeElement
          key={component.id}
          onClick={clickEditMode}
          iconElement={iconElem}
          isChecked={!disabledElements[component.id]}
        />
      ) : pro && !this.isPro ? (
        iconContainer
      ) : (
        <SortableElement
          key={component.id}
          type="addable"
          subtype={component.id}
        >
          {iconContainer}
        </SortableElement>
      );
    });
  }

  renderPinned({
    isEveryPinnedElementDisabled,
    pinnedElementsShortcodes,
    showLines,
    isStory,
    config
  }: {
    isEveryPinnedElementDisabled: boolean;
    pinnedElementsShortcodes: Shortcode[];
    showLines: boolean;
    isStory: boolean;
    config: ConfigCommon;
  }): JSX.Element | null {
    const { isEditMode, isPinMode } = this.props;

    const isOneOfModes = isEditMode || isPinMode;

    if (
      (!isOneOfModes && pinnedElementsShortcodes.length <= 0) ||
      (isEveryPinnedElementDisabled && !isOneOfModes) ||
      pinnedElementsShortcodes.length <= 0
    ) {
      return null;
    }

    return (
      <CollapseShortcodes>
        {({ open, setOpen }) => (
          <>
            <CategoryTitle
              title={t("Pinned")}
              onClick={() => setOpen(!open)}
              open={open}
            />
            {open && (
              <Category
                category="pinned"
                shortcodes={pinnedElementsShortcodes}
                onChange={this.handleSortableSort}
                showLines={showLines}
              >
                {this.renderIcons({
                  shortcodes: pinnedElementsShortcodes,
                  isStory,
                  config
                })}
              </Category>
            )}
          </>
        )}
      </CollapseShortcodes>
    );
  }

  renderShortcodeCategory(
    category: string,
    index: number,
    pinnedElementsShortcodes: Shortcode[],
    isEveryPinnedElementDisabled: boolean,
    onClick: VoidFunction,
    open: boolean
  ): JSX.Element | null {
    const { isEditMode, isPinMode } = this.props;

    const isOneOfModes = isEditMode || isPinMode;

    if (
      !isOneOfModes &&
      index === 0 &&
      (pinnedElementsShortcodes.length <= 0 || isEveryPinnedElementDisabled)
    ) {
      return null;
    }

    return <CategoryTitle title={category} onClick={onClick} open={open} />;
  }

  render(): ReactElement {
    const { inputValue, pinnedElements, disabledElements } = this.state;
    const { shortcodes, config } = this.props;

    // why does Category class need for?
    // Sortable plugin doesn't update options when new props arrive
    // and in old variant
    //<Sortable
    //  type="addable"
    //  blindZone={sortableBlindZone}
    //  onSort={data => this.handleSortableSort(data, shortcodes)}
    //></Sortable>
    // if shortcodes chanced handleSortableSort function didn't get
    // new list of shortcodes

    const isEveryPinnedElementDisabled = pinnedElements.every(
      (el) => disabledElements[el]
    );

    const filteredPinnedElements =
      this.getFilteredPinnedElements(pinnedElements);

    const pinnedElementsShortcodes = Object.values(shortcodes)
      .flat()
      .filter((shortcode) =>
        filteredPinnedElements.includes(shortcode.component.id)
      );

    return (
      <EditorModeContext.Consumer>
        {(editorMode) => {
          const _isStory = isStory(editorMode);
          const showLines = !_isStory;
          return (
            <>
              <div className="brz-ed-sidebar__search">
                <input
                  type="text"
                  className="brz-input"
                  placeholder={t("Search element")}
                  autoFocus
                  spellCheck={false}
                  value={inputValue}
                  onChange={({ target: { value } }): void =>
                    this.setState({ inputValue: value })
                  }
                />
                <div className="brz-ed-sidebar__button-search">
                  <EditorIcon icon="nc-search" />
                </div>
              </div>
              {this.renderPinned({
                isEveryPinnedElementDisabled,
                pinnedElementsShortcodes,
                showLines,
                isStory: _isStory,
                config
              })}
              {Object.entries(shortcodes)
                .filter(
                  ([, categoryShortcodes]) =>
                    this.getFilteredShortcodes(categoryShortcodes).length > 0
                )
                .map(([category, categoryShortcodes], index) => {
                  const shortcodes =
                    this.getFilteredShortcodes(categoryShortcodes);
                  // we use _.sortBy instead of native sort
                  // because native can be unstable and change
                  // the order of elements with equal positions
                  const prepared = _.sortBy(
                    shortcodes.filter((s) => !s.component.hidden),
                    (s) => s.component.position || 10
                  );

                  return (
                    <CollapseShortcodes key={index}>
                      {({ open, setOpen }) => (
                        <Fragment>
                          {this.renderShortcodeCategory(
                            category,
                            index,
                            pinnedElementsShortcodes,
                            isEveryPinnedElementDisabled,
                            () => setOpen(!open),
                            open
                          )}
                          {open && (
                            <Category
                              category={category}
                              shortcodes={prepared}
                              onChange={this.handleSortableSort}
                              showLines={showLines}
                            >
                              {this.renderIcons({
                                shortcodes: prepared,
                                isStory: _isStory,
                                config
                              })}
                            </Category>
                          )}
                        </Fragment>
                      )}
                    </CollapseShortcodes>
                  );
                })}
            </>
          );
        }}
      </EditorModeContext.Consumer>
    );
  }
}

export const Control = connector(ControlInner);
