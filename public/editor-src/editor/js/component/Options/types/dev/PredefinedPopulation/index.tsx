import React from "react";
import * as Str from "visual/utils/reader/string";
import { read as readLiteral } from "visual/utils/types/Literal";
import Select from "../../common/Population/Select";
import { findDCChoiceByPlaceholder } from "../../common/Population/utils";
import type { Props } from "./types";

export const PredefinedPopulation: React.FC<Props> = (props) => {
  const { config } = props;
  const { activeChoice } = config ?? {};

  if (!config || !activeChoice) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Could not find active choice. Check config.contentDefault"
      );
    }

    return <></>;
  }

  const { value, onChange } = props;

  const _value = Str.read(value.population) ?? activeChoice ?? "";

  const _entityType = Str.read(value.populationEntityType) ?? "";
  const _entityId = readLiteral(value.populationEntityId) ?? "";
  const currentDCChoice = findDCChoiceByPlaceholder({
    placeholder: Str.read(value.population) ?? "",
    choices: config.choices
  });

  return (
    <Select<string>
      choices={[]}
      showChoices={false}
      value={_value}
      entityType={_entityType}
      entityId={_entityId}
      currentDCChoice={currentDCChoice}
      onChange={onChange}
    />
  );
};
