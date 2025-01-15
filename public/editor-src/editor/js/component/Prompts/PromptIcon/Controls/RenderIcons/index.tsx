import React, { useMemo } from "react";
import { getTypes } from "visual/config/icons";
import { TypeId } from "visual/config/icons/Type";
import { isWp } from "visual/global/Config";
import { isPro } from "visual/utils/env";
import { FCC } from "visual/utils/react/types";
import { ProContent } from "./ProContent";
import { RenderCustom } from "./RenderCustom";
import { RenderSimple } from "./RenderSimple";
import { Props } from "./types";

export const RenderIcons: FCC<Props> = ({
  name,
  type,
  typeId,
  search,
  categories,
  categoryId,
  onIconClick,
  onSelectChange,
  onInputChange,
  config
}) => {
  const _isPro = isPro(config);
  const _isWp = isWp(config);
  const proDescription = useMemo(() => {
    const { proDescription } =
      getTypes(_isPro, _isWp).find(({ id }) => id === typeId) ?? {};
    return proDescription;
  }, [typeId, _isPro, _isWp]);

  if (proDescription) {
    return <ProContent upgradeToPro={config.urls?.upgradeToPro} />;
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
      config={config}
    />
  );
};
