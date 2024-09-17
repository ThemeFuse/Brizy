import { ThirdPartyComponentsHosts } from "visual/global/Config/types/configs/ThirdParty";
import { mPipe, parseStrict } from "fp-utilities";
import { Err, Str, Arr, Obj, pipe } from "@brizy/readers";

interface TempConfig {
  thirdPartyComponentHosts?: ThirdPartyComponentsHosts;
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

export function getTempConfig(config: unknown): TempConfig {
  const thirdPartyComponentHosts = parse(config);
  return thirdPartyComponentHosts ? { thirdPartyComponentHosts } : {};
}
