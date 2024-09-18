import classNames from "classnames";
import Downshift from "downshift";
import React, {
  ComponentProps,
  KeyboardEvent,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { positionValues, Scrollbars } from "react-custom-scrollbars";
import { Manager, Popper, Reference } from "react-popper";
import { property } from "underscore";
import { SelectItem } from "visual/component/Controls/Select2/SelectItem";
import { Tag } from "visual/component/Controls/Select2/Tag";
import EditorIcon from "visual/component/EditorIcon";
import { OnChange } from "visual/component/Options/Type";
import { WithClassName } from "visual/types/attributes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { mRead } from "visual/utils/string/specs";
import { Literal } from "visual/utils/types/Literal";
import { mCompose } from "visual/utils/value";
import { Props as ItemProps } from "./Item";
import { dropdownHeight } from "./utils";
import { Position } from "visual/utils/position/Position";

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
  autoClose?: boolean;
  onType?: OnChange<string>;
  onKeyDown?: OnChange<KeyboardEvent<HTMLInputElement>>;
  maxHeight?: number;
  positionDropdown?: Position;
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
  autoClose,
  onOpen,
  maxHeight,
  positionDropdown
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
    (v: T) => mCompose(onSelect, property("value"), property("props"))(v),
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
          itemToString={(i?: ItemInstance<T>): string => mRead(i?.key)}
        >
          {({
            openMenu,
            isOpen,
            getMenuProps,
            getItemProps,
            closeMenu
          }): ReactElement => {
            const triggerOpen = (): void => {
              if (!isOpen) {
                onOpen && onOpen();
                openMenu();
              } else if (autoClose) {
                closeMenu();
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
                          style={{
                            ...style,
                            position: positionDropdown || style.position
                          }}
                          className="brz-ed-control__multiSelect__menu"
                          {...makeDataAttr({
                            name: "placement",
                            value: placement
                          })}
                        >
                          <Scrollbars
                            onUpdate={onScrollUpdate}
                            autoHeight={true}
                            autoHeightMax={maxHeight ?? height}
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
