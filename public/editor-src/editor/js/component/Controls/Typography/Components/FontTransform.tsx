import React, { FC, useCallback, useMemo } from "react";
import { Toggle } from "visual/component/Controls/Toggle";
import { ToggleButton } from "visual/component/Controls/ToggleButton";
import { TextScripts } from "visual/types/Style";
import { t } from "visual/utils/i18n";
import { FontScript, FontTransformProps as Props } from "../types/Props";

export const FontTransform: FC<Props> = ({
  bold,
  uppercase,
  italic,
  underline,
  strike,
  lowercase,
  script,
  scriptChoices,
  onBoldChange,
  onUppercaseChange,
  onItalicChange,
  onUnderlineChange,
  onStrikeChange,
  onLowercaseChange,
  onScriptChange
}) => {
  const handleChangeBold = useCallback(() => {
    onBoldChange(!bold);
  }, [bold, onBoldChange]);

  const handleChangeItalic = useCallback(() => {
    onItalicChange(!italic);
  }, [italic, onItalicChange]);

  const handleChangeUnderline = useCallback(() => {
    onUnderlineChange(!underline);
  }, [underline, onUnderlineChange]);

  const handleChangeStrike = useCallback(() => {
    onStrikeChange(!strike);
  }, [strike, onStrikeChange]);

  const handleChangeUppercase = useCallback(() => {
    onUppercaseChange(!uppercase);
  }, [uppercase, onUppercaseChange]);

  const handleChangeLowercase = useCallback(() => {
    onLowercaseChange(!lowercase);
  }, [lowercase, onLowercaseChange]);

  const options = useMemo(
    () => [
      {
        icon: "nc-bold",
        title: t("Bold"),
        value: bold,
        onChange: handleChangeBold
      },
      {
        icon: "nc-italic",
        title: t("Italic"),
        value: italic,
        onChange: handleChangeItalic
      },
      {
        icon: "nc-tp-underline",
        title: t("Underline"),
        value: underline,
        onChange: handleChangeUnderline
      },
      {
        icon: "nc-tp-strike",
        title: t("Strike"),
        value: strike,
        onChange: handleChangeStrike
      },
      {
        icon: "nc-tp-capitalize",
        title: t("Uppercase"),
        value: uppercase,
        onChange: handleChangeUppercase
      },
      {
        icon: "nc-tp-lowercase",
        title: t("Lowercase"),
        value: lowercase,
        onChange: handleChangeLowercase
      }
    ],
    [
      bold,
      italic,
      underline,
      strike,
      uppercase,
      lowercase,
      handleChangeBold,
      handleChangeItalic,
      handleChangeUnderline,
      handleChangeStrike,
      handleChangeUppercase,
      handleChangeLowercase
    ]
  );

  return (
    <div className="brz-ed-control__typography-font-transform">
      {options.map(({ icon, title, value, onChange }) => (
        <ToggleButton
          key={title}
          value={value}
          icon={icon}
          title={title}
          onClick={onChange}
          reverseTheme={true}
        />
      ))}
      {scriptChoices && (
        <Toggle<FontScript["script"]>
          choices={scriptChoices as FontScript["scriptChoices"]}
          value={{ value: script ?? TextScripts.None }}
          onChange={onScriptChange}
        />
      )}
    </div>
  );
};
