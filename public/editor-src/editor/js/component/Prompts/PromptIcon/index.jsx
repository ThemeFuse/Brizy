import _ from "underscore";
import React, { Component } from "react";
import classnames from "classnames";
import Fixed from "visual/component/Prompts/Fixed";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import SmartGrid from "visual/component/Prompts/common/SmartGrid";
import EditorIcon from "visual/component/EditorIcon";
import ConfigIcons from "visual/config/icons";
const { categories: CATEGORIES, types: TYPES, list: ICONS } = ConfigIcons;

const getFilteredIcons = (
  icons,
  { type: currentType, category, searchQuery }
) => {
  let regex = new RegExp(searchQuery, "i");

  return _.filter(icons, ({ type = "outline", cat = "*", title }) => {
    return (
      currentType === type &&
      (category === "*" || _.indexOf(cat, category)) !== -1 &&
      title.length &&
      regex.test(title)
    );
  });
};

export default class extends Component {
  constructor(props) {
    super(props);
    const type =
      _.find(TYPES, {
        name: this.props.value.type
      }) || TYPES[0];

    this.state = {
      searchQuery: "",
      category: "*",
      type
    };

    this.onIconClick = this.onIconClick.bind(this);
    this.onCategoryChange = this.onCategoryChange.bind(this);
    this.onTypeChange = this.onTypeChange.bind(this);
    this.onSearchQueryChange = this.onSearchQueryChange.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }
  onIconClick(type, name) {
    this.props.onClose();

    // leave a little breathing room for the browser
    setTimeout(() => {
      this.props.onChange({ type, name });
    }, 0);
  }
  onCategoryChange(category) {
    this.setState({ category });
  }
  onTypeChange(type) {
    this.setState({ type });
  }
  onSearchQueryChange(event) {
    this.setState({
      searchQuery: event.target.value
    });
  }
  getIcons() {
    const {
      searchQuery,
      type: { id },
      category
    } = this.state;

    const filters = {
      type: id,
      category,
      searchQuery
    };

    return getFilteredIcons(ICONS, filters);
  }
  renderHeader() {
    const { id } = this.state.type;

    const types = _.map(TYPES, item => {
      const className = classnames("brz-ed-popup-tab-item", {
        active: item.id === id
      });
      return (
        <div
          key={item.id}
          className={className}
          onClick={() => this.onTypeChange(item)}
        >
          <div className="brz-ed-popup-tab-icon">
            <EditorIcon icon={item.icon} />
          </div>
          <div className="brz-ed-popup-tab-name">{item.title}</div>
        </div>
      );
    });

    return (
      <div className="brz-ed-popup-header">
        <div className="brz-ed-popup-header__tabs">{types}</div>
        <div className="brz-ed-popup-btn-close" onClick={this.props.onClose} />
      </div>
    );
  }
  renderCategoriesSelect() {
    const categories = [
      {
        id: "*",
        name: "all",
        title: "All Categories"
      },
      ...CATEGORIES
    ];
    const categoryOptions = categories.map(({ id, title }) => (
      <SelectItem key={id} value={id}>
        {title}
      </SelectItem>
    ));

    return (
      <Select
        className="brz-ed-popup__select brz-ed-popup__select--block-categories brz-ed-popup-control__select--light"
        defaultValue={this.state.category}
        maxItems={10}
        itemHeight={30}
        onChange={this.onCategoryChange}
      >
        {categoryOptions}
      </Select>
    );
  }
  renderItem(icons, index) {
    const {
      value: { name: iconName }
    } = this.props;
    const { name: typeName } = this.state.type;
    const { name: iconValue } = icons[index];
    const className = classnames("brz-ed-popup-icons__grid__item", {
      active: iconValue === iconName
    });

    return (
      <div
        key={iconValue}
        className={className}
        style={{ display: "inline-block" }}
        onClick={() => this.onIconClick(typeName, iconValue)}
      >
        <i className={`nc-icon nc-${typeName} nc-${typeName}-${iconValue}`} />
      </div>
    );
  }
  render() {
    const { searchQuery } = this.state;
    const { name } = this.props.value;
    const icons = this.getIcons();
    const initialIndex = _.findIndex(icons, item => item.name === name);

    return (
      <Fixed onClose={this.props.onClose}>
        <div className="brz-ed-popup-wrapper">
          {this.renderHeader()}
          <div className="brz-ed-popup-content brz-ed-popup-pane brz-ed-popup-icons">
            <div className="brz-ed-popup-body">
              <div className="brz-ed-popup__head--search brz-d-xs-flex brz-align-items-center brz-justify-content-xs-center">
                <div className="brz-ed-popup__categories">
                  {this.renderCategoriesSelect()}
                </div>
                <div className="brz-ed-popup__search">
                  <input
                    type="text"
                    className="brz-input brz-ed-popup__input"
                    placeholder="Enter Search Keyword"
                    onChange={this.onSearchQueryChange}
                    value={searchQuery}
                  />
                  <div
                    className={classnames("brz-ed-popup__search--icon", {
                      active: searchQuery
                    })}
                  >
                    <EditorIcon icon="nc-search" />
                  </div>
                </div>
              </div>
              <div className="brz brz-ed-popup-icons__grid">
                <SmartGrid
                  height="100%"
                  itemRenderer={index => this.renderItem(icons, index)}
                  itemsPerRow={8}
                  initialIndex={initialIndex}
                  length={icons.length}
                  type="uniform"
                />
              </div>
            </div>
          </div>
        </div>
      </Fixed>
    );
  }
}
