import React from "react";
import _ from "underscore";
import classnames from "classnames";
import Options from "visual/component/Options";

class GridOptionType extends React.Component {
  static defaultProps = {
    className: "",
    location: "",
    toolbar: null,
    columns: []
  };

  render() {
    const { columns, location, toolbar } = this.props;

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
      <div className="brz-d-xs-flex brz-flex-xs-no-wrap">{renderedColumns}</div>
    );
  }
}

export default GridOptionType;
