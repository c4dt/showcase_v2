export enum PROJECT_C4DT_STATUS {
  ACTIVE = "Active",
  RETIRED = "Retired",
  INACTIVE = "Inactive"
}
export enum PROJECT_LAB_STATUS {
  ACTIVE = "Active",
  UNKNOWN = "Unknown"
}
export enum PROJECT_STATUS_DESC {
  C4DT_STATUS = "C4DT support status:",
  LAB_STATUS = "Lab support status:"
}
export const PROJECT_STATUS_ICONS = {
  [PROJECT_C4DT_STATUS.ACTIVE]: "\u{2705}",
  [PROJECT_C4DT_STATUS.RETIRED]: "\u{23F8}",
  [PROJECT_C4DT_STATUS.INACTIVE]: "\u{2026}",
  [PROJECT_LAB_STATUS.ACTIVE]: "\u{2705}",
  [PROJECT_LAB_STATUS.UNKNOWN]: "\u{2026}"
};
export const FACTORY_EMAIL_ADDRESS = "factory@c4dt.org";
export const MATURITY_EVALUATION_REQUEST = `mailto:${FACTORY_EMAIL_ADDRESS}?subject={name}: maturity evaluation request&body=Dear Factory team, please create a maturity evaluation for '{name}'.`;
export enum TAB_IDS {
  INCUBATOR = "incubator",
  PAPERS = "papers",
  ARTICLES = "articles",
  TECHNICAL = "technical"
}
