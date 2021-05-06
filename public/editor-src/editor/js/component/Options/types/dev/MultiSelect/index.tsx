import React, { FC, useState, useEffect, useRef } from "react";
import { take } from "underscore";
import EditorIcon from "visual/component/EditorIcon";
import {
  MultiSelect as Control,
  ItemType as ControlItemType
} from "visual/component/Controls/MultiSelect";
import { OptionType } from "visual/component/Options/Type";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { Literal } from "visual/utils/types/Literal";
import {
  DEFAULT_VALUE,
  getModel,
  getElementModel,
  toElement,
  isChoicesSync,
  searchChoices,
  mergeChoices,
  selectedChoices
} from "./utils";
import { Props, Choice, ChoicesSync, ChoicesAsync } from "./types";
import { Value } from "./Value";
import { t } from "visual/utils/i18n";

const LOADING = 0;
const IDLE = 1;
const SEARCHING = 2;
const NOT_FOUND = 3;
const FOUND = 4;

const stageTitle = new Map<CurrentStage, string>([
  [LOADING, t("Loading...")],
  [IDLE, t("Type to search")],
  [SEARCHING, t("Searching...")],
  [NOT_FOUND, t("No results")]
]);

type CurrentStage =
  | typeof LOADING
  | typeof IDLE
  | typeof SEARCHING
  | typeof NOT_FOUND
  | typeof FOUND;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

function choiceToItem({
  value,
  title,
  icon
}: ChoicesSync[number]): ControlItemType<Value["value"]> {
  return (
    <Item<Literal> value={value} key={value}>
      {icon && <EditorIcon icon={icon} className={"brz--space-right"} />}
      {title}
    </Item>
  );
}

export const MultiSelect: FC<Props> & OptionType<Value> = props => {
  const choices = props.choices;

  if (isChoicesSync(choices)) {
    return (
      <>
        {props.label}
        <Sync {...props} choices={choices} />
      </>
    );
  } else {
    return (
      <>
        {props.label}
        <Async {...props} choices={choices} />
      </>
    );
  }
};

const Sync: FC<Omit<Props, "choices"> & { choices: ChoicesSync }> = ({
  placeholder,
  choices,
  value: { value = [] },
  onChange,
  config
}) => {
  const [inputValue, setInputValue] = useState("");

  return (
    // to find out what wrong is here
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Control<Literal>
      placeholder={placeholder}
      size={config?.size ?? "medium"}
      value={value}
      editable={config?.search ?? true}
      onChange={(v): void => {
        const n = config?.items || 999;
        onChange(toElement(v.length <= n ? v : take(v, n)));
      }}
      inputValue={inputValue}
      onInputChange={setInputValue}
    >
      {(inputValue === ""
        ? choices
        : mergeChoices(
            selectedChoices(value, choices),
            searchChoices(inputValue, choices)
          )
      ).map(choiceToItem)}
    </Control>
  );
};

const Async: FC<Omit<Props, "choices"> & { choices: ChoicesAsync }> = ({
  placeholder,
  choices,
  value: { value = [] },
  onChange,
  config
}) => {
  const [stage, setStage] = useState<CurrentStage>(LOADING);
  const [inputValue, setInputValue] = useState("");
  const debouncedInputValue = useDebounce(inputValue, 1000);
  const [selectedChoices, setSelectedChoices] = useState<Choice[]>([]);
  const [searchChoices, setSearchChoices] = useState<Choice[]>([]);
  const currentSearchController = useRef<AbortController>();

  useEffect(() => {
    let controller: AbortController;

    if (value.length > 0) {
      controller = new AbortController();

      choices
        .load(value, controller.signal)
        .then(r => {
          if (!controller.signal.aborted) {
            setSelectedChoices(r);
            setStage(IDLE);
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setStage(IDLE);
          }
        });
    } else {
      setStage(IDLE);
    }

    return (): void => {
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    if (debouncedInputValue !== "") {
      const controller = new AbortController();
      currentSearchController.current = controller;

      choices
        .search(debouncedInputValue, controller.signal)
        .then(r => {
          if (!controller.signal.aborted) {
            if (r.length > 0) {
              setSearchChoices(r);
              setStage(FOUND);
            } else {
              setStage(NOT_FOUND);
            }
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setStage(NOT_FOUND);
          }
        });
    }
  }, [debouncedInputValue]);

  if (stage === LOADING) {
    return <div style={{ color: "white" }}>{stageTitle.get(LOADING)}</div>;
  }

  const items = selectedChoices.map(choiceToItem);
  if (stage === FOUND) {
    const values = new Set(selectedChoices.map(c => c.value));
    for (const choice of searchChoices) {
      if (!values.has(choice.value)) {
        items.push(choiceToItem(choice));
      }
    }
  } else {
    items.push(
      <Item<Literal> value="" disabled={true} key="disabled">
        {stageTitle.get(stage)}
      </Item>
    );
  }

  return (
    // to find out what wrong is here
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Control<Literal>
      placeholder={placeholder}
      size={config?.size ?? "medium"}
      value={value}
      editable={config?.search ?? true}
      onChange={(v): void => {
        const selectedItems = v
          .map(vv =>
            [...selectedChoices, ...searchChoices].find(
              item => item.value === vv
            )
          )
          .filter(item => item !== undefined) as Choice[];
        setSelectedChoices(selectedItems);

        const n = config?.items || 999;
        onChange(toElement(v.length <= n ? v : take(v, n)));
      }}
      inputValue={inputValue}
      onInputChange={(v): void => {
        setInputValue(v);

        currentSearchController.current?.abort();
        setStage(v === "" ? IDLE : SEARCHING);
      }}
    >
      {items}
    </Control>
  );
};

MultiSelect.getModel = getModel;
MultiSelect.getElementModel = getElementModel;

MultiSelect.defaultValue = DEFAULT_VALUE;
