import React, { ReactElement } from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { Props } from "./types";

export const StarRating1 = (props: Props): ReactElement => {
  const {
    showLeftLabel,
    showRightLabel,
    rating,
    ratingScale,
    iconName,
    iconType,
    label
  } = props;

  const stars = Array(ratingScale)
    .fill("")
    .map((_, i) => (
      <div key={i} className="brz-starrating-icon-wrap">
        <ThemeIcon
          name={iconName}
          type={iconType}
          className="brz-starrating-color-empty"
        />
        <span
          className="brz-starrating-color"
          style={{
            // this is done with calc because v.rating can have dynamic content
            // which means that we can not do the math in js,
            // because it would look like: "{{ brizy_dc_post_title }}" - i
            width: `calc((${rating} - ${i}) * 100%)`
          }}
        >
          <ThemeIcon name={iconName} type={iconType} />
        </span>
      </div>
    ));

  return (
    <>
      {showLeftLabel && label}
      <div className="brz-starrating-container" title={rating}>
        {stars}
      </div>
      {showRightLabel && label}
    </>
  );
};
