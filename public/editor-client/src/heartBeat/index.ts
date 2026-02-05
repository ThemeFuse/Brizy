import { sendHeartBeat, sendHeartBeatTakeOver } from "../api";
import { SendHeartBeat } from "../api/types";
import { getConfig } from "../config";
import { resetNonce } from "./utils";

export function heartBeat(): SendHeartBeat {  return {
    async sendHandler(res, rej) {
      try {
        const config = getConfig();
        const data = await sendHeartBeat(config);

        resetNonce(data);
        res(data);
      } catch (e) {
        rej(`API Client: Failed to heartBeat, error: \n\t ${e}`);
      }
    },
    async takeOverHandler(res, rej) {
      try {
        res(await sendHeartBeatTakeOver(config));
      } catch (e) {
        rej(`API Client: Failed to takeOver, error: \n\t ${e}`);
      }
    }
  };
}
