import React from "react";
import { TypeId } from "visual/config/icons/Type";
import { FCC } from "visual/utils/react/types";
import { ProContent } from "./ProContent";
import { RenderCustom } from "./RenderCustom";
import { RenderSimple } from "./RenderSimple";
import { Props } from "./types";
import { getTypes } from "visual/config/icons";

export const RenderIcons: FCC<Props> = ({
  name,
  type,
  typeId,
  search,
  categories,
  categoryId,
  onIconClick,
  onSelectChange,
  onInputChange
}) => {
  const { proDescription } = getTypes().find(({ id }) => id === typeId) ?? {};

  if (proDescription) {
    return <ProContent />;
  }

  if (typeId === TypeId.Custom) {
    return (
      <RenderCustom
        name={name}
        type={type}
        typeId={typeId}
        onIconClick={onIconClick}
      />
    );
  }

  return (
    <RenderSimple
      name={name}
      type={type}
      typeId={typeId}
      search={search}
      categories={categories}
      categoryId={categoryId}
      onIconClick={onIconClick}
      onSelectChange={onSelectChange}
      onInputChange={onInputChange}
    />
  );
};
