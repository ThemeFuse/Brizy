import React, { Component, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import _ from "underscore";
import Config from "visual/global/Config";
import Fixed from "visual/component/Prompts/Fixed";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import SmartGrid from "visual/component/Prompts/common/SmartGrid";
import EditorIcon from "visual/component/EditorIcon";
import { PromiseComponent } from "visual/component/PromiseComponent";
import { loadFonts } from "visual/component/Prompts/PromptIcon/utils";
import {
  getTypes,
  getCategories,
  getIconClassName,
  getIcons
} from "visual/config/icons";

const TYPES = getTypes();

const typeIdsToNames = TYPES.reduce((acc, { id, name }) => {
  acc[id] = name;

  return acc;
}, {});

export default class PromptIcon extends Component {
  static defaultProps = {
    name: "nc-star",
    type: "outline",
    onChange: _.noop
  };

  state = {
    typeId: (TYPES.find(t => t.name === this.props.type) ?? TYPES[0]).id,
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

  onIconClick = icon => {
    this.props.onClose();

    // leave a little breathing room for the browser
    setTimeout(() => {
      this.props.onChange(icon);
    }, 0);
  };

  renderTabs() {
    const tabs = TYPES.map(item => (
      <div
        key={item.id}
        className={classNames("brz-ed-popup-tab-item", {
          active: item.id === this.state.typeId
        })}
        onClick={() => this.setState({ typeId: item.id })}
      >
        <div className="brz-ed-popup-tab-icon">
          <EditorIcon icon={item.icon} />
        </div>
        <div className="brz-ed-popup-tab-name">{item.title}</div>
      </div>
    ));

    return (
      <div className="brz-ed-popup-header">
        <div className="brz-ed-popup-header__tabs">{tabs}</div>
        <div className="brz-ed-popup-btn-close" onClick={this.props.onClose} />
      </div>
    );
  }

  renderFilters() {
    const { categoryId, search, typeId } = this.state;
    const categories = [
      {
        id: "*",
        name: "all",
        title: "All Categories"
      },
      ...getCategories(typeId)
    ];

    return (
      <>
        <div className="brz-ed-popup__categories">
          <Select
            className="brz-ed-popup__select brz-ed-popup__select--block-categories brz-ed-popup-control__select--light"
            defaultValue={categoryId}
            maxItems={10}
            itemHeight={30}
            onChange={id => this.setState({ categoryId: id })}
          >
            {categories.map(({ id, title }) => (
              <SelectItem key={id} value={id}>
                {title}
              </SelectItem>
            ))}
          </Select>
        </div>
        <div className="brz-ed-popup__search">
          <input
            type="text"
            className="brz-input brz-ed-popup__input"
            placeholder="Enter Search Keyword"
            onChange={e =>
              this.setState({
                search: e.target.value
              })
            }
            value={search}
          />
          <div
            className={classNames("brz-ed-popup__search--icon", {
              active: search.length > 0
            })}
          >
            <EditorIcon icon="nc-search" />
          </div>
        </div>
      </>
    );
  }

  filterIcons(icons) {
    const { typeId, categoryId, search } = this.state;
    const searchRegex = new RegExp(search, "i");

    return icons.filter(
      ({ type, cat, title }) =>
        typeId === type &&
        (categoryId === "*" || cat.includes(categoryId)) &&
        (search === "" || searchRegex.test(title))
    );
  }

  render() {
    const { name, type, opened, onClose } = this.props;

    return (
      <Fixed opened={opened} onClose={onClose}>
        <div ref={this.containerRef} className="brz-ed-popup-wrapper">
          {this.renderTabs()}
          <div className="brz-ed-popup-content brz-ed-popup-pane brz-ed-popup-icons">
            <div className="brz-ed-popup-body">
              <div className="brz-ed-popup__head--search brz-d-xs-flex brz-align-items-center brz-justify-content-xs-center">
                {this.renderFilters()}
              </div>
              <div className="brz brz-ed-popup-icons__grid">
                <PromiseComponent
                  getPromise={() => getIcons(getTypes().map(t => t.id))}
                  renderResolved={icons => {
                    const filteredIcons = this.filterIcons(icons);

                    return (
                      <IconGrid
                        icons={filteredIcons}
                        value={{ name, type }}
                        onChange={this.onIconClick}
                      />
                    );
                  }}
                  renderWaiting={() => <LoadingSpinner />}
                  delayMs={1000}
                />
              </div>
            </div>
          </div>
        </div>
      </Fixed>
    );
  }
}

function IconGrid({ icons, value, onChange }) {
  const [gridSize, setGridSize] = useState(null);
  const node = useRef(null);
  const activeIconIndex = icons.findIndex(icon => icon.name === value.name);
  const rowCount = Math.floor(icons.length / 8) + 1;
  const activeRowIndex = Math.floor(activeIconIndex / 8);
  const prettyRowIndex = activeRowIndex === 0 ? 0 : activeRowIndex - 1;

  useEffect(() => {
    if (node.current) {
      const { width, height } = node.current.getBoundingClientRect();
      setGridSize({ width, height });
    }
  }, []);

  if (!gridSize) {
    return (
      <div style={{ height: "100%" }} ref={node}>
        <LoadingSpinner />
      </div>
    );
  }

  const { width, height } = gridSize;
  const columnWidth = 68;
  const columnsInRow = 8;
  const rowHeight = 68;
  const gutter = 6;
  const initialScrollTop = prettyRowIndex * (68 + gutter);

  return (
    <SmartGrid
      width={width}
      height={height}
      columnCount={columnsInRow}
      columnWidth={columnWidth}
      rowCount={rowCount}
      rowHeight={rowHeight}
      gutter={gutter}
      initialScrollTop={initialScrollTop}
      renderItem={({ rowIndex, columnIndex, style }) => {
        const index = rowIndex * 8 + columnIndex;
        const icon = icons[index];

        if (!icon) {
          return null;
        }

        const { type, name } = {
          type: typeIdsToNames[icon.type],
          name: icon.name
        };
        const className = classNames("brz-ed-popup-icons__grid__item", {
          active: type === value.type && name === value.name
        });

        return (
          <div
            style={{
              ...style,
              left: style.left + gutter,
              top: style.top + gutter,
              width: style.width - gutter,
              height: style.height - gutter
            }}
            className={className}
            onClick={() => {
              onChange({ type, name });
            }}
          >
            <i
              className={classNames(["brz-font-icon", getIconClassName(icon)])}
            />
          </div>
        );
      }}
    />
  );
}

function LoadingSpinner() {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#828b92",
        fontSize: "35px"
      }}
    >
      <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
    </div>
  );
}
