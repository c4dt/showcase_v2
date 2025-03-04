import { loadConfiguration } from "@/utils/loadData";

export default defineEventHandler(() => {
  return loadConfiguration();
});
