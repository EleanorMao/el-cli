import {fetchAllRepo, getAllRepo} from "../api";
import {globalConfig, saveConfigToFile} from "../config/globalConfig";
import {IGlobalConfig, IRepoConfig} from "../types/interface";
import chalk from "chalk";
import {oraWrap} from "../utils/common";

export async function syncAll(): Promise<IRepoConfig[]> {
  const officialRepos = await getAllRepo()
  const newGlobalConfig: IGlobalConfig = {
    ...globalConfig,
    officialRepos
  }
  await saveConfigToFile(JSON.stringify(newGlobalConfig, null, 2))
  console.log(chalk.green`[el-cli] update global config success`)

  return officialRepos
}

export default async function syncAction(tempName?: string) {
  if (!tempName) {
    const list = await syncAll()
  }
}
