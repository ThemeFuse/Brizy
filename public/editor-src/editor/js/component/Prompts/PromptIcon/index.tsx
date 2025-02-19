import { noop } from "es-toolkit";
import React, { Component } from "react";
import { getCategories, getTypes } from "visual/config/icons";
import { isWp } from "visual/global/Config";
import { isPro } from "visual/utils/env";
import { t } from "visual/utils/i18n";
import Control from "./Controls";
import { Icon, Props, State } from "./types";
import { loadFonts } from "./utils";

export default class PromptIcon extends Component<Props, State> {
  static defaultProps = {
    name: "nc-star",
    type: "outline",
    onChange: noop
  };

  containerRef = React.createRef<HTMLDivElement>();

  constructor(props: Props) {
    super(props);
    const { type, config } = props;
    const _isPro = isPro(config);
    const _isWp = isWp(config);
    const types = getTypes(_isPro, _isWp);
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
      loadFonts(
        this.containerRef.current,
        this.props.config.urls?.templateFonts
      );
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
    const { name, type, opened = false, onClose, config } = this.props;
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
        config={config}
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
