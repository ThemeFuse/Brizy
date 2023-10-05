import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useRef,
  useState
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Title } from "./Title";

export interface Props {
  value: string;
  onChange: (v: string) => void;
}

export const Edit = (props: Props): ReactElement => {
  const { value: _value, onChange } = props;
  const [value, setValue] = useState(_value);
  const [editable, setEdit] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    const newValue = value.trim();

    if (newValue && newValue !== _value) {
      onChange(newValue);
    }

    setEdit(false);
  };

  const handleStopPropagation: MouseEventHandler<HTMLDivElement> = (e) => {
    if (editable) {
      e.stopPropagation();
    }
  };

  const handleClick = (e: MouseEvent): void => {
    if (!editable) {
      e.stopPropagation();
    }
    setEdit(!editable);
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
    }
  }, [editable]);

  return (
    <div
      className="brz-ed-popup-two__select-editable"
      onClick={handleStopPropagation}
    >
      {editable ? (
        <input
          ref={inputRef}
          className="brz-ed-popup-two__select-input"
          value={value}
          onChange={handleChange}
          onBlur={handleAdd}
          onKeyPress={handleKeyPress}
        />
      ) : (
        <>
          <Title boxed={true} title={value} />
          <EditorIcon
            className="brz-ed-popup-two__select-pen"
            icon="nc-pen"
            onClick={handleClick}
          />
        </>
      )}
    </div>
  );
};
