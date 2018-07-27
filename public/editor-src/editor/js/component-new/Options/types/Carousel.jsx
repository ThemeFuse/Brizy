import React from "react";
import classnames from "classnames";
import EditorIcon from "visual/component-new/EditorIcon";
import { imageUrl } from "visual/utils/image";

class Carousel extends React.Component {
  static defaultProps = {
    className: "",
    items: [],
    value: {},
    key: 0
  };

  handleChange = (type, key) => {
    this.props.onChange(type, key);
  };

  renderItems(items) {
    const contentItems = items.map(({ value }, key, fullIndex) => {
      const { bgImageSrc: src, _id } = value;

      const style = {
        width: "100px",
        height: "100px",
        backgroundImage: `url(${imageUrl(src)})`,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%"
      };

      return (
        <div key={_id}>
          <div onClick={() => this.handleChange("clone", key)}>
            <EditorIcon icon="nc-duplicate" />
          </div>
          {fullIndex.length > 1 ? (
            <div onClick={() => this.handleChange("remove", key)}>
              <EditorIcon icon="nc-trash" />
            </div>
          ) : null}
          <div style={style} />
        </div>
      );
    });

    return <div className="brz-ed-option__carousel--items">{contentItems}</div>;
  }

  render() {
    const { className: _className, items } = this.props;
    const className = classnames("brz-ed-option__carousel", _className);

    return <div className={className}>{this.renderItems(items)}</div>;
  }
}

export default Carousel;
