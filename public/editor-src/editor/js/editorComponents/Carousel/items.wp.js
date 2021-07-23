import React from "react";
import Items from "./items.js";
import { stringifyAttributes } from "visual/editorComponents/Posts/utils.common";

export default class ItemsWP extends Items {
  renderForView(v) {
    const {
      className,
      style,
      dynamic,
      taxonomy,
      taxonomyId,
      order,
      orderBy
    } = this.props;
    const items = dynamic === "on" ? v.slice(0, 1) : v;
    let content = items.map(this.renderItem);

    if (dynamic === "on") {
      const loopAttributes = stringifyAttributes({
        query: {
          tax_query: {
            0: {
              taxonomy,
              field: "id",
              terms: taxonomyId
            }
          },
          posts_per_page: -1,
          orderby: orderBy,
          order
        }
      });

      content = (
        <>
          {`{{ brizy_dc_post_loop ${loopAttributes} }}`}
          {content}
          {"{{end_brizy_dc_post_loop}}"}
        </>
      );
    }

    return (
      <div className={className} style={style}>
        {this.renderSlider(content)}
      </div>
    );
  }
}
