import { ThirdPartyComponentsHosts } from "visual/global/Config/types/configs/ThirdParty";
import { mPipe, parseStrict } from "fp-utilities";
import { Err, Str, Arr, Obj, pipe } from "@brizy/readers";

interface TempConfig {
  thirdPartyComponentHosts?: ThirdPartyComponentsHosts;
  urls?: {
    templateIcons?: string;
    compileTemplateIcons?: string;
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

export function getTempConfig(config: unknown): TempConfig {
  const thirdPartyComponentHosts = parse(config);
  const templateIcons = parseIcons(config);
  const compileTemplateIcons = parseCompileIcons(config);

  return thirdPartyComponentHosts
    ? {
        thirdPartyComponentHosts,
        urls: {
          templateIcons: templateIcons,
          compileTemplateIcons: compileTemplateIcons
        }
      }
    : {};
}
