import React from "react";
import { FCC } from "visual/utils/react/types";
import { Adder, Main, Thumbnail } from "./Components";
import { Props } from "./types";

export const PromptAddPopup: FCC<Props> = ({
  label,
  onCreate,
  onEdit,
  onDelete,
  popupBlock,
  className
}) => {
  return (
    <Main display="inline" className={className}>
      {label}
      {popupBlock ? (
        <Thumbnail
          popupBlock={popupBlock}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <Adder onClick={onCreate} />
      )}
    </Main>
  );
};
