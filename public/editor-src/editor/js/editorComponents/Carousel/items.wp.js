import React from "react";
import Items from "./items.js";

class ItemsWp extends Items {
  renderForView(v) {
    const {
      className,
      style,
      dynamic,
      columns,
      taxonomy,
      taxonomyId,
      order,
      orderBy
    } = this.props;
    const items = dynamic === "on" ? v.slice(0, 1) : v;
    let content = items.map(this.renderItem);

    if (dynamic === "on") {
      content = (
        <React.Fragment>
          {`{{
            brizy_dc_post_loop
            count='${columns}'
            taxonomy='${taxonomy}'
            value='${taxonomyId}'
            order='${order}'
            orderby='${orderBy}'
          }}`}
          {content}
          {`{{end_brizy_dc_post_loop}}`}
        </React.Fragment>
      );
    }

    return (
      <div className={className} style={style}>
        {this.renderSlider(content)}
      </div>
    );
  }
}

export default ItemsWp;
