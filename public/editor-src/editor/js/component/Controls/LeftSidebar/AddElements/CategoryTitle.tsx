import React from "react";

interface Props {
  title: string;
}

export const CategoryTitle = ({ title }: Props): JSX.Element => (
  <div className="brz-ed-sidebar__add-elements--separator-title">{title}</div>
);
