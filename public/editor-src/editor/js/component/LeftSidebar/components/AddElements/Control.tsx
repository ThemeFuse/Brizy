import classnames from "classnames";
import FuzzySearch from "fuzzy-search";
import React, { Component, Fragment, ReactElement } from "react";
import { ConnectedProps, connect } from "react-redux";
import _ from "underscore";
import Tooltip from "visual/component/Controls/Tooltip";
import EditorIcon from "visual/component/EditorIcon";
import { ProInfo } from "visual/component/ProInfo";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import Config from "visual/global/Config";
import UIEvents from "visual/global/UIEvents";
import { updateDisabledElements } from "visual/redux/actions2";
import { disabledElementsSelector } from "visual/redux/selectors";
import { ReduxState } from "visual/redux/types";
import { Shortcode } from "visual/types";
import { IS_PRO } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import { makeAttr, makeDataAttrString } from "visual/utils/i18n/attribute";
import { isStory, setIds } from "visual/utils/models";
import { Category } from "./Category";
import { SortData } from "./types";

const { upgradeToPro } = Config.get("urls");

export interface BaseProps {
  isEditMode: boolean;
  shortcodes: {
    [k: string]: Shortcode[];
  };
}

type MapStateProps = {
  disabledElements: string[];
};

export interface State {
  disabledElements: Record<string, boolean>;
  inputValue: string;
}

const mapState = (state: ReduxState): MapStateProps => ({
  disabledElements: disabledElementsSelector(state)
});

const mapDispatch = { updateDisabledElements };
const connector = connect(mapState, mapDispatch);

export type WithBaseProps<T> = ConnectedProps<typeof connector> & T;

export type Props = WithBaseProps<BaseProps>;

class ControlInner extends Component<Props, State> {
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

    this.state = {
      disabledElements,
      inputValue: ""
    };
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

    if (!pro || IS_PRO) {
      const itemData = setIds(component.resolve);
      const slickContainer = document.querySelector(
        ".slick-list .slick-active"
      );
      const sortableContainer = slickContainer?.querySelector(
        makeDataAttrString({ name: "sortable-type", value: "'section'" })
      );

      const containerPath = sortableContainer
        ?.getAttribute("data-sortable-path")
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

  getFilteredShortcodes(shortcodes: Shortcode[]): Shortcode[] {
    const { isEditMode } = this.props;
    const { disabledElements, inputValue } = this.state;
    const filteredShortcodes = shortcodes.filter(
      (shortcode) =>
        isEditMode || (!isEditMode && !disabledElements[shortcode.component.id])
    );
    const searcher = new FuzzySearch(filteredShortcodes, ["component.title"]);

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
            url={upgradeToPro}
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

  renderIcons(shortcodes: Shortcode[]): ReactElement[] {
    const { disabledElements } = this.state;
    const { isEditMode } = this.props;

    return shortcodes.map(({ component, pro }, index) => {
      const clickFn = isStory(Config.getAll())
        ? (): void => this.handleClick(shortcodes, index)
        : _.noop;

      const clickEditMode = (): void =>
        this.handleDisabledElementsChange(component.id);

      const iconElem = this.renderIcon(
        component.title,
        component.icon,
        !IS_PRO && pro
      );
      const iconContainer = (
        <div
          className={classnames("brz-ed-sidebar__add-elements__item", {
            "brz-ed-sidebar__add-elements__item-pro": pro && !IS_PRO
          })}
          onClick={clickFn}
          key={component.id}
        >
          {iconElem}
        </div>
      );

      return isEditMode ? (
        <div
          className="brz-ed-sidebar__add-elements__item brz-ed-sidebar__add-elements__item-edit"
          key={component.id}
        >
          <div
            className={classnames("brz-ed-sidebar__edit", {
              "brz-ed-sidebar__edit--checked": !disabledElements[component.id]
            })}
            onClick={clickEditMode}
          >
            <span className="brz-ed-sidebar__checked">
              <EditorIcon icon="nc-check-circle" />
            </span>
          </div>
          {iconElem}
        </div>
      ) : pro && !IS_PRO ? (
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

  render(): ReactElement {
    const { inputValue } = this.state;
    const { shortcodes } = this.props;

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

    return (
      <>
        <div className="brz-ed-sidebar__search">
          <input
            type="text"
            className="brz-input"
            placeholder={t("Search element")}
            autoFocus={true}
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
        {Object.entries(shortcodes)
          .filter(
            (
              // @ts-expect-error: 'category' is defined but never used.
              [category, categoryShortcodes] // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
            ) => this.getFilteredShortcodes(categoryShortcodes).length > 0
          )
          .map(([category, categoryShortcodes], index) => {
            const shortcodes = this.getFilteredShortcodes(categoryShortcodes);
            // we use _.sortBy instead of native sort
            // because native can be unstable and change
            // the order of elements with equal positions
            const prepared = _.sortBy(
              shortcodes.filter((s) => !s.component.hidden),
              (s) => s.component.position || 10
            );

            return (
              <Fragment key={category}>
                {index !== 0 && (
                  <div className="brz-ed-sidebar__add-elements--separator-title">
                    {category}
                  </div>
                )}

                <Category
                  category={category}
                  shortcodes={prepared}
                  onChange={this.handleSortableSort}
                >
                  {this.renderIcons(prepared)}
                </Category>
              </Fragment>
            );
          })}
      </>
    );
  }
}

export const Control = connector(ControlInner);
