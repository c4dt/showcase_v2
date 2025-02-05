import { loadProjects } from "@/utils/loadData";


export default defineEventHandler((event) => { return loadProjects(); })
