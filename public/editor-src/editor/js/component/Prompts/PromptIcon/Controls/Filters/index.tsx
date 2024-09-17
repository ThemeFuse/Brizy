import classNames from "classnames";
import React, { ChangeEvent, useCallback } from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";
import { FCC } from "visual/utils/react/types";
import { Props } from "./types";

export const Filters: FCC<Props> = ({
  categoryId,
  categories,
  search,
  onSelectChange,
  onInputChange
}) => {
  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onInputChange(e.target.value);
    },
    [onInputChange]
  );

  return (
    <>
      <div className="brz-ed-popup__categories">
        <Select
          className="brz-ed-popup__select brz-ed-popup__select--block-categories brz-ed-popup-control__select--light"
          defaultValue={categoryId}
          maxItems={10}
          itemHeight={30}
          onChange={onSelectChange}
        >
          {categories.map(({ id, title }) => (
            <SelectItem key={id} value={id}>
              {title}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div className="brz-ed-popup__search">
        <input
          type="text"
          className="brz-input brz-ed-popup__input"
          placeholder={t("Enter Search Keyword")}
          onChange={handleInputChange}
          value={search}
        />
        <div
          className={classNames("brz-ed-popup__search--icon", {
            active: search.length > 0
          })}
        >
          <EditorIcon icon="nc-search" />
        </div>
      </div>
    </>
  );
};
