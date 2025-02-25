import React, { useCallback, useMemo, useState } from "react";
import ClickOutside from "visual/component/ClickOutside";
import { NumberSlider } from "visual/component/Controls/NumberSlider";
import { Unit } from "visual/component/Controls/NumberUnit/types";
import EditorIcon from "visual/component/EditorIcon";
import { Label } from "visual/component/Label";
import { Scrollbar } from "visual/component/Scrollbar";
import { t } from "visual/utils/i18n";
import { clamp } from "visual/utils/math";
import { isT } from "visual/utils/value";
import { NumberType, VariationValue } from "../types/FontVariation";
import { FontVariationProps as Props } from "../types/Props";

export const VariationFont = ({
  variableFontWeight,
  fontWidth,
  fontSoftness,
  variations,
  onVariableFontWeightChange,
  onFontWidthChange,
  onSoftnessChange
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  const handleVariableFontWeightChange = useCallback(
    ({ number }: NumberType) => onVariableFontWeightChange(number),
    [onVariableFontWeightChange]
  );

  const handleFontWidthChange = useCallback(
    ({ number }: NumberType) => onFontWidthChange(number),
    [onFontWidthChange]
  );

  const handleSoftnessChange = useCallback(
    ({ number }: NumberType) => onSoftnessChange(number),
    [onSoftnessChange]
  );

  const getVariationByTag = useCallback(
    (tag: string) => variations?.find(({ tag: _tag }) => _tag === tag),
    [variations]
  );

  const clickOutsideExceptions = [
    ".brz-ed-control__typography-variation",
    ".brz-ed-control__typography-variation-title"
  ];

  const units: Unit<string>[] = [];

  const variationsMap = useMemo(
    () => ({
      wght: {
        title: t("Weight"),
        value: variableFontWeight,
        onChange: handleVariableFontWeightChange,
        min: 100,
        max: 900
      },
      wdth: {
        title: t("Width"),
        value: fontWidth,
        onChange: handleFontWidthChange,
        min: 0,
        max: 100
      },
      SOFT: {
        title: t("Softness"),
        value: fontSoftness,
        onChange: handleSoftnessChange,
        min: 0,
        max: 100
      }
    }),
    [
      variableFontWeight,
      fontWidth,
      fontSoftness,
      handleSoftnessChange,
      handleFontWidthChange,
      handleVariableFontWeightChange
    ]
  );

  const _variations: VariationValue[] = useMemo(
    () =>
      Object.entries(variationsMap)
        .map(([tag, value]) => {
          const variation = getVariationByTag(tag);
          if (!variation) return null;

          return {
            ...value,
            ...variation
          };
        })
        .filter(isT),
    [getVariationByTag, variationsMap]
  );

  return (
    <>
      <div className="brz-ed-control__typography-variation" onClick={toggle}>
        <span
          className="brz-ed-control__typography-variation-title"
          title={t("Variable")}
        >
          {t("Variable")}
        </span>
        <EditorIcon icon="nc-stre-down" />
      </div>
      {isOpen && (
        <ClickOutside
          onClickOutside={() => setIsOpen(false)}
          exceptions={clickOutsideExceptions}
        >
          {({ ref }) => (
            <Scrollbar
              theme="dark"
              className="brz-ed-control__typography-variation-scrollbar"
            >
              <div ref={ref}>
                {_variations.map(({ title, value, onChange, min, max }) => {
                  const _value = clamp(value, min, max);

                  return (
                    <div
                      className="brz-ed-control__typography-variation-item"
                      key={title}
                    >
                      <Label title={title}>{title}</Label>
                      <NumberSlider
                        value={{
                          number: _value,
                          unit: ""
                        }}
                        onChange={onChange}
                        step={1}
                        min={min}
                        max={max}
                        units={units}
                      />
                    </div>
                  );
                })}
              </div>
            </Scrollbar>
          )}
        </ClickOutside>
      )}
    </>
  );
};
