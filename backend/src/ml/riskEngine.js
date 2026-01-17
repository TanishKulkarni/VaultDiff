const RISK_RULES = [
  {
    pattern: /shall indemnify/i,
    level: "high",
    category: "legal",
    signal: "indemnification_obligation"
  },
  {
    pattern: /sole discretion/i,
    level: "medium",
    category: "operational",
    signal: "unilateral_control"
  },
  {
    pattern: /without notice/i,
    level: "medium",
    category: "operational",
    signal: "lack_of_notice"
  },
  {
    pattern: /unlimited liability/i,
    level: "high",
    category: "financial",
    signal: "unbounded_liability"
  }
];

// Default fallback
const DEFAULT_RISK = {
  level: "low",
  category: "general",
  signal: "no_known_risk_pattern"
};

export function detectRisk(text) {
  for (const rule of RISK_RULES) {
    if (rule.pattern.test(text)) {
      return {
        risk_level: rule.level,
        risk_category: rule.category,
        risk_signal: rule.signal
      };
    }
  }

  return {
    risk_level: DEFAULT_RISK.level,
    risk_category: DEFAULT_RISK.category,
    risk_signal: DEFAULT_RISK.signal
  };
}
