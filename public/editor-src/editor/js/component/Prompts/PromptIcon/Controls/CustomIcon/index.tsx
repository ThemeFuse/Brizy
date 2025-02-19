import { Num } from "@brizy/readers";
import { Size } from "@brizy/ui/es/Card/utils";
import { IconSetData } from "@brizy/ui/es/IconSet";
import { Literal } from "@brizy/ui/es/types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Align } from "visual/component/Brizy-ui/Align";
import { Button } from "visual/component/Brizy-ui/Button";
import { Card } from "visual/component/Brizy-ui/Card";
import { Icon } from "visual/component/Brizy-ui/Icon";
import { IconSet } from "visual/component/Brizy-ui/IconSet";
import { ToastNotification } from "visual/component/Notifications";
import { IconTypes } from "visual/config/icons/Type";
import { addCustomIcon, deleteCustomIcon } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { templateIconUrl } from "visual/utils/icons";
import { Props } from "./types";
import { normalizeCustomIcons } from "./utils";

const wrapperSize: Size = { custom: [0, 0] };

export const CustomIcon = ({
  icons,
  onChange,
  canUpload = true,
  name,
  config
}: Props): JSX.Element => {
  const [_icons, setIcons] = useState(icons);

  useEffect(() => {
    setIcons(icons);
  }, [icons]);

  const activeIndex = useMemo(() => {
    return _icons.findIndex(({ name: iconName }) => name === iconName);
  }, [_icons, name]);

  const normalisedData: IconSetData<number>[] = useMemo(
    () =>
      _icons.map(({ name, filename }, index) => ({
        id: index,
        source: (
          <Icon
            source={templateIconUrl({
              iconName: name,
              type: IconTypes.Custom,
              filename,
              config
            })}
            size="30px"
            hoverColor="white"
            color="black"
          />
        )
      })),
    [_icons, config]
  );

  const handleRemove = useCallback(
    async (id: Literal) => {
      const index = Num.read(id);

      if (index === undefined) {
        return;
      }

      const { name } = _icons[index] ?? {};

      try {
        await deleteCustomIcon(name, config.api);
        setIcons((icons) => icons.filter((icon) => icon.name !== name));
      } catch (e) {
        typeof e === "string"
          ? ToastNotification.error(e)
          : ToastNotification.error(t("Failed to delete icon"));
      }
    },
    [_icons, config.api]
  );

  const handleUpload = useCallback(async () => {
    try {
      const uploadedIcons = await addCustomIcon(config.api, {
        acceptedExtensions: [".svg", ".ico"]
      });

      const normalisedIcons = uploadedIcons.map(normalizeCustomIcons);
      setIcons((icons) => [...normalisedIcons, ...icons]);
    } catch (e) {
      typeof e === "string"
        ? ToastNotification.error(e)
        : ToastNotification.error(t("Failed to upload icon"));
    }
  }, [config.api]);

  const handleChange = useCallback(
    (index: Literal) => {
      const indexNumber = Num.read(index);

      if (indexNumber === undefined) {
        return;
      }

      const { name, filename, type } = _icons[indexNumber] ?? {};

      if (name) {
        onChange({
          name,
          type,
          filename
        });
      }
    },
    [_icons, onChange]
  );

  return (
    <Card color="gray-lightest" size={wrapperSize}>
      <Card height="80px" color="gray-light">
        <Align align="center" alignY="center">
          <Button color="blue" onClick={handleUpload} disabled={!canUpload}>
            {t("Upload Icon")}
          </Button>
        </Align>
      </Card>
      <IconSet
        data={normalisedData}
        itemSize={68}
        onChange={handleChange}
        active={activeIndex}
        height={553}
        spacing={3}
        background="gray-lightest"
        onRemove={handleRemove}
      />
    </Card>
  );
};
