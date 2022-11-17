import { useEffect, useState } from "react";
import { debounce } from "underscore";

const DEFAULT_OPTIONS = {
  config: {
    attributes: true,
    childList: true,
    subtree: true
  },
  debounceTime: 250
};

export const useMutationObservable = (
  targetEl: HTMLElement,
  cb: VoidFunction,
  options = DEFAULT_OPTIONS
): void => {
  const [observer, setObserver] = useState<MutationObserver>();

  useEffect(() => {
    if (!cb || typeof cb !== "function") {
      console.warn(
        `You must provide a valida callback function, instead you've provided ${cb}`
      );
      return;
    }
    const { debounceTime } = options;
    const obs = new MutationObserver(
      debounceTime > 0 ? debounce(cb, debounceTime) : cb
    );
    setObserver(obs);
  }, [cb, options, setObserver]);

  useEffect(() => {
    if (!observer) return;

    if (!targetEl) {
      console.warn(
        `You must provide a valid DOM element to observe, instead you've provided ${targetEl}`
      );
    }

    const { config } = options;

    try {
      observer.observe(targetEl, config);
    } catch (e) {
      console.error(e);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [observer, targetEl, options]);
};
