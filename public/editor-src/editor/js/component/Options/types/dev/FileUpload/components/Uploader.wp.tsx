import React, { ReactElement, useCallback } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { getAttachmentById } from "visual/utils/api/index.wp";
import { Value } from "../types/Value";

export interface Props {
  value: Value;
  extensions: string[];
  onChange: (v: Value) => void;
}

export function Uploader({ value, onChange }: Props): ReactElement {
  const handleRemove = useCallback(() => onChange(undefined), [onChange]);

  const handleChange = useCallback(() => {
    const wp = global.wp || global.parent.wp;

    if (!wp) {
      throw new Error("Could not find WordPress on global object (window.wp)");
    }

    if (!wp.media) {
      throw new Error(
        "Could not find WordPress media object (window.wp.media). Make sure the WordPress media script is enqueued."
      );
    }

    const frame = wp.media({
      library: {
        type: "image"
      },
      states: new wp.media.controller.Library({
        multiple: false,
        title: "Upload file",
        filterable: "uploaded",
        priority: 20
      })
    });
    frame.on("select", () => {
      const attachment = frame.state().get("selection").first();

      getAttachmentById(attachment.get("id"))
        .then(({ uid }) => {
          const filename = attachment.get("filename");
          onChange({ id: uid, name: filename });
        })
        .catch((e) => {
          console.error("failed to get attachment uid", e);
        });
    });

    frame.open();
  }, [onChange]);

  switch (value) {
    case undefined:
      return (
        <div
          className="brz-ed-control__file-upload__wrapper"
          onClick={handleChange}
        >
          <EditorIcon icon="nc-add" />
        </div>
      );
    default:
      return (
        <div className="brz-ed-control__file-upload__file-name">
          <span
            className="brz-ed-control__file-upload__file-name--title"
            title={value.name}
          >
            {value.name}
          </span>
          <span className="brz-ed-control__file-upload__file-name--remove">
            <EditorIcon icon="nc-remove" onClick={handleRemove} />
          </span>
        </div>
      );
  }
}
