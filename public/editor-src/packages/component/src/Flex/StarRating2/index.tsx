import React, { ReactElement } from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import { Props } from "./types";

export const StarRating2 = (props: Props): ReactElement => {
  const { showIcon, rating, iconName, iconType } = props;

  return (
    <div className="brz-starrating-style2-container">
      <span className="brz-starrating-text">{rating}</span>
      {showIcon && (
        <ThemeIcon
          className="brz-starrating-icon-wrap"
          name={iconName}
          type={iconType}
        />
      )}
    </div>
  );
};
