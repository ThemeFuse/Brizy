import React from "react";
import classnames from "classnames";
import Options from "visual/component/Options";
import { isT } from "visual/utils/value";

const vAlign = ["top", "center", "bottom"];
const toVAlign = v =>
  vAlign.includes(v) ? `brz-ed-grid-option__column--${v}` : "";

class GridOptionType extends React.Component {
  static filter(f, t) {
    return {
      ...t,
      columns:
        t.columns
          ?.map(column => ({
            ...column,
            options: column.options.map(f).filter(isT)
          }))
          .filter(column => column.options.length > 0) ?? []
    };
  }

  static reduce(fn, t0, item) {
    return (
      item.columns?.reduce((acc, { options }) => options.reduce(fn, acc), t0) ??
      t0
    );
  }

  static map(fn, item) {
    return {
      ...item,
      columns: item.columns?.map(column => ({
        ...column,
        options: column.options.map(fn)
      }))
    };
  }

  static defaultProps = {
    className: "",
    location: "",
    attr: {},
    toolbar: null,
    columns: [],
    separator: false
  };

  render() {
    const {
      className: _className,
      attr,
      columns,
      location,
      toolbar,
      separator
    } = this.props;
    const className = classnames(
      "brz-d-xs-flex brz-flex-xs-no-wrap brz-ed-grid",
      { "brz-ed-grid--separator": !!separator },
      _className
    );
    const renderedColumns = columns.map(
      ({ className, width, options, vAlign }, index, allColumns) => {
        const columnClassName = classnames(
          "brz-ed-grid-option__column",
          toVAlign(vAlign),
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
