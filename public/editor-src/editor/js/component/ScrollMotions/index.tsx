import { Motions } from "@brizy/motion";
import classnames from "classnames";
import React, { ReactElement, useEffect, useRef } from "react";
import { applyFilter } from "visual/utils/filters";
import { ScrollMotionsAttr, ScrollMotionsProps } from "./types";
import { makeOptionToAttr } from "./utils";

export const ScrollMotion = (props: ScrollMotionsProps): ReactElement => {
  const { className, options, children, needWrapper } = props;
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const motion = useRef<Motions>();
  let attr: ScrollMotionsAttr | undefined;

  useEffect(() => {
    const node = nodeRef.current;
    const instance = motion.current;

    // init Motions
    if (!instance && node && options) {
      const ImagesLoaded = applyFilter("getLibs", {}).ImagesLoaded;

      if (!ImagesLoaded) {
        motion.current = new Motions(node, options);
      } else {
        ImagesLoaded(node, () => {
          motion.current = new Motions(node, options);
        });
      }
    }

    // update instance of Motions
    if (instance && options) {
      instance.update(options);
    }

    // destroy Motions
    if (instance && !options) {
      instance.destroy();
      motion.current = undefined;
    }

    return (): void => {
      // destroy Motions
      if (motion.current && !options) {
        motion.current.destroy();
        motion.current = undefined;
      }
    };
  }, [options]);

  useEffect(() => {
    // destroy Motions on unMount
    return () => {
      if (motion.current && options) {
        motion.current.destroy();
        motion.current = undefined;
      }
    };
    // Don't need to add option in deps because this effects needed
    // only when the component is unMounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (IS_PREVIEW && options) {
    attr = {
      options: makeOptionToAttr(options),
      class: "brz-motion--effects"
    };
  }

  if (typeof children === "function") {
    return children(nodeRef, attr);
  }

  return options || needWrapper ? (
    <div
      {...attr?.options}
      ref={nodeRef}
      className={classnames(className, attr?.class)}
    >
      {children}
    </div>
  ) : (
    children
  );
};
