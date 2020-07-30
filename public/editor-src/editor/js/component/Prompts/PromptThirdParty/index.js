import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import Fixed from "../Fixed";
import EditorIcon from "visual/component/EditorIcon";

export function PromptThirdParty({ iframeSrc, opened, onClose }) {
  return (
    <Fixed opened={opened} onClose={onClose}>
      <ThirdPartyIframe src={iframeSrc} onRequestClose={onClose} />
    </Fixed>
  );
}

PromptThirdParty.defaultProps = {
  iframeSrc: "",
  opened: false,
  onClose: _.noop
};

PromptThirdParty.propTypes = {
  iframeSrc: PropTypes.string.isRequired,
  opened: PropTypes.bool,
  onClose: PropTypes.func
};

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
        case "NAVIGATE":
          if (e.data.url) {
            if (
              process.env.NODE_ENV === "development" &&
              TARGET === "node_local"
            ) {
              const url = new URL(window.parent.location.href);
              const match = /\/(\d+)(?:$|\/(internal_popup))/.exec(e.data.url);

              if (match) {
                const [, pageId, isInternalPopup] = match;

                url.pathname = isInternalPopup
                  ? `editor/${pageId}/internal_popup`
                  : `editor/${pageId}`;
              } else {
                url.pathname = "editor";
              }

              window.parent.location.href = url.toString();
            } else {
              window.parent.location.href = e.data.url;
            }
          }
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
        title="ThirdParty"
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

ThirdPartyIframe.defaultProps = {
  src: "",
  onRequestClose: _.noop
};
ThirdPartyIframe.propTypes = {
  src: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func
};
