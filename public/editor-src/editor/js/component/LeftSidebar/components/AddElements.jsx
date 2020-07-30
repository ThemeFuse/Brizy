import React, { Fragment, Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import FuzzySearch from "fuzzy-search";
import { connect } from "react-redux";
import Editor from "visual/global/Editor";
import UIEvents from "visual/global/UIEvents";
import EditorIcon from "visual/component/EditorIcon";
import Sortable from "visual/component/Sortable";
import { SortableElement } from "visual/component/Sortable/SortableElement";
import { setIds } from "visual/utils/models";
import { t } from "visual/utils/i18n";
import { updateDisabledElements } from "visual/redux/actions";
import { disabledElementsSelector } from "visual/redux/selectors";

const sortableBlindZone = {
  left: 0,
  right: 328,
  top: 0,
  bottom: Infinity
};

class DrawerComponent extends Component {
  constructor(props) {
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

  componentDidUpdate(prevProps) {
    if (prevProps.isEditMode !== this.props.isEditMode) {
      this.setState({
        inputValue: ""
      });
    }
    if (prevProps.isEditMode && !this.props.isEditMode) {
      this.props.onElementsChange(Object.keys(this.state.disabledElements));
    }
  }

  handleSortableSort = (data, shortcodes) => {
    const { from, to } = data;

    const { resolve } = shortcodes[from.elementIndex];
    const itemData = setIds(resolve);

    const toContainerPath = to.sortableNode
      .getAttribute("data-sortable-path")
      .split(".");
    const toContainerType = to.sortableNode.getAttribute("data-sortable-type");
    const toItemPath = [...toContainerPath, String(to.elementIndex)];

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

  handleDisabledElementsChange = id => {
    const { disabledElements } = this.state;
    if (disabledElements[id]) {
      // eslint-disable-next-line no-unused-vars
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

  getFilteredShortcodes(shortcodes) {
    const { isEditMode } = this.props;
    const { disabledElements, inputValue } = this.state;
    const filteredShortcodes = shortcodes.filter(
      shortcode =>
        isEditMode || (!isEditMode && !disabledElements[shortcode.id])
    );
    const searcher = new FuzzySearch(filteredShortcodes, ["title"]);

    return searcher.search(inputValue);
  }

  renderIcon(title, icon) {
    return (
      <Fragment>
        <div className="brz-ed-sidebar__add-elements__icon">
          <EditorIcon icon={icon} />
        </div>
        <span className="brz-span brz-ed-sidebar__add-elements__text">
          {title}
        </span>
        <div className="brz-ed-sidebar__add-elements__tooltip">{title}</div>
      </Fragment>
    );
  }

  renderIcons(shortcodes) {
    const { disabledElements } = this.state;
    const { isEditMode } = this.props;

    return shortcodes.map(({ id, title, icon }) => {
      const iconElem = this.renderIcon(title, icon);

      return isEditMode ? (
        <div
          className="brz-ed-sidebar__add-elements__item brz-ed-sidebar__add-elements__item-edit"
          key={id}
        >
          <div
            className={classnames("brz-ed-sidebar__edit", {
              "brz-ed-sidebar__edit--checked": !disabledElements[id]
            })}
            onClick={() => this.handleDisabledElementsChange(id)}
          >
            <span className="brz-ed-sidebar__checked">
              <EditorIcon icon="nc-check-circle" />
            </span>
          </div>
          {iconElem}
        </div>
      ) : (
        <SortableElement key={id} type="addable" subtype={id}>
          <div className="brz-ed-sidebar__add-elements__item">{iconElem}</div>
        </SortableElement>
      );
    });
  }

  render() {
    const { inputValue } = this.state;
    const shortcodes = Editor.getShortcodes();

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
      <Fragment>
        <div className="brz-ed-sidebar__search">
          <input
            type="text"
            className="brz-input"
            placeholder={t("Search element")}
            autoFocus={true}
            spellCheck={false}
            value={inputValue}
            onChange={({ target: { value } }) =>
              this.setState({ inputValue: value })
            }
          />
          <div className="brz-ed-sidebar__button-search">
            <EditorIcon icon="nc-search" />
          </div>
        </div>
        {Object.entries(shortcodes)
          .filter(
            // eslint-disable-next-line no-unused-vars
            ([category, categoryShortcodes]) =>
              this.getFilteredShortcodes(categoryShortcodes).length > 0
          )
          .map(([category, categoryShortcodes], index) => {
            const shortcodes = this.getFilteredShortcodes(categoryShortcodes);
            // we use _.sortBy instead of native sort
            // because native can be unstable and change
            // the order of elements with equal positions
            const prepared = _.sortBy(
              shortcodes.filter(s => !s.hidden),
              s => s.position || 10
            );

            return (
              <Fragment key={category}>
                {index !== 0 && (
                  <div className="brz-ed-sidebar__add-elements--separator-title">
                    {category}
                  </div>
                )}

                <Category
                  shortcodes={prepared}
                  onChange={this.handleSortableSort}
                >
                  <div
                    className={`brz-ed-sidebar__add-elements brz-ed-sidebar__add-elements--${category}`}
                  >
                    {this.renderIcons(prepared)}
                  </div>
                </Category>
              </Fragment>
            );
          })}
      </Fragment>
    );
  }
}

class WrapperHeaderComponent extends Component {
  state = { isEditMode: false };

  renderExtraHeader = () => {
    const { isEditMode } = this.state;

    return (
      <div
        className="brz-ed-sidebar__edit-button"
        onClick={() => this.setState({ isEditMode: !isEditMode })}
      >
        {isEditMode ? t("Done") : t("Edit")}
      </div>
    );
  };
  render() {
    const { children } = this.props;
    const { isEditMode } = this.state;

    return React.cloneElement(children, {
      renderExtraHeader: this.renderExtraHeader,
      isEditMode
    });
  }
}

class Category extends React.Component {
  handleChange = data => {
    const { shortcodes, onChange } = this.props;

    onChange(data, shortcodes);
  };
  render() {
    return (
      <Sortable
        type="addable"
        blindZone={sortableBlindZone}
        onSort={this.handleChange}
      >
        {this.props.children}
      </Sortable>
    );
  }
}

const mapStateToProps = state => ({
  disabledElements: disabledElementsSelector(state)
});
const mapDispatchToProps = dispatch => ({
  onElementsChange: disabledElements =>
    dispatch(updateDisabledElements(disabledElements))
});

export const AddElements = {
  id: "addElements",
  icon: "nc-add",
  drawerTitle: t("Add Elements"),
  showInDeviceModes: ["desktop"],
  drawerComponent: connect(
    mapStateToProps,
    mapDispatchToProps
  )(DrawerComponent),
  wrapperHeaderComponent: WrapperHeaderComponent
};
