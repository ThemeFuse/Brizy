import { sendHeartBeat, sendHeartBeatTakeOver } from "../api";
import { SendHeartBeat } from "../api/types";
import { Config } from "../config";

export function heartBeat(config: Config): SendHeartBeat {
  return {
    async sendHandler(res, rej) {
      try {
        res(await sendHeartBeat(config));
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
