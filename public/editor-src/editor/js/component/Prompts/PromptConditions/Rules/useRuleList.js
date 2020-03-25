import { useState, useEffect } from "react";
import { disableAlreadyUsedRules } from "./utils";

import { getPages } from "visual/utils/api/editor";

export default function useRuleList(rules) {
  const [rulesList, setRulesList] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setListLoading(true);
      const pages = (await getPages()) || [];
      setListLoading(false);

      setRulesList([
        {
          title: "Pages",
          value: "page",
          groupValue: 1,
          items: pages.map(({ title, id }) => ({ title, value: id }))
        }
      ]);
    }

    fetchData();
  }, []);

  return [listLoading, disableAlreadyUsedRules(rules, rulesList)];
}
