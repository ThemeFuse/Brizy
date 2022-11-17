import { useEffect, useState } from "react";

export const useWindowSize = (): { width: number; height: number } => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({
      width: document.body.clientWidth,
      height: document.body.clientHeight
    });

    const onResize = () => {
      setSize({
        width: document.body.clientWidth,
        height: document.body.clientHeight
      });
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
};
