import React, { JSX, useCallback, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { BaseIntegrationContext } from "visual/component/Prompts/common/GlobalApps/type";
import { PromptView } from "visual/component/Prompts/common/PromptView";
import { addFonts } from "visual/redux/actions2";
import { addAdobeFonts, getAdobeFonts, pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { Context } from "../../../common/GlobalApps/Context";
import { isAdobeConnectData } from "../types";
import { adobeConnectReader } from "../utils";
import { Description } from "./components/Description";
import { Items } from "./components/Items";
import { OnBeforeLoadProps, Typekit } from "./types";
import { getApiKeys, getDefaultValue } from "./utils";

const AdobeConnect = (): JSX.Element => {
  const { app, onChangePrev, onChangeNext, config } = useContext(Context);
  const { title = "", img = "" } = isAdobeConnectData(app)
    ? adobeConnectReader(app)
    : {};

  const dispatch = useDispatch();

  const [apiKeyValue, setApiKeyValue] = useState(getDefaultValue());
  const [nextLoading, setNextLoading] = useState(false);
  const [prevLoading, setPrevLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleChange = useCallback(
    (value: string, type: string) => {
      setApiKeyValue((prevState) => ({
        ...prevState,
        [type]: value.trim()
      }));
    },
    [setApiKeyValue]
  );

  const handleNext = useCallback(async () => {
    try {
      const typekit = apiKeyValue.typekit;
      const keysValue = Object.values(apiKeyValue);

      setNextLoading(true);

      const { status } = await addAdobeFonts(config.api, {
        group: "adobe",
        key: typekit
      });

      if (status !== 200) {
        setNextLoading(false);
        setError(t("Something went wrong when creating an account"));
      } else {
        const result = await getAdobeFonts(config.api);

        const fonts = result.kit.families;
        const adobeKitId = result.kit.id;

        if (keysValue.some((key) => !key)) {
          setNextLoading(false);
          setError(t("Field is empty"));
        } else {
          dispatch(
            addFonts([
              {
                type: "adobe",
                id: adobeKitId,
                fonts: fonts
              }
            ])
          );
          onChangeNext("done");
        }
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setNextLoading(false);
      setError(t("An unexpected error occurred"));
    }
  }, [
    config.api,
    apiKeyValue,
    dispatch,
    setNextLoading,
    setError,
    onChangeNext
  ]);

  const handlePrev = useCallback(async () => {
    setPrevLoading(true);
    await pendingRequest();
    onChangePrev("appList");
  }, [setPrevLoading, onChangePrev]);

  const data = getApiKeys().map(({ title, name }) => ({
    title,
    name,
    value: apiKeyValue[name as keyof Typekit]
  }));

  return (
    <PromptView
      img={img}
      title={title}
      error={error}
      description={
        <Description>
          <div>
            {t(
              'In your Adobe account, find "My Adobe Fonts" on the right hand side. Click the Web Projects tab, copy the Project ID and paste it here in the field below.'
            )}
          </div>
        </Description>
      }
      isSaving={nextLoading}
      isCanceling={prevLoading}
      onClickSave={handleNext}
      onClickCancel={handlePrev}
    >
      <Items data={data} onChange={handleChange} />
    </PromptView>
  );
};

AdobeConnect.onBeforeLoad = (
  context: BaseIntegrationContext,
  props: OnBeforeLoadProps
) => {
  if (context.app.data) {
    props.onChangeNext("disconnect");
  }
};
export default AdobeConnect;
