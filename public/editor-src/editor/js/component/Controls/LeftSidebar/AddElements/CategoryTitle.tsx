import React, { JSX } from "react";
import classnames from "classnames";
import EditorIcon from "visual/component/EditorIcon";

interface Props {
  title: string;
  onClick?: VoidFunction;
  open?: boolean;
}

export const CategoryTitle = ({ title, onClick, open }: Props): JSX.Element => {
  const className = classnames(
    "brz-ed-sidebar__add-elements--separator-title",
    {
      "brz-ed-sidebar__add-elements--separator-title--opened": open
    }
  );

  return (
    <div className={className} onClick={onClick}>
      <span>{title}</span>
      <EditorIcon icon="nc-mask-shape-triangle" />
    </div>
  );
};
