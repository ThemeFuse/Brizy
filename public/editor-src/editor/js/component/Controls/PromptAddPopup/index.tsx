import React from "react";
import { FCC } from "visual/utils/react/types";
import { Adder, Main, Thumbnail } from "./Components";
import { Props } from "./types";

export const PromptAddPopup: FCC<Props> = ({
  label,
  onCreate,
  onEdit,
  onDelete,
  block,
  className
}) => {
  return (
    <Main display="inline" className={className}>
      {label}
      {block ? (
        <Thumbnail block={block} onEdit={onEdit} onDelete={onDelete} />
      ) : (
        <Adder onClick={onCreate} />
      )}
    </Main>
  );
};
