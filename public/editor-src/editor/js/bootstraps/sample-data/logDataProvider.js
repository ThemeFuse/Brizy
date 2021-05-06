import {
  parsePage,
  parseProject,
  parseGlobalBlock
} from "visual/utils/api/adapter";

export function logDataProvider(log) {
  const project = parseProject(JSON.parse(log.prj));

  const pages = JSON.parse(log.paj).map(parsePage);
  const currentPage = pages.find(p => p.id == log.pi);

  const globalBlocks = JSON.parse(log.gj)
    .map(parseGlobalBlock)
    .reduce(
      (acc, { uid, data, meta, rules, position, status, dataVersion }) => {
        acc[uid] = {
          id: uid,
          data,
          meta,
          rules,
          position,
          status,
          dataVersion
        };

        return acc;
      },
      {}
    );

  return {
    project,
    currentPage,
    globalBlocks
  };
}
