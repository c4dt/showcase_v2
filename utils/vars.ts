import { faCircleCheck, faCirclePause, faEllipsis } from "@fortawesome/free-solid-svg-icons";

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
  C4DT_STATUS = "C4DT",
  LAB_STATUS = "Lab"
}
export const PROJECT_STATUS_ICONS = {
  [PROJECT_C4DT_STATUS.ACTIVE]: faCircleCheck,
  [PROJECT_C4DT_STATUS.RETIRED]: faCirclePause,
  [PROJECT_C4DT_STATUS.INACTIVE]: faEllipsis,
  [PROJECT_LAB_STATUS.ACTIVE]: faCircleCheck,
  [PROJECT_LAB_STATUS.UNKNOWN]: faEllipsis
};
export const FACTORY_EMAIL_ADDRESS = "factory@c4dt.org";
export const MATURITY_EVALUATION_REQUEST = `mailto:${FACTORY_EMAIL_ADDRESS}?subject={name}: maturity evaluation request&body=Dear Factory team, please create a maturity evaluation for '{name}'.`;
export enum TAB_IDS {
  INCUBATOR = "incubator",
  PAPERS = "papers",
  ARTICLES = "articles",
  TECHNICAL = "technical"
}
