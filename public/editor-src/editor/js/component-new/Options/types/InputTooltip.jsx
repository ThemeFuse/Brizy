import React from "react";
import _ from "underscore";
import classnames from "classnames";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component-new/EditorIcon";
import Tooltip from "visual/component/controls/Tooltip";
import Input from "./common/Input";

const getDropdownScrollHeight = function(numItems = 1) {
  const minHeight = 31;
  const maxHeight = 155;
  const itemHeight = 31;
  const itemsHeight = numItems * itemHeight;

  return Math.max(minHeight, Math.min(maxHeight, itemsHeight));
};

class InputTooltipOptionType extends React.Component {
  static defaultProps = {
    className: "",
    attr: {},
    icon: "nc-circle-remove",
    value: "",
    options: [],
    onChange: _.noop
  };

  constructor(props) {
    super(props);
    const { options, value } = this.props;

    this.state = {
      inputValue: this.getOptionByValue(options, value),
      dropdownValue: null,
      dropdownOpened: false
    };
  }

  getOptionByValue = (options, value) => {
    const option = options.find(({ id }) => id === value);

    if (option) {
      return option.title;
    }

    return "";
  };

  handleDelete = () => {
    this.setState({ inputValue: "", dropdownValue: null });
    this.props.toolbar.resetItemsRenderer();
    this.props.onChange("");
  };

  handleInputChange = value => {
    this.setState({
      inputValue: value,
      dropdownValue: null
    });
  };

  handleInputFocus = () => {
    this.setState({
      dropdownOpened: true
    });
  };

  handleItemClick = ({ title, id }) => {
    this.setState({
      inputValue: title,
      dropdownValue: id,
      dropdownOpened: false
    });
  };

  handleSave = () => {
    const { dropdownValue } = this.state;
    if (dropdownValue !== "") {
      this.props.toolbar.resetItemsRenderer();
      this.props.onChange(dropdownValue);
    }
  };

  renderDeleteIcon = () => {
    if (this.state.inputValue !== "") {
      return (
        <div className="brz-ed-toolbar__link__icon" onClick={this.handleDelete}>
          <EditorIcon icon={this.props.icon} />
        </div>
      );
    }
  };

  renderSaveIcon = () => {
    const className = classnames("brz-ed-toolbar__link--save", {
      "brz-ed-toolbar--active": this.state.dropdownValue
    });

    return (
      <div className={className} onClick={this.handleSave}>
        <EditorIcon icon="nc-arrow-right" />
      </div>
    );
  };

  renderOverlayItems = () => {
    const inputValueRegex = new RegExp(this.state.inputValue, "i");
    const items = this.props.options
      .filter(({ title }) => inputValueRegex.test(title))
      .map(({ title, id }) => (
        <div
          key={`dropdown-${id}`}
          className="brz-ed-link__list-item"
          onClick={this.handleItemClick.bind(null, { title, id })}
        >
          {title}
        </div>
      ));

    return items.length ? (
      items
    ) : (
      <div className="brz-ed-link__list-item">No anchors available</div>
    );
  };

  renderOverlay = () => {
    const overlayItems = this.renderOverlayItems();
    const dropdownScrollStyle = {
      height: getDropdownScrollHeight(overlayItems.length)
    };

    return (
      <div className="brz-ed-link__list">
        <ScrollPane
          className="brz-ed-scroll-pane brz-ed-scroll--small brz-ed-scroll--dark"
          style={dropdownScrollStyle}
        >
          {overlayItems}
        </ScrollPane>
      </div>
    );
  };

  render() {
    const { inputValue } = this.state;
    const { className: _className, attr: _attr, icon } = this.props;

    const className = classnames(
      "brz-ed-toolbar__link__anchor",
      _className,
      _attr.className
    );
    const attr = _.omit(_attr, "className");

    return (
      <div className={className} {...attr}>
        <div className="brz-ed-toolbar__link__title">
          <Tooltip
            className="brz-ed-tooltip__anchor"
            overlay={this.renderOverlay()}
            placement="bottom-left"
            isOpen={this.state.dropdownOpened}
          >
            <Input
              placeholder="Choose an anchor"
              className="brz-ed-toolbar__link__input"
              value={inputValue}
              onFocus={this.handleInputFocus}
              onChange={this.handleInputChange}
              onEnterKeyDown={this.handleSave}
            />
          </Tooltip>
        </div>

        {icon ? this.renderDeleteIcon() : null}

        {this.renderSaveIcon()}
      </div>
    );
  }
}

export default InputTooltipOptionType;
