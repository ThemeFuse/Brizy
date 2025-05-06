import classnames from "classnames";
import React, { JSX, useCallback, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Toolbar, { hideToolbar } from "visual/component/Toolbar";
import { DESKTOP } from "visual/utils/responsiveMode";
import { ToolbarItem } from "./ToolbarItem";
import { FontStyleProps } from "./types";

const animateClassName = "brz-ed-option__font-style-editor--animate";

export const FontStyleItem = (value: FontStyleProps): JSX.Element => {
  const {
    title,
    showDeleteIcon,
    deletable,
    onChange,
    itemIndex,
    animationCounter,
    sampleStyle,
    toolbarItems
  } = value;

  const [state, setState] = useState({
    device: DESKTOP,
    active: false
  });

  const { active } = state;

  const handleOpen = useCallback((): void => {
    setState((prevState) => ({
      ...prevState,
      active: true
    }));
  }, []);

  const handleClose = useCallback((): void => {
    setState((prevState) => ({
      ...prevState,
      active: false
    }));
  }, []);

  const handleTextChange = useCallback(
    (title: string) => {
      onChange({ title });
    },
    [onChange]
  );

  const handleDelete = useCallback(() => {
    hideToolbar();
    onChange({ deleted: true });
  }, [onChange]);

  const className = classnames("brz-ed-option__font-style-editor", {
    active,
    [animateClassName]: animationCounter !== 0
  });

  const style = { animationDelay: `${0.2 * itemIndex}s` };

  return (
    <div className={className} style={style}>
      {showDeleteIcon ? (
        <div
          className="brz-ed-option__font-style-editor--delete"
          onClick={handleDelete}
        >
          <EditorIcon icon="nc-trash" />
        </div>
      ) : null}
      <Toolbar
        getItems={toolbarItems}
        onOpen={handleOpen}
        onClose={handleClose}
      >
        {({ ref }) => (
          <ToolbarItem
            ref={ref}
            deletable={deletable}
            style={sampleStyle}
            title={title}
            onClick={handleTextChange}
          />
        )}
      </Toolbar>
    </div>
  );
};
