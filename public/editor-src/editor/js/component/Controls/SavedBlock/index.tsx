import classnames from "classnames";
import React, { FC, ReactElement } from "react";
import EditorIcon from "visual/component/EditorIcon";

interface Props {
  onClick: () => void;
  className?: string;
  title: string;
  tooltipContent?: string;
  loading: boolean;
  icon: string;
}

export const SavedBlock: FC<Props> = ({
  onClick,
  className,
  title,
  tooltipContent,
  loading,
  icon
}): ReactElement => {
  const _className = classnames(
    "brz-ed-option__button",
    "brz-ed-tooltip__content",
    className
  );

  return (
    <div className={_className} title={title} onClick={onClick}>
      {tooltipContent && !loading && (
        <div className="brz-ed-toolbar__item__tooltip">{tooltipContent}</div>
      )}
      {loading ? (
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      ) : (
        <EditorIcon
          icon={icon}
          className="brz-ed-animated brz-ed-animated--fadeIn"
        />
      )}
    </div>
  );
};
