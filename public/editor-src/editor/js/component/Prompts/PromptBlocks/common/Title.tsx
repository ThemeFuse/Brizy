import React, {
  ChangeEventHandler,
  ReactElement,
  useEffect,
  useRef
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { t } from "visual/utils/i18n";

export interface Props {
  value: string;
  onChange: (v: string) => void;
}

export const Title = (props: Props): ReactElement => {
  const { value, onChange } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
  };

  const handlePen = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const node = inputRef.current;

    if (node && node.value !== value) {
      node.value = value;
    }
  }, [value]);

  return (
    <div className="brz-ed-popup-two-block__bottom-control-title">
      <input
        ref={inputRef}
        type="text"
        className="brz-input"
        placeholder={t("Give it a title")}
        defaultValue={value}
        onChange={handleChange}
      />
      <span
        className="brz-ed-popup-two-block__bottom-control-title-pen"
        title={t("Edit")}
      >
        <EditorIcon onClick={handlePen} icon="nc-pen" />
      </span>
    </div>
  );
};
