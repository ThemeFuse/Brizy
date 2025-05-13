import React from "react";
import { Align } from "visual/component/Brizy-ui/Align";
import { NoItems } from "visual/component/Brizy-ui/NoItems";
import { useTranslation } from "visual/providers/I18nProvider";

interface Props {
  emptyMessage?: string;
}

export function NoAddableItems({ emptyMessage }: Props) {
  const { t } = useTranslation();

  return (
    <Align align="center">
      <NoItems heading={t("Empty")}>
        {emptyMessage ?? t("You do not have any option")}
      </NoItems>
    </Align>
  );
}
