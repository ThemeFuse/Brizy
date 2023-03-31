import { Literal } from "visual/utils/types/Literal";

export interface EkklesiaModules {
  apiUrl: string;
}
export interface EkklesiaResponse {
  data: Partial<EkklesiaFields>;
}

export interface EkklesiaFields {
  groups: Record<string, Literal>;
  events: Record<string, Literal>;
  series: Record<string, Literal>;
  recentSermons: Record<string, Literal>;
  smallgroups: Record<string, Literal>;
  forms: Record<string, string>;
  sermon: Record<string, Literal>;
  event: Record<string, Literal>;
  smallgroup: Record<string, Literal>;
  eventsLvl: EkklesiaParentsChilds;
  smallgroupsLvl: EkklesiaParentsChilds;
}

export interface EkklesiaParentsChilds {
  parents: Record<string, Literal>;
  childs: Record<string, Literal>;
}
