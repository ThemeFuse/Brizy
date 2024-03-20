import React, { ReactElement, useCallback, useMemo } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { t } from "visual/utils/i18n";
import * as Obj from "visual/utils/reader/object";
import * as Str from "visual/utils/reader/string";
import { auto, empty } from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import Input from "./Input";
import Select from "./Select";
import { Choices, OptGroup } from "./types/Choices";
import { Handler } from "./types/Handler";
import { Value } from "./types/Value";
import { findDCChoiceByPlaceholder } from "./utils";

export interface Props<T extends Literal> {
  choices: Array<Choices<T> | OptGroup<T>>;
  handlerChoices?: Handler<T>;
  value: T;
  entityType: string;
  entityId: string;
  onChange: (s: Value) => void;
  renderUnset?: () => ReactElement;
}

interface SelectProps<T extends Literal> {
  choices: Props<T>["choices"];
  value: T;
  entityType: string;
  entityId: string;
  onChange: (s: Value) => void;
  renderUnset?: () => ReactElement;
}

interface IconProps<T extends Literal> {
  handlerChoices: Handler<T>;
  value: T;
  renderUnset?: () => ReactElement;
  onChange: (s: Value) => void;
}

const _Select = <T extends Literal>(props: SelectProps<T>): ReactElement => {
  const {
    choices: _choices,
    value,
    entityType,
    entityId,
    renderUnset,
    onChange
  } = props;

  const choices = useMemo(() => {
    return [
      {
        title: t("None"),
        value: empty as T,
        name: empty as T,
        attr: {}
      },

      ...(_choices || [])
    ];
  }, [_choices]);

  let input: ReactElement | undefined;

  const handleRemove = useCallback(() => {
    onChange({
      population: empty,
      populationEntityType: empty,
      populationEntityId: empty
    });
  }, [onChange]);

  const selectedPlaceholder = findDCChoiceByPlaceholder({
    placeholder: Str.read(value) ?? "",
    choices
  });

  const activeItem =
    selectedPlaceholder &&
    Obj.isObject(selectedPlaceholder) &&
    !Array.isArray(selectedPlaceholder)
      ? Str.read(selectedPlaceholder.title)
      : null;

  if (value) {
    input = <Input value={activeItem ?? `${value}`} onRemove={handleRemove} />;
  } else {
    input = renderUnset?.();
  }

  return (
    <>
      {input}
      <Select
        choices={choices}
        entityType={entityType}
        entityId={entityId}
        value={value}
        onChange={onChange}
      />
    </>
  );
};

const _Icon = <T extends Literal>(props: IconProps<T>): ReactElement => {
  const { handlerChoices, value, onChange, renderUnset } = props;
  let input: ReactElement | undefined;

  const handleRemove = useCallback(
    () =>
      onChange({
        population: empty,
        populationEntityType: empty,
        populationEntityId: empty
      }),
    [onChange]
  );

  const extra = useMemo(
    () => ({
      placeholder: value
    }),
    [value]
  );

  const handleClick = useCallback(() => {
    if (typeof handlerChoices === "function") {
      const res = (placeholder: T) => {
        onChange({
          population: Str.read(placeholder) ?? empty,
          populationEntityType: empty,
          populationEntityId: empty
        });
      };
      const rej = (error: string) => {
        ToastNotification.error(error);
      };
      handlerChoices(res, rej, extra);
    }
  }, [handlerChoices, onChange, extra]);

  if (value) {
    input = <Input value={`${value}`} onRemove={handleRemove} />;
  } else {
    input = renderUnset?.();
  }

  return (
    <>
      {input}
      <div
        className="brz-ed-control__population--handler"
        onClick={handleClick}
      >
        <EditorIcon icon="nc-dynamic" />
      </div>
    </>
  );
};

export default function Population<T extends Literal>({
  choices,
  handlerChoices,
  value,
  entityType,
  entityId,
  renderUnset,
  onChange
}: Props<T>): ReactElement | null {
  if (Array.isArray(choices)) {
    return (
      <_Select
        value={value}
        choices={choices}
        entityType={entityType ?? auto}
        entityId={entityId ?? ""}
        onChange={onChange}
        renderUnset={renderUnset}
      />
    );
  }

  if (handlerChoices) {
    return (
      <_Icon
        value={value}
        handlerChoices={handlerChoices}
        onChange={onChange}
        renderUnset={renderUnset}
      />
    );
  }

  return null;
}
