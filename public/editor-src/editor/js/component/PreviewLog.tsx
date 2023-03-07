import React, { ReactElement } from "react";

/**
 * This component is used to be able to log data in react components in Preview.
 * If should be used only for debugging, don't use it in production
 */
export function PreviewLog(props: { data: unknown }): ReactElement | null {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (IS_EDITOR) {
    console.log(props.data);

    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `console.log(JSON.parse(decodeURI("${encodeURI(
          JSON.stringify(props.data)
        )}")))`
      }}
    />
  );
}
