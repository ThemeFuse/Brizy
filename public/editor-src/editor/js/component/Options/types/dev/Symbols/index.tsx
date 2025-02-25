import { without } from "es-toolkit";
import { find } from "es-toolkit/compat";
import React, { useCallback, useState } from "react";
import {
  Props as ControlProps,
  SelectEditable2
} from "visual/component/Brizy-ui/SelectEditable";
import { FCC } from "visual/utils/react/types";
import { uuid } from "visual/utils/uuid";
import { Choice, OnChangeCases } from "../EditableSelect/types";
import { Props } from "./types";

const CHOICES = [
  {
    title: "None",
    value: "none"
  },
  {
    title: "brz-spacer1",
    value: "value1"
  },
  {
    title: "brz-spacer2",
    value: "value2"
  },
  {
    title: "brz-spacer3",
    value: "value3"
  }
];

export const Symbols: FCC<Props> = ({ label }) => {
  const [choices, setChoices] = useState<Choice[]>(CHOICES);
  const [current, setCurrent] = useState<Choice>(choices[0]);

  // INFO: whole logic from this fn is temporary and is needed only for testing this option in UI
  // logic will be done when we will implement symbols
  const handleChange = useCallback<ControlProps["onChange"]>(
    (a) => {
      switch (a.type) {
        case OnChangeCases.Symbol: {
          const symbol = choices.find((s) => s.title === a.payload);

          if (symbol) {
            setCurrent(symbol);
          }
          break;
        }
        case OnChangeCases.Edit: {
          setCurrent({ ...current, title: a.payload });

          const candidate = choices.find((s) => s.title === a.payload);

          if (!candidate) {
            const newChoices = choices.map((s) => {
              if (s.value === current.value) {
                return { ...s, title: a.payload, value: a.payload };
              }

              return s;
            });

            setChoices(newChoices);
          }
          break;
        }
        case OnChangeCases.Duplicate: {
          if (current.title !== "none") {
            const className = current.title + uuid(3);
            const newSymbol = { title: className, value: className };

            setChoices([...choices, newSymbol]);
            setCurrent(newSymbol);
          }

          break;
        }
        case OnChangeCases.Delete: {
          const candidate = find(choices, {
            title: current.title
          });

          if (candidate) {
            setChoices(without(choices, candidate));
            setCurrent(CHOICES[0]);
          }
          break;
        }
      }
    },
    [current, choices]
  );

  return (
    <>
      {label}
      <SelectEditable2
        value={current?.title ?? "none"}
        title={current?.title ?? "None"}
        onChange={handleChange}
        choices={choices}
      />
    </>
  );
};
