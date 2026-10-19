import classNames from "classnames";
import Downshift from "downshift";
import { property } from "es-toolkit/compat";
import React, {
  type ComponentProps,
  type KeyboardEvent,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import { usePopper } from "react-popper";
import { SelectItem } from "visual/component/Controls/Select2/SelectItem";
import type { Tag } from "visual/component/Controls/Select2/Tag";
import EditorIcon from "visual/component/EditorIcon";
import type { OnChange } from "visual/component/Options/Type";
import {
  Scrollbar,
  type ScrollbarUpdateValues
} from "visual/component/Scrollbar";
import type { WithClassName } from "visual/types/attributes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import type { Position } from "visual/utils/position/Position";
import { mRead } from "visual/utils/string/specs";
import type { Literal } from "visual/utils/types/Literal";
import { mCompose } from "visual/utils/value";
import type { Props as ItemProps } from "./Item";
import { dropdownHeight } from "./utils";

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

  const onScrollUpdate = useCallback(
    ({ scrollHeight }: ScrollbarUpdateValues): void => {
      // biome-ignore lint/suspicious/noUnusedExpressions: left as the original short-circuit - height comes from useState(0) so `height ||` and `if (!height)` are equivalent, and this path sizes the dropdown
      height ||
        setHeight(dropdownHeight(scrollHeight, children.length, scroll));
    },
    [children.length, scroll, height]
  );

  const _onSelect = useCallback(
    (v: T) => mCompose(onSelect, property("value"), property("props"))(v),
    [onSelect]
  );
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

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
              if (onOpen) onOpen();
              openMenu();
            } else if (autoClose) {
              closeMenu();
            }
            inputRef.current?.focus();
          };

          const items = children.map((item) => {
            const props = getItemProps({
              item,
              disabled: item.props.disabled
            });
            return (
              <SelectItem key={item.props.value} {...props} {...item.props} />
            );
          });

          return (
            <div>
              <div
                ref={setReferenceElement}
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

              {isOpen && referenceElement && items.length && (
                <div className="brz-ed-control__multiSelect__menu-container">
                  <div
                    ref={setPopperElement}
                    style={{
                      ...styles.popper,
                      position: positionDropdown || styles.popper.position
                    }}
                    className="brz-ed-control__multiSelect__menu"
                    {...makeDataAttr({
                      name: "placement",
                      value: attributes.popper?.["data-popper-placement"]
                    })}
                  >
                    <Scrollbar
                      onUpdate={onScrollUpdate}
                      autoHeight={true}
                      autoHeightMax={maxHeight ?? height}
                    >
                      <ul {...getMenuProps()} className="brz-ul">
                        {items}
                      </ul>
                    </Scrollbar>
                  </div>
                </div>
              )}
            </div>
          );
        }}
      </Downshift>
    </div>
  );
}
