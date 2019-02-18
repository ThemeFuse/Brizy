import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Options from "visual/component/Options";
class GridOptionType extends React.Component {
  static defaultProps = {
    className: "",
    location: "",
    attr: {},
    toolbar: null,
    columns: []
  };
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
    const renderedColumns = _.map(columns, (column, index) => {
      const style = {
        width: `${column.width}%`,
        flexBasis: `${column.width}%`
      };
      const columnClassName = classnames(
        "brz-ed-grid-option__column",
        column.className
      );

      return (
        <div key={index} className={columnClassName} style={style}>
          <Options
            className="brz-ed-grid__options"
            optionClassName="brz-ed-grid__option"
            data={column.options}
            location={location}
            toolbar={toolbar}
          />
        </div>
      );
    });
    return (
      <div {...attr} className={className}>
        {renderedColumns}
      </div>
    );
  }
}
export default GridOptionType;
