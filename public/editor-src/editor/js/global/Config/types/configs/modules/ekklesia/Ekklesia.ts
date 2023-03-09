import { Literal } from "visual/utils/types/Literal";

export interface EkklesiaModules {
  groups: Record<string, Literal>;
  events: Record<string, Literal>;
  series: Record<string, Literal>;
  recentSermons: Record<string, Literal>;
  smallgroups: Record<string, Literal>;
  terms: EkklesiaTerms;
  forms: Record<string, string>;
}

interface EkklesiaTerms {
  sermon: Record<string, Literal>;
  event: Record<string, Literal>;
  smallgroup: Record<string, Literal>;
  eventsLvl: EkklesiaParentsChilds;
  smallgroupsLvl: EkklesiaParentsChilds;
}

interface EkklesiaParentsChilds {
  parents: Record<string, Literal>;
  childs: Record<string, Literal>;
}
