export enum PROJECT_C4DT_STATUS {
  ACTIVE = "Active",
  RETIRED = "Retired"
}
export enum PROJECT_LAB_STATUS {
  ACTIVE = "Active"
}
export enum PROJECT_STATUS_DESC {
  C4DT_STATUS = "C4DT support status:",
  LAB_STATUS = "Lab support status:"
}
export const FACTORY_EMAIL_ADDRESS = "factory@c4dt.org";
export const MATURITY_EVALUATION_REQUEST = `mailto:${FACTORY_EMAIL_ADDRESS}?subject={name}: maturity evaluation request&body=Dear Factory team, please create a maturity evaluation for '{name}'.`;
export enum TAB_IDS {
  INCUBATOR = "incubator",
  PAPERS = "papers",
  ARTICLES = "articles",
  TECHNICAL = "technical"
}
