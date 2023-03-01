import cn from "classnames";
import { mPipe } from "fp-utilities";
import React, { ReactElement, useEffect, useState } from "react";
import { decryptIcon, fetchIcon, ParsedSVG, parseSVG } from "./utils";

interface ThemeIconProps {
  name: string;
  type: string;
  className?: string;
}

export const ThemeIcon: (props: ThemeIconProps) => ReactElement | null =
  IS_EDITOR ? ThemeIconEditor : ThemeIconPreview;

function ThemeIconEditor({
  className: _className,
  type,
  name
}: ThemeIconProps): ReactElement | null {
  const className = cn("brz-icon-svg align-[initial]", _className);
  const [parsed, setParsed] = useState<ParsedSVG | undefined>(undefined);

  useEffect(() => {
    const abortController = new AbortController();

    (async () => {
      try {
        const iconStr = await fetchIcon(type, name, abortController);
        const parsed = mPipe(decryptIcon, parseSVG)(iconStr);

        setParsed(parsed);
      } catch (e) {
        console.warn(e);
        setParsed(undefined);
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [type, name]);

  return parsed ? (
    <svg
      {...parsed.attr}
      className={className}
      dangerouslySetInnerHTML={{ __html: parsed.innerHTML }}
    />
  ) : null;
}

function ThemeIconPreview({
  className: _className,
  type,
  name
}: ThemeIconProps): ReactElement {
  const className = cn("brz-icon-svg align-[initial]", _className);

  return <svg className={className} data-type={type} data-name={name} />;
}
