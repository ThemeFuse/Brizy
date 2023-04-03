import classnames from "classnames";
import React, { FC, ReactElement } from "react";
import { IconsName } from "../EditorIcon/types";
import { EditorIcon } from "../index";
import { Props } from "./types";

export const SavedBlock: FC<Props> = ({
  onClick,
  className,
  title,
  tooltipContent,
  isLoading,
  icon
}): ReactElement => {
  const _className = classnames("brz-ed-tooltip__content", className);

  return (
    <div className={_className} title={title} onClick={onClick}>
      {tooltipContent && !isLoading && (
        <div className="brz-ed-toolbar__item__tooltip">{tooltipContent}</div>
      )}
      {isLoading ? (
        <EditorIcon
          icon={IconsName.Spinner}
          className="brz-ed-animated--spin"
        />
      ) : (
        <EditorIcon
          icon={icon}
          className="brz-ed-animated brz-ed-animated--fadeIn"
        />
      )}
    </div>
  );
};
