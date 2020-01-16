export function getUniqRules(rules) {
  return rules.reduce((acc, item) => {
    const isDuplicate = acc.find(
      ({ appliedFor, entityType }) =>
        appliedFor === item.appliedFor && entityType === item.entityType
    );

    if (!isDuplicate) {
      acc.push(item);
    }

    return acc;
  }, []);
}

export function getRulesListIndexByRule(rulesList, { appliedFor, entityType }) {
  return rulesList.findIndex(
    ({ groupValue, value }) => groupValue === appliedFor && value === entityType
  );
}
