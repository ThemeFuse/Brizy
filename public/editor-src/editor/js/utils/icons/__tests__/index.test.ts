import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { getCustomIconUrl } from "../utils";

describe("Test getCustomIconUrl function", () => {
  const config = {
    api: {
      customIcon: {
        iconUrl: "https://beta1.brizydemo.com/customicon",
        iconPattern: {
          original: "{{ [baseUrl] }}/{{ [uid] }}/{{ [fileName] }}"
        }
      }
    }
  } as ConfigCommon;

  const iconName = "9560822af44b2a9c0b97d72fa3a5823abe9a";
  const filename = "bacteria.svg";

  test("Should return an empty string", () => {
    expect(getCustomIconUrl({} as ConfigCommon, iconName, filename)).toEqual(
      ""
    );
  });

  test("Should return a custom icon url", () => {
    expect(getCustomIconUrl(config, iconName, filename)).toEqual(
      "https://beta1.brizydemo.com/customicon/9560822af44b2a9c0b97d72fa3a5823abe9a/bacteria.svg"
    );
  });

  test("Should return a valid icon url without [fileName] pattern", () => {
    const _config = {
      api: {
        customIcon: {
          iconUrl: "https://beta1.brizydemo.com/customicon",
          iconPattern: {
            original: "{{ [baseUrl] }}/{{ [uid] }}"
          }
        }
      }
    } as ConfigCommon;

    expect(getCustomIconUrl(_config, iconName)).toEqual(
      "https://beta1.brizydemo.com/customicon/9560822af44b2a9c0b97d72fa3a5823abe9a"
    );
  });

  test("Should also work with {{placeholder}} format for baseUrl", () => {
    const _config = {
      api: {
        customIcon: {
          iconUrl: "{{brizy_dc_url_site}}",
          iconPattern: {
            original: "{{ [baseUrl] }}/{{ [uid] }}"
          }
        }
      }
    } as ConfigCommon;

    expect(getCustomIconUrl(_config, iconName)).toEqual(
      "{{brizy_dc_url_site}}/9560822af44b2a9c0b97d72fa3a5823abe9a"
    );
  });
});
