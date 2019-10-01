import React, { useState, useEffect, useRef } from "react";
import Fixed from "../Fixed2";
import EditorIcon from "visual/component/EditorIcon";

export function PromptThirdParty({ iframeSrc, opened, onClose }) {
  return (
    <Fixed opened={opened} onClose={onClose}>
      <ThirdPartyIframe src={iframeSrc} onRequestClose={onClose} />
    </Fixed>
  );
}

function ThirdPartyIframe({ src, onRequestClose }) {
  const [loaded, setLoaded] = useState(false);
  const iframeEl = useRef(null);

  useEffect(() => {
    const handler = e => {
      // check origin
      const url = new URL(src);
      if (e.origin !== url.origin) {
        return;
      }

      // check source
      if (e.source !== iframeEl.current.contentWindow) {
        return;
      }

      // check data
      if (!e.data || !e.data.type) {
        return;
      }

      switch (e.data.type) {
        case "CLOSE":
          onRequestClose();
          break;
      }
    };

    const window = iframeEl.current.ownerDocument.defaultView;

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <>
      <iframe
        ref={iframeEl}
        src={src}
        style={{
          position: "relative",
          display: loaded ? "block" : "none",
          width: "100%",
          maxWidth: "1140px",
          height: "90%",
          maxHeight: "967px",
          border: 0,
          borderRadius: "7px"
        }}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && (
        <EditorIcon
          icon="nc-circle-02"
          className="brz-ed-animated--spin"
          style={{ fontSize: "30px", color: "rgba(255, 255, 255, 0.75)" }}
        />
      )}
    </>
  );
}
