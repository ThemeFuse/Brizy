import React, { Component } from "react";
import _ from "underscore";
import { getCategories, getTypes } from "visual/config/icons";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import Control from "./Controls";
import { loadFonts } from "./utils";

const TYPES = getTypes();

export default class PromptIcon extends Component {
  static defaultProps = {
    name: "nc-star",
    type: "outline",
    onChange: _.noop
  };

  state = {
    typeId: (TYPES.find((t) => t.name === this.props.type) ?? TYPES[0]).id,
    categoryId: "*",
    search: ""
  };

  containerRef = React.createRef();

  componentDidUpdate() {
    const node = this.containerRef.current;

    if (node) {
      const { templateFonts } = Config.get("urls");
      loadFonts(this.containerRef.current, templateFonts);
    }
  }

  onIconClick = (icon) => {
    this.props.onClose();

    // leave a little breathing room for the browser
    setTimeout(() => {
      this.props.onChange(icon);
    }, 0);
  };

  handleSelectChange = (categoryId) => {
    this.setState({ categoryId });
  };

  handleInputChange = (search) => {
    this.setState({ search });
  };

  handleTabClick = (typeId) => {
    this.setState({ typeId });
  };

  render() {
    const { name, type, opened, onClose } = this.props;
    const { typeId, categoryId, search } = this.state;
    const categories = [
      {
        id: "*",
        name: "all",
        title: t("All Categories")
      },
      ...getCategories(typeId)
    ];

    return (
      <Control
        name={name}
        type={type}
        opened={opened}
        ref={this.containerRef}
        categoryId={categoryId}
        categories={categories}
        typeId={typeId}
        search={search}
        onClose={onClose}
        onSelectChange={this.handleSelectChange}
        onInputChange={this.handleInputChange}
        onTabClick={this.handleTabClick}
        onIconClick={this.onIconClick}
      />
    );
  }
}
