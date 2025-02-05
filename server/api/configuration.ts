import { loadConfiguration } from "@/utils/loadData";

export default defineEventHandler((event) => {
  return loadConfiguration();
});
