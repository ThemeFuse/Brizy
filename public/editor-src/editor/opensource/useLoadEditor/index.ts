import { useEffect, useState } from "react";
import { editorSrc as src } from "../utils/contants";

export const useLoadEditor = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const existingScript = document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      if (existingScript.getAttribute("data-loaded")) {
        setIsLoaded(true);
      } else {
        existingScript.addEventListener("load", () => setIsLoaded(true));
        existingScript.addEventListener("error", () =>
          setError(new Error(`Failed to load script: ${src}`))
        );
      }
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    const onLoad = () => {
      script.setAttribute("data-loaded", "true");
      setIsLoaded(true);
    };

    const onError = () => {
      setError(new Error(`Failed to load script: ${src}`));
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
  }, []);

  return { isLoaded, error };
};
