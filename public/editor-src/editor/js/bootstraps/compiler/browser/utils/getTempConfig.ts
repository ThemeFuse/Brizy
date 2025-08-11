import { Arr, Err, Obj, Str, pipe } from "@brizy/readers";
import { mPipe, parseStrict } from "fp-utilities";
import { Media } from "visual/global/Config/types/configs/ConfigCommon";
import { ThirdPartyComponentsHosts } from "visual/global/Config/types/configs/ThirdParty";

interface TempConfig {
  thirdPartyComponentHosts?: ThirdPartyComponentsHosts;
  urls?: {
    templateIcons?: string;
    compileTemplateIcons?: string;
  };
  api?: {
    media?: Pick<Media, "mediaResizeUrl">;
  };
}

const parseComponents = mPipe(
  Obj.read,
  parseStrict({
    name: pipe(
      mPipe(Obj.readKey("name"), Str.read),
      Err.throwOnNullish("Invalid name")
    ),
    host: pipe(
      mPipe(Obj.readKey("host"), Str.read),
      Err.throwOnNullish("Invalid host")
    )
  })
);

const parse = mPipe(
  Obj.read,
  Obj.readKey("thirdPartyComponentHosts"),
  Arr.readWithItemReader(parseComponents)
);

const parseIcons = mPipe(
  Obj.read,
  Obj.readKey("urls"),
  Obj.read,
  Obj.readKey("templateIcons"),
  Str.read
);

const parseCompileIcons = mPipe(
  Obj.read,
  Obj.readKey("urls"),
  Obj.read,
  Obj.readKey("compileTemplateIcons"),
  Str.read
);

const parseMediaResizeUrl = mPipe(
  Obj.read,
  Obj.readKey("api"),
  Obj.read,
  Obj.readKey("media"),
  Obj.read,
  Obj.readKey("mediaResizeUrl"),
  Str.read
);

export function getTempConfig(config: unknown): TempConfig {
  const thirdPartyComponentHosts = parse(config);
  const templateIcons = parseIcons(config);
  const compileTemplateIcons = parseCompileIcons(config);
  const mediaResizeUrl = parseMediaResizeUrl(config);

  return thirdPartyComponentHosts
    ? {
        thirdPartyComponentHosts,
        urls: {
          templateIcons: templateIcons,
          compileTemplateIcons: compileTemplateIcons
        },
        api: {
          media: {
            mediaResizeUrl
          }
        }
      }
    : {};
}
