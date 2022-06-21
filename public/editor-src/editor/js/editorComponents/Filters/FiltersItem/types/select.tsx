import React, { ReactElement, ReactNode, useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import Toolbar from "visual/component/Toolbar";
import { ThemeIcon } from "visual/component/ThemeIcon";
import ClickOutside from "visual/component/ClickOutside";
import { TextEditor } from "visual/component/Controls/TextEditor";
import _ from "underscore";
import { PortalToolbarProps } from "visual/component/Toolbar/PortalToolbar";

const MAX_ITEM_DROPDOWN = 5;

type Props = {
  id: string;
  toolbar: PortalToolbarProps;
  toolbarSelectOption: PortalToolbarProps;
  text: string;
  dataSource: string;
  classNames: string;
  handleTextChange: (v: string) => void;
  children: ReactNode;
};

const fakeData = (toolbarConfig: PortalToolbarProps): ReactElement[] => {
  const fakeArr = ["London", "Tokyo", "Moskow", "New York"];
  return Array(4)
    .fill("")
    .map((_, index) => {
      return (
        <Toolbar key={index} {...toolbarConfig}>
          <div className="brz-filters__select__item brz-filters__select__input">
            <input
              className="brz-input brz-input__select"
              value={fakeArr[index]}
              disabled
            />
          </div>
        </Toolbar>
      );
    });
};

export const SelectFilters = ({
  id,
  toolbar,
  toolbarSelectOption,
  text = "",
  dataSource = "",
  classNames,
  handleTextChange,
  children
}: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdown = React.createRef<HTMLDivElement>();

  const handleOpen = (e: React.MouseEvent<HTMLElement>): void => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleOutside = (): void => {
    if (isOpen) {
      setIsOpen(!isOpen);
    }
  };

  const getHeight = _.debounce(() => {
    if (dropdown.current) {
      const selectItem = dropdown.current.querySelector(
        ".brz-filters__select__item"
      );

      return (
        selectItem &&
        selectItem.getBoundingClientRect().height * MAX_ITEM_DROPDOWN
      );
    }

    return "100px";
  }, 0);

  const dropdownElement = (items: ReactNode): ReactElement => {
    return (
      <div ref={dropdown} className={"brz-filters__select__dropdown"}>
        <Scrollbars
          autoHeight={true}
          autoHeightMax={getHeight() as number | string}
        >
          {items}
        </Scrollbars>
      </div>
    );
  };

  const clickOutsideExceptions: Array<string> = [
    ".brz-filters__select__dropdown",
    ".brz-portal-forms__select",
    ".brz-ed-toolbar",
    ".brz-ed-tooltip__content-portal"
  ];

  return IS_EDITOR ? (
    <ClickOutside
      exceptions={clickOutsideExceptions}
      onClickOutside={handleOutside}
    >
      <div className={classNames}>
        <Toolbar {...toolbar}>
          <div className={"brz-filters__select-option"} onClick={handleOpen}>
            <TextEditor
              className="brz-filters__select"
              value={text}
              onChange={handleTextChange}
            />

            <ThemeIcon
              name="arrow-down"
              type="editor"
              className="brz-filters__select--icon"
            />
          </div>
        </Toolbar>
        {dataSource === "manual" && isOpen && dropdownElement(children)}
        {dataSource !== "manual" &&
          isOpen &&
          dropdownElement(fakeData(toolbarSelectOption))}
      </div>
    </ClickOutside>
  ) : (
    <div className={"brz-filters__select"}>
      <select
        className={"brz-filters__select-option"}
        name={`${id}`}
        id={`${id}`}
      >
        {children}
      </select>
    </div>
  );
};
