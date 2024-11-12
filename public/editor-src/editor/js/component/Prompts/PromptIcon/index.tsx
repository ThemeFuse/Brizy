import React, { Component } from "react";
import _ from "underscore";
import { getCategories, getTypes } from "visual/config/icons";
import Config from "visual/global/Config";
import { t } from "visual/utils/i18n";
import Control from "./Controls";
import { loadFonts } from "./utils";
import { Icon, Props, State } from "./types";

export default class PromptIcon extends Component<Props, State> {
  static defaultProps = {
    name: "nc-star",
    type: "outline",
    onChange: _.noop
  };

  containerRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    const { type } = props;
    const types = getTypes(Config.getAll());
    const typeId = (types.find((t) => t.name === type) ?? types[0]).id;

    this.state = {
      typeId,
      categoryId: "*",
      search: ""
    };
  }

  componentDidUpdate() {
    const node = this.containerRef.current;

    if (node) {
      const { templateFonts } = Config.getAll().urls;
      loadFonts(this.containerRef.current, templateFonts);
    }
  }

  onIconClick = (icon: Icon) => {
    this.props.onClose?.();

    // leave a little breathing room for the browser
    setTimeout(() => {
      this.props.onChange(icon);
    }, 0);
  };

  handleSelectChange = (categoryId: State["categoryId"]) => {
    this.setState({ categoryId });
  };

  handleInputChange = (search: State["search"]) => {
    this.setState({ search });
  };

  handleTabClick = (typeId: State["typeId"]) => {
    this.setState({ typeId });
  };

  render() {
    const { name, type, opened = false, onClose } = this.props;
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
