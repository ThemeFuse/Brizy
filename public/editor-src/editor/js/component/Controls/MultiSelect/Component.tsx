import React, {
  ReactElement,
  useRef,
  useState,
  useEffect,
  useCallback,
  ComponentProps,
  KeyboardEvent
} from "react";
import classNames from "classnames";
import { property } from "underscore";
import Downshift from "downshift";
import { Manager, Reference, Popper } from "react-popper";
import { positionValues, Scrollbars } from "react-custom-scrollbars";
import EditorIcon from "visual/component/EditorIcon";
import { WithClassName } from "visual/utils/options/attributes";
import { OnChange } from "visual/component/Options/Type";
import { Props as ItemProps } from "./Item";
import { dropdownHeight } from "./utils";
import * as Str from "visual/utils/string/specs";
import { Tag } from "visual/component/Controls/MultiSelect/Tag";
import { SelectItem } from "visual/component/Controls/MultiSelect/SelectItem";
import { Literal } from "visual/utils/types/Literal";
import { mCompose } from "visual/utils/value";

type ItemInstance<T> = ReactElement<ItemProps<T>>;
type TagInstance = ReactElement<ComponentProps<typeof Tag>>;

export type Props<T> = WithClassName & {
  children: ItemInstance<T>[];
  tags: TagInstance[];
  size: "short" | "medium" | "large" | "full" | "auto";
  onSelect: OnChange<T>;
  scroll?: number;
  onOpen?: () => void;
  editable?: boolean;
  inputValue?: string;
  placeholder?: string;
  onType?: OnChange<string>;
  onKeyDown?: OnChange<KeyboardEvent<HTMLInputElement>>;
};

const getEnvironment = (node: HTMLElement | null): Window => {
  return node?.ownerDocument?.defaultView || window;
};

export function Component<T extends Literal>({
  className,
  placeholder = "",
  children,
  tags,
  editable,
  size,
  onKeyDown,
  onType,
  onSelect,
  inputValue,
  scroll = 5,
  onOpen
}: Props<T>): ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [height, setHeight] = useState(0);
  const [mount, setMount] = useState(false);
  useEffect(() => setHeight(0), [children.length]);
  const onScrollUpdate = ({ scrollHeight }: positionValues): void => {
    height || setHeight(dropdownHeight(scrollHeight, children.length, scroll));
  };
  const _onSelect = useCallback(
    mCompose(onSelect, property("value"), property("props")),
    [onSelect]
  );

  useEffect(() => {
    setMount(true);
  }, []);

  const _className = classNames(
    "brz-ed-control__multiSelect",
    `brz-ed-control__multiSelect--size-${size}`,
    className
  );

  return (
    <div ref={containerRef} className={_className}>
      <Manager>
        <Downshift
          // Use key in order to force re-render for the Downshift when component mounts
          // This is necessary in order to refresh the `environment` prop
          key={Number(mount)}
          environment={getEnvironment(containerRef.current)}
          onChange={_onSelect}
          itemToString={(i?: ItemInstance<T>): string => Str.mRead(i?.key)}
        >
          {({ openMenu, isOpen, getMenuProps, getItemProps }): ReactElement => {
            const triggerOpen = (): void => {
              if (!isOpen) {
                onOpen && onOpen();
                openMenu();
              }
              inputRef.current?.focus();
            };

            return (
              <div>
                <Reference>
                  {({ ref }): ReactElement => (
                    <div
                      ref={ref}
                      className="brz-ed-control__multiSelect--value-container"
                      onClick={(): void => triggerOpen()}
                    >
                      {tags}
                      {editable && (
                        <input
                          placeholder={placeholder}
                          ref={inputRef}
                          value={inputValue}
                          size={inputValue?.length || 1}
                          onChange={({ target }): void => {
                            onType?.(target.value);
                            triggerOpen();
                          }}
                          onKeyDown={onKeyDown}
                          onFocus={(): void => {
                            triggerOpen();
                          }}
                          className="brz-input brz-ed-control__multiSelect--value"
                        />
                      )}
                      {!editable && (
                        <>
                          {tags.length === 0 && (
                            <span className="brz-ed-control__multiSelect--placeholder">
                              {placeholder}
                            </span>
                          )}
                          <EditorIcon
                            icon="nc-stre-down"
                            className="brz-control__select--arrow"
                          />
                        </>
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
                          key: i,
                          disabled: item.props.disabled
                        });
                        return (
                          <SelectItem key={i} {...props} {...item.props} />
                        );
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
}
