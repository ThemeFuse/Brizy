import React, { ReactElement } from "react";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

type Props = {
  iconName: string;
  iconType: string;
  toolbarConfig: PortalToolbarProps;
  starCount: number;
};

export const RatingFilters = ({
  iconName,
  iconType,
  toolbarConfig,
  starCount
}: Props): ReactElement => {
  const stars = Array(+starCount)
    .fill("")
    .map((_, i) => (
      <div key={i} className="brz-filters__option brz-starrating-icon-wrap">
        <ThemeIcon
          name={iconName}
          type={iconType}
          className="brz-filters__rating--color-empty"
        />
        <span
          className="brz-filters__rating--color brz-starrating-color"
          style={{
            // this is done with calc because v.rating can have dynamic content
            // which means that we can not do the math in js,
            // because it would look like: "{{ brizy_dc_post_title }}" - i
            width: `calc((${+starCount - 1} - ${i}) * 100%)`
          }}
        >
          <ThemeIcon
            className="brz-filters__rating-icon"
            name={iconName}
            type={iconType}
          />
        </span>
      </div>
    ));

  return (
    <Toolbar {...toolbarConfig}>
      <div className={"brz-filters__rating"}>{stars}</div>
    </Toolbar>
  );
};
