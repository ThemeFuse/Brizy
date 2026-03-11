import React, { forwardRef, useEffect, useRef } from "react";
import SlimSelectLib, { Events, Option, Settings } from "slim-select";

interface Props {
  events?: Events;
  children?: React.ReactNode;
  settings?: Partial<Settings>;
  data?: Array<Option["data"]>;
}

export const SlimSelect = forwardRef<SlimSelectLib, Props>((props, ref) => {
  const { children, events, settings, data } = props;

  const selectRef = useRef<HTMLSelectElement>(null);
  const selectInstance = useRef<SlimSelectLib | null>(null);

  useEffect(() => {
    if (selectRef.current) {
      const { contentLocation: _contentLocation } = settings || {};

      const contentLocation =
        _contentLocation ?? selectRef.current.parentElement;

      selectInstance.current = new SlimSelectLib({
        select: selectRef.current,
        events,
        settings: {
          ...settings,
          ...(contentLocation ? { contentLocation } : {})
        },
        data
      });

      if (ref) {
        if ("current" in ref) {
          ref.current = selectInstance.current;
        }

        if (typeof ref === "function") {
          ref(selectInstance.current);
        }
      }
    }

    return () => {
      if (selectInstance.current) {
        selectInstance.current.destroy();
        selectInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings?.contentLocation]);

  return <select ref={selectRef}>{children}</select>;
});
