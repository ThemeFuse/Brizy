/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback } from "react";
import { rolesHOC } from "visual/component/Roles";
import { hideToolbar, showLastHiddenToolbar } from "visual/component/Toolbar";
import { Resizer } from "./Resizer";
import {
  transformRestrictions,
  transformValue,
  resizerTransformPatch,
  transformAlign
} from "./transforms";
import { V, Meta, RestrictionMapping, Restrictions, Patch } from "./types";

type RM = RestrictionMapping;

type Props = {
  children: React.ReactNode;
  restrictions: Restrictions;
  value: V;
  meta?: Meta;
  onChange: (data: Patch["patch"]) => void;
};

let startValue: RM | null = null;

const BoxResizer: React.FC<Props> = ({
  value,
  onChange,
  meta = {},
  ...props
}) => {
  if (IS_PREVIEW) {
    return <>{props.children}</>;
  }

  const restrictions = transformRestrictions(props.restrictions, value);
  const horizontalAlign = transformAlign(meta, "horizontalAlign");
  const verticalAlign =
    meta.column && transformAlign(meta.column as Meta, "verticalAlign");
  const resizerV: RM = transformValue(value);

  // we don't just send value because of responsive
  // when we change device mode, editor doesn't rerender
  // and old props were using
  const getValue = useCallback((): RM => transformValue(value), [
    resizerV.size,
    resizerV.width,
    resizerV.height
  ]);

  // add useCallback hook
  const handleStart = (): void => {
    startValue = getValue();
    hideToolbar();
  };

  const handleEnd = (): void => {
    startValue = null;
    showLastHiddenToolbar();
  };

  const _onChange = useCallback(
    ({ patch }: Patch): void =>
      onChange(resizerTransformPatch(patch, startValue as RM, value)),
    [onChange, startValue, value]
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
    />
  );
};

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export default rolesHOC({
  allow: ["admin"],
  component: BoxResizer,
  fallbackRender: ({
    children
  }: {
    children: React.ReactNode;
  }): React.ReactNode => children
});
