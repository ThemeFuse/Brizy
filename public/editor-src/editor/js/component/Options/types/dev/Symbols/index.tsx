import { isEqual } from "es-toolkit";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  type Props as ControlProps,
  SelectEditable2
} from "visual/component/Brizy-ui/SelectEditable";
import { createDuplicatedClassName } from "visual/editorComponents/EditorComponent/utils";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  type SymbolsCreatePayload,
  type SymbolsPayload,
  createSymbol,
  deleteSymbol,
  updateSymbol
} from "visual/redux/actions2";
import { symbolsSelector } from "visual/redux/selectors";
import type { FCC } from "visual/utils/react/types";
import { uuid } from "visual/utils/uuid";
import { type Choice, OnChangeCases } from "../EditableSelect/types";
import { type Props } from "./types";
import {
  NONE_CHOICE,
  getCurrentValue,
  getSymbolByUid,
  getSymbolsByType,
  symbolsToChoices
} from "./utils";

export const Symbols: FCC<Props> = ({ label, value, config, onChange }) => {
  const { type } = config ?? {};

  const { classes } = useSelector(symbolsSelector);
  const dispatch = useDispatch();

  const symbols = useMemo(
    () =>
      !type
        ? [NONE_CHOICE]
        : [
            NONE_CHOICE,
            ...getSymbolsByType(type, classes).map(({ uid, label }) => ({
              title: label,
              value: uid
            }))
          ],
    [type, classes]
  );

  const currentValue = getCurrentValue(value.value[0], symbols);

  const [choices, setChoices] = useState<Choice[]>(symbols);
  const [current, setCurrent] = useState<Choice>(currentValue ?? NONE_CHOICE);

  useEffect(() => {
    const currentValue =
      getCurrentValue(value.value[0], symbols) ?? NONE_CHOICE;

    if (
      current.value !== currentValue.value ||
      current.title !== currentValue.title
    ) {
      setCurrent(currentValue);
    }
  }, [value.value, current, symbols]);

  useEffect(() => {
    if (type) {
      const symbolsByType = getSymbolsByType(type, classes);
      const newChoices = [NONE_CHOICE, ...symbolsToChoices(symbolsByType)];

      if (!isEqual(choices, newChoices)) {
        setChoices(newChoices);
      }
    }
  }, [classes, choices, type]);

  const handleChange = useCallback<ControlProps["onChange"]>(
    (a) => {
      switch (a.type) {
        case OnChangeCases.Symbol: {
          const value = a.payload;

          if (value === "None") {
            onChange({ value: [] });
            break;
          }

          const symbol = choices.find((s) => s.title === a.payload);

          if (symbol) {
            onChange({ value: [symbol.value] });
          }
          break;
        }
        case OnChangeCases.Edit: {
          const currentSymbol = getSymbolByUid(current.value, classes);

          if (currentSymbol) {
            const label = a.payload;

            const newSymbol: SymbolsPayload = {
              element: undefined,
              cssClass: {
                ...currentSymbol,
                label
              }
            };

            dispatch(updateSymbol(newSymbol));
          }
          break;
        }
        case OnChangeCases.Duplicate: {
          if (current.title !== "none" && type) {
            const currentSymbol = getSymbolByUid(current.value, classes);

            if (currentSymbol) {
              const childrenId = uuid();

              const label = createDuplicatedClassName(currentSymbol.label);
              const className = `brz-${type.toLowerCase()}-${childrenId}`;

              const newSymbols: SymbolsCreatePayload = {
                element: undefined,
                cssClasses: [
                  {
                    ...currentSymbol,
                    className,
                    uid: childrenId,
                    label
                  }
                ]
              };

              const wrapperSymbol = getSymbolsByType(
                ElementTypes.Wrapper,
                classes
              ).find((s) => s.model.v.childrenId === currentSymbol.uid);

              if (wrapperSymbol) {
                const wrapperSymbolId = uuid();

                const wrapperClassName = `brz-${ElementTypes.Wrapper.toLowerCase()}-${wrapperSymbolId}`;
                const wrapperLabel = createDuplicatedClassName(
                  wrapperSymbol.label
                );

                newSymbols.cssClasses.push({
                  ...wrapperSymbol,
                  className: wrapperClassName,
                  uid: wrapperSymbolId,
                  label: wrapperLabel,
                  model: {
                    ...wrapperSymbol.model,
                    v: {
                      ...wrapperSymbol.model.v,
                      childrenId
                    }
                  }
                });
              }

              dispatch(createSymbol(newSymbols));
              onChange({ value: [childrenId] });
            }
          }

          break;
        }
        case OnChangeCases.Delete: {
          const candidate = choices.find((s) => s.value === current.value);
          const wrapperSymbol = getSymbolsByType(
            ElementTypes.Wrapper,
            classes
          ).find((s) => s.model.v.childrenId === candidate?.value);

          if (candidate) {
            dispatch(deleteSymbol([candidate.value, wrapperSymbol?.uid ?? ""]));
            onChange({ value: [] });
          }
          break;
        }
      }
    },
    [type, classes, current, choices, dispatch, onChange]
  );

  return (
    <>
      {label}
      <SelectEditable2
        value={current?.title ?? "none"}
        title={current?.title ?? "None"}
        onChange={handleChange}
        choices={choices}
        hasDelete={true}
        hasEdit={true}
        hasDuplicate={true}
      />
    </>
  );
};
