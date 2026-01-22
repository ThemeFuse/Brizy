import classNames from "classnames";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { HorizontalScrollContainerProps } from "./types";

export const HorizontalScrollContainer = ({
  children,
  className
}: HorizontalScrollContainerProps): ReactElement => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkOverflow = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const containerHasOverflow = scrollWidth > clientWidth;

    setHasOverflow(containerHasOverflow);
    setShowLeftArrow(containerHasOverflow && scrollLeft > 0);
    setShowRightArrow(
      containerHasOverflow && scrollLeft + clientWidth < scrollWidth
    );
  }, []);

  const scrollRight = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: container.scrollLeft + 50,
      behavior: "smooth"
    });
  }, []);

  const scrollLeft = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollTo({
      left: container.scrollLeft - 50,
      behavior: "smooth"
    });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkOverflow();

    container.addEventListener("scroll", checkOverflow);

    // ResizeObserver is needed because we have expand/contract option in sidebar
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", checkOverflow);
      resizeObserver.disconnect();
    };
  }, [checkOverflow]);

  const containerClassNames = classNames(
    "brz-ed-horizontal-scroll-container",
    { "brz-ed-horizontal-scroll-container--overflowed": hasOverflow },
    className
  );

  return (
    <div className={containerClassNames}>
      {showLeftArrow && (
        <button
          className="brz-ed-horizontal-scroll-arrow brz-ed-horizontal-scroll-arrow--left"
          onClick={scrollLeft}
          type="button"
        >
          <EditorIcon icon="nc-left-arrow-heavy" />
        </button>
      )}

      <div ref={scrollRef} className="brz-ed-horizontal-scroll-content">
        {children}
      </div>

      {showRightArrow && (
        <button
          className="brz-ed-horizontal-scroll-arrow brz-ed-horizontal-scroll-arrow--right"
          onClick={scrollRight}
          type="button"
        >
          <EditorIcon icon="nc-right-arrow-heavy" />
        </button>
      )}
    </div>
  );
};
