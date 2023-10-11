import React, { useCallback } from "react";
import { rolesHOC } from "visual/component/Roles";
import { hideToolbar, showLastHiddenToolbar } from "visual/component/Toolbar";
import Config from "visual/global/Config";
import { isStory } from "visual/utils/models";
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

const BoxResizer: React.FC<Props> = ({
  value,
  onChange,
  meta = {},
  ...props
}) => {
  const restrictions = transformRestrictions(props.restrictions, value);
  const horizontalAlign = transformAlign(meta, "horizontalAlign");
  const verticalAlign =
    meta.column && transformAlign(meta.column as Meta, "verticalAlign");
  const resizerV: RM = transformValue(value);

  // we don't just send value because of responsive
  // when we change device mode, editor doesn't rerender
  // and old props were using
  const getValue = useCallback((): RM => {
    let transformedValue = transformValue(resizerV);
    if (isStory(Config.getAll())) {
      transformedValue = resizerTransformStory(transformedValue, value);
    }

    return transformedValue;
  }, [resizerV, value]);

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
      let path = resizerTransformPatch(patch, startValue as RM, value);

      if (isStory(Config.getAll())) {
        path = resizerTransformStoryPatch(
          path,
          startValue as RM,
          point,
          startRect
        );
      }

      onChange(path);
    },
    [onChange, value]
  );

  if (IS_PREVIEW) {
    return <>{props.children}</>;
  }

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
    />
  );
};

export default rolesHOC({
  allow: ["admin"],
  component: BoxResizer,
  fallbackRender: ({
    children
  }: {
    children: React.ReactNode;
  }): React.ReactNode => children
});
