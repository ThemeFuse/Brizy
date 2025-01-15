import React, {
  PropsWithChildren,
  ReactElement,
  forwardRef,
  useCallback
} from "react";
import { useStore } from "react-redux";
import { rolesHOC } from "visual/component/Roles";
import { hideToolbar, showLastHiddenToolbar } from "visual/component/Toolbar";
import { isStory } from "visual/global/EditorModeContext";
import { useEditorMode } from "visual/global/hooks";
import { renderHOC } from "visual/providers/RenderProvider/renderHOC";
import { deviceModeSelector } from "visual/redux/selectors";
import { Resizer } from "./Resizer";
import {
  resizerTransformPatch,
  resizerTransformStory,
  resizerTransformStoryPatch,
  transformAlign,
  transformRestrictions,
  transformValue
} from "./transforms";
import { Meta, Patch, RestrictionMapping, Restrictions, V } from "./types";

type RM = RestrictionMapping;

type Props = {
  children: React.ReactNode;
  restrictions: Restrictions;
  value: V;
  meta?: Meta;
  onChange: (data: Patch["patch"]) => void;
  onStart?: VoidFunction;
  onEnd?: VoidFunction;
};

let startValue: RM | null = null;

const BoxResizer = forwardRef<HTMLElement, Props>(
  ({ value, onChange, meta = {}, ...props }, ref): ReactElement => {
    const store = useStore();
    const editorMode = useEditorMode();
    const _isStory = isStory(editorMode);

    // Although the standard way of accessing data from the store is by using connect from react-redux,
    // it could cause issues in this case due to potential re-renders triggered by connect.
    // This is especially problematic because BoxResizer might have child components with complex React trees (e.g., columns).
    const deviceMode = deviceModeSelector(store.getState());
    const restrictions = transformRestrictions(
      props.restrictions,
      value,
      deviceMode
    );
    const horizontalAlign = transformAlign(meta, "horizontalAlign", deviceMode);
    const verticalAlign =
      meta.column &&
      transformAlign(meta.column as Meta, "verticalAlign", deviceMode);

    // we don't just send value because of responsive
    // when we change device mode, editor doesn't rerender
    // and old props were using
    const getValue = useCallback((): RM => {
      let transformedValue = transformValue(value, deviceMode);
      if (_isStory) {
        transformedValue = resizerTransformStory(transformedValue, value);
      }

      return transformedValue;
    }, [value, deviceMode, _isStory]);

    // add useCallback hook
    const handleStart = (): void => {
      startValue = getValue();
      hideToolbar({ hideContainerBorder: false });

      const { onStart } = props;
      if (typeof onStart === "function") {
        onStart();
      }
    };

    const handleEnd = (): void => {
      startValue = null;
      showLastHiddenToolbar();

      const { onEnd } = props;
      if (typeof onEnd === "function") {
        onEnd();
      }
    };

    const _onChange = useCallback(
      ({ patch, point, startRect }: Patch): void => {
        const device = deviceModeSelector(store.getState());
        let path = resizerTransformPatch(
          patch,
          startValue as RM,
          value,
          device
        );

        if (_isStory) {
          path = resizerTransformStoryPatch(
            path,
            startValue as RM,
            point,
            startRect
          );
        }

        onChange(path);
      },
      [onChange, value, store, _isStory]
    );

    return (
      <Resizer
        {...props}
        restrictions={restrictions}
        isHorizontalCenterAligned={horizontalAlign === "center"}
        isVerticalCenterAligned={verticalAlign === "center"}
        getValue={getValue}
        onChange={_onChange}
        onStart={handleStart}
        onEnd={handleEnd}
        containerRef={ref}
      />
    );
  }
);

export default rolesHOC({
  allow: ["admin"],
  component: renderHOC<Props>({
    ForEdit: BoxResizer as (props: PropsWithChildren<Props>) => JSX.Element,
    ForView: ({ children }) => <>{children}</>
  }),
  fallbackRender: ({
    children
  }: {
    children: React.ReactNode;
  }): React.ReactNode => children
});
