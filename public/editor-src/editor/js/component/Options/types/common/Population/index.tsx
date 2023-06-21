import React, { ReactElement, useCallback } from "react";
import { EditorIcon } from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { findDeep } from "visual/utils/object";
import { Empty } from "visual/utils/string/specs";
import Input from "./Input";
import Select from "./Select";
import { Choices, OptGroup } from "./types/Choices";
import { Handler } from "./types/Handler";
import { isOptgroup } from "./utils";

export interface Props<T extends string | number> {
  choices: Array<Choices<T> | OptGroup<T>>;
  handlerChoices?: Handler<T>;
  value: T;
  onChange: (s: T | Empty) => void;
  renderUnset?: () => ReactElement;
}

interface SelectProps<T extends string | number> {
  choices: Props<T>["choices"];
  value: T;
  onChange: (s: T | Empty) => void;
  renderUnset?: () => ReactElement;
}

interface IconProps<T extends string | number> {
  handlerChoices: Handler<T>;
  value: T;
  renderUnset?: () => ReactElement;
  onChange: (s: T | Empty) => void;
}

const _Select = <T extends string | number>(
  props: SelectProps<T>
): ReactElement => {
  const { choices, value, renderUnset, onChange } = props;
  let input: ReactElement | undefined;
  const handleRemove = useCallback(() => onChange(""), [onChange]);

  if (value) {
    const activeItem: Choices<T> | null = findDeep(
      choices,
      (choice: Choices<T> | OptGroup<T>): boolean => {
        return !isOptgroup(choice) && choice.value === value;
      }
    ).obj;

    input = (
      <Input value={activeItem?.title ?? `${value}`} onRemove={handleRemove} />
    );
  } else {
    input = renderUnset?.();
  }

  return (
    <>
      {input}
      <Select choices={choices} value={value} onChange={onChange} />
    </>
  );
};

const _Icon = <T extends string | number>(
  props: IconProps<T>
): ReactElement => {
  const { handlerChoices, value, onChange, renderUnset } = props;
  let input: ReactElement | undefined;

  const handleRemove = useCallback(() => onChange(""), [onChange]);

  const handleClick = useCallback(() => {
    if (typeof handlerChoices === "function") {
      const res = (placeholder: T) => {
        onChange(placeholder);
      };
      const rej = (error: string) => {
        ToastNotification.error(error);
      };
      handlerChoices(res, rej);
    }
  }, [handlerChoices, onChange]);

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

export default function Population<T extends string | number>({
  choices,
  handlerChoices,
  value,
  renderUnset,
  onChange
}: Props<T>): ReactElement | null {
  if (Array.isArray(choices)) {
    return (
      <_Select
        value={value}
        choices={choices}
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
