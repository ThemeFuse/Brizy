import React, { FC, ReactElement, useRef, useState } from "react";
import classNames from "classnames";
import Downshift from "downshift";
import { Manager, Reference, Popper } from "react-popper";
import { positionValues, Scrollbars } from "react-custom-scrollbars";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName } from "visual/utils/options/attributes";
import { OnChange } from "visual/component/Options/Type";
import { ItemInstance } from "./types/Item";
import { Item } from "./Item";
import { TagInstance } from "./types/Tag";
import { dropdownHeight, getValue } from "./utils";
import { String } from "visual/utils/string/specs";

type Items = Array<ItemInstance>;

export type Props = WithClassName & {
  placeholder?: string;
  children: Items;
  tags: Array<TagInstance>;
  inputValue: string;
  editable?: boolean;
  size: "short" | "medium" | "large" | "full" | "auto";
  onKeyDown: OnChange<string>;
  onType: OnChange<string>;
  onSelect: OnChange<ItemInstance>;
  scroll?: number;
};

export const Component: FC<Props> = ({
  className,
  placeholder = "",
  children,
  tags,
  editable = true,
  size,
  onKeyDown,
  onType,
  onSelect,
  inputValue,
  scroll = 5
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [height, setHeight] = useState(0);
  const onScrollUpdate = ({ scrollHeight }: positionValues): void => {
    height || setHeight(dropdownHeight(scrollHeight, children.length, scroll));
  };

  const _className = classNames(
    "brz-ed-control__multiSelect",
    `brz-ed-control__multiSelect--size-${size}`,
    className
  );

  return (
    <div className={_className}>
      <Manager>
        <Downshift
          onChange={onSelect}
          itemToString={(i?: ItemInstance): string =>
            i ? String.read(getValue(i)) ?? "" : ""
          }
        >
          {({ openMenu, isOpen, getMenuProps, getItemProps }): ReactElement => {
            const _onType = (v: string): void => {
              onType(v);
              isOpen || openMenu();
            };

            return (
              <div>
                <Reference>
                  {({ ref }): ReactElement => (
                    <div
                      ref={ref}
                      className="brz-ed-control__multiSelect--value-container"
                      onClick={(): void => openMenu()}
                    >
                      {tags}
                      {editable && (
                        <input
                          placeholder={placeholder}
                          ref={inputRef}
                          value={inputValue}
                          size={inputValue.length || 1}
                          onChange={({ target }): void => _onType(target.value)}
                          onKeyDown={({ key }): void => onKeyDown(key)}
                          onFocus={(): void => openMenu()}
                          className="brz-input brz-ed-control__multiSelect--value"
                        />
                      )}
                      {!editable && (
                        <EditorIcon
                          icon="nc-stre-down"
                          className="brz-control__select--arrow"
                        />
                      )}
                    </div>
                  )}
                </Reference>
                <div className="brz-ed-control__multiSelect__menu-container">
                  <Popper>
                    {({ ref, style, placement }): ReactElement | null => {
                      if (!isOpen) {
                        return null;
                      }

                      const items = children.map((item, i) => {
                        const props = getItemProps({
                          item,
                          key: i
                        });
                        return <Item key={i} {...props} {...item.props} />;
                      });

                      return items.length ? (
                        <div
                          ref={ref}
                          style={style}
                          className="brz-ed-control__multiSelect__menu"
                          data-placement={placement}
                        >
                          <Scrollbars
                            onUpdate={onScrollUpdate}
                            autoHeight={true}
                            autoHeightMax={height}
                            renderThumbVertical={(props): ReactElement => {
                              return (
                                <div
                                  className={
                                    "brz-ed-control__multiSelect__scroll-thumb"
                                  }
                                  {...props}
                                />
                              );
                            }}
                          >
                            <ul {...getMenuProps()} className="brz-ul">
                              {items}
                            </ul>
                          </Scrollbars>
                        </div>
                      ) : null;
                    }}
                  </Popper>
                </div>
              </div>
            );
          }}
        </Downshift>
      </Manager>
    </div>
  );
};
