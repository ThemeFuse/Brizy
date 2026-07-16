import React, { JSX, useCallback, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFont } from "visual/redux/actions2";
import {
  adobeFontsSelector,
  defaultFontSelector
} from "visual/redux/selectors";
import { TypedDispatch } from "visual/redux/store";
import { pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { snakeCase } from "visual/utils/string";
import { Context } from "../../common/GlobalApps/Context";
import { Disconnect } from "../../common/GlobalApps/StepsView";
import { isAdobeDisconnectData } from "./types";
import { adobeDisconnectReader } from "./utils";

const AdobeDisconnect = (): JSX.Element => {
  const { app, onDisconnectApp, onChangePrev, onChange } = useContext(Context);
  const { id = null } = isAdobeDisconnectData(app)
    ? adobeDisconnectReader(app)
    : {};

  const adobeFonts = useSelector(adobeFontsSelector);
  const defaultFont = useSelector(defaultFontSelector);
  const dispatch = useDispatch<TypedDispatch>();

  const isAdobeSetDefaultFont = adobeFonts.some(
    (el) => snakeCase(el.family) === defaultFont
  );

  const [nextLoading, setNextLoading] = useState(false);
  const [prevLoading, setPrevLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleNext = useCallback(async () => {
    if (!id) {
      setError(t("Something went wrong"));
      return;
    }

    if (isAdobeSetDefaultFont) {
      setError(
        t(
          "Currently, a font from Adobe Fonts is set as default. Replace it with a non-Adobe font and try again to disconnect your account"
        )
      );
      return;
    }

    setNextLoading(true);
    setError(null);

    if (adobeFonts.length > 0) {
      dispatch(
        deleteFont({
          type: "adobe",
          fonts: adobeFonts
        })
      );
    }

    await pendingRequest();

    onDisconnectApp(id);
    onChange(id, null);
  }, [
    id,
    isAdobeSetDefaultFont,
    adobeFonts,
    onDisconnectApp,
    onChange,
    dispatch
  ]);

  const handlePrev = useCallback(async () => {
    setPrevLoading(true);
    setError(null);

    await pendingRequest();

    onChangePrev("appList");
  }, [onChangePrev]);

  return (
    <Disconnect
      {...app}
      descriptions={t(
        "Are you sure you want to disconnect Adobe Fonts integration?"
      )}
      nextLoading={nextLoading}
      prevLoading={prevLoading}
      error={error}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
};

export default AdobeDisconnect;
