import React from "react";
import classnames from "classnames";
import Options, { filterOptionsData } from "visual/component/Options";

class GridOptionType extends React.Component {
  static shouldOptionBeFiltered({ columns }) {
    return columns.every(
      column => filterOptionsData(column.options).length === 0
    );
  }

  static defaultProps = {
    className: "",
    location: "",
    attr: {},
    toolbar: null,
    columns: []
  };

  filterColumns(columns) {
    return columns.filter(
      column => filterOptionsData(column.options).length !== 0
    );
  }

  render() {
    const {
      className: _className,
      attr,
      columns,
      location,
      toolbar
    } = this.props;
    const className = classnames(
      "brz-d-xs-flex brz-flex-xs-no-wrap brz-ed-grid",
      _className
    );
    const renderedColumns = this.filterColumns(columns).map(
      ({ className, width, options }, index, allColumns) => {
        const columnClassName = classnames(
          "brz-ed-grid-option__column",
          className
        );
        const onlyOneColumn = allColumns.length === 1;
        const style = {
          width: onlyOneColumn ? "100%" : `${width}%`,
          flexBasis: onlyOneColumn ? "100%" : `${width}%`
        };

        return (
          <div key={index} className={columnClassName} style={style}>
            <Options
              className="brz-ed-grid__options"
              optionClassName="brz-ed-grid__option"
              data={options}
              location={location}
              toolbar={toolbar}
            />
          </div>
        );
      }
    );

    return (
      <div {...attr} className={className}>
        {renderedColumns}
      </div>
    );
  }
}
export default GridOptionType;
