import { useArgs } from "@storybook/client-api";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import { Cancelable, debounce } from "underscore";
import { InternalLink } from "../index";
import "../style/index.scss";
import { Choice, Status } from "../types";
import { items } from "../utils/testUtils";

const defaultStyles: CSSProperties = { fontSize: "13px" };

type DebouncedSearchChange = ((s: string) => void) & Cancelable;

export default {
  title: "Selection and Input/InternalLink",
  component: InternalLink,
  parameters: {
    backgrounds: { default: "dark" }
  },
  decorators: [
    (Story) => (
      <div style={defaultStyles}>
        <Story />
      </div>
    )
  ]
} as ComponentMeta<typeof InternalLink>;

const Template: ComponentStory<typeof InternalLink> = ({
  status,
  items: _items,
  ...props
}) => {
  const [_, updateArgs] = useArgs();

  const debouncedSearch = useRef<DebouncedSearchChange>();

  const initialItems = useMemo(
    () => (status === Status.INITIAL ? [] : _items),
    [status, _items]
  );

  const handleResetValue = useCallback(
    () => updateArgs({ value: undefined }),
    [updateArgs]
  );
  const handleChange = useCallback(
    (v: Choice) =>
      updateArgs({ value: { title: v.title, id: v.value.toString() } }),
    [updateArgs]
  );
  const handleSearch = useCallback(
    (v: string): void => {
      updateArgs({ isLoading: true });
      if (v) {
        debouncedSearch?.current?.(v);
      } else {
        updateArgs({ items: [], status: Status.INITIAL, isLoading: false });
      }
    },
    [updateArgs]
  );

  useEffect(() => {
    debouncedSearch.current = debounce((v: string) => {
      const newItems = items.filter((i: Choice) => i.title.includes(v));
      updateArgs({
        items: newItems,
        isLoading: false,
        status: newItems.length ? Status.SUCCESS : Status.NO_RESULT
      });
    }, 1000);

    return debouncedSearch.current?.cancel;
  }, [updateArgs]);

  return (
    <InternalLink
      {...props}
      status={status}
      items={initialItems}
      resetValue={handleResetValue}
      onChange={handleChange}
      onSearch={handleSearch}
    />
  );
};

export const Primary: ComponentStory<typeof InternalLink> = Template.bind({});
Primary.args = {
  value: undefined,
  placeholder: "hello world",
  items,
  status: Status.INITIAL
};
