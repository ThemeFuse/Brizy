import React, { useCallback } from "react";
import { PromiseComponent } from "visual/component/PromiseComponent";
import { Icon } from "visual/config/icons/Icon";
import { getTypeIcons } from "visual/config/icons/icons";
import { FCC } from "visual/utils/react/types";
import { Filters } from "../Filters";
import { IconGrid } from "../IconGrid";
import { LoadingSpinner } from "../LoadingSpinner";
import { Props } from "./types";
import { getIcons } from "./utils";

export const RenderSimple: FCC<Props> = ({
  name,
  type,
  typeId,
  categoryId,
  search,
  categories,
  onInputChange,
  onSelectChange,
  onIconClick
}) => {
  const filterIcons = useCallback(
    (icons: Icon[]) => {
      const searchRegex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, ""),
        "i"
      );

      return icons.filter(
        ({ type, cat, title }) =>
          typeId === type &&
          (categoryId === "*" ||
            (typeof categoryId === "number" && cat.includes(categoryId))) &&
          (search === "" || searchRegex.test(title))
      );
    },
    [categoryId, search, typeId]
  );

  return (
    <div className="brz-ed-popup-body">
      <div className="brz-ed-popup__head--search brz-d-xs-flex brz-align-items-center brz-justify-content-xs-center">
        <Filters
          categoryId={categoryId}
          search={search}
          categories={categories}
          onSelectChange={onSelectChange}
          onInputChange={onInputChange}
        />
      </div>
      <div className="brz brz-ed-popup-icons__grid">
        <PromiseComponent
          getPromise={() => getTypeIcons(typeId)}
          renderResolved={(icons) => {
            const normalisedIcons = getIcons(icons);

            if (!normalisedIcons) {
              return <></>;
            }

            const filteredIcons = filterIcons(normalisedIcons);

            return (
              <IconGrid
                icons={filteredIcons}
                value={{ name, type }}
                onChange={onIconClick}
              />
            );
          }}
          renderWaiting={() => <LoadingSpinner />}
          delayMs={1000}
        />
      </div>
    </div>
  );
};
