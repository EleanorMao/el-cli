import {fetchAllRepo, getAllRepo} from "../api";
import {globalConfig, saveConfigToFile} from "../config/globalConfig";
import {IGlobalConfig, IRepoConfig} from "../types/interface";
import chalk from "chalk";
import {oraWrap} from "../utils/common";

export async function syncAll(): Promise<IRepoConfig[]> {
  if (!globalConfig.baseConfig.url) {
    console.log(chalk.yellow`[el-cli] please config first`)
    return []
  }
  const officialRepos = await getAllRepo()
  const newGlobalConfig: IGlobalConfig = {
    ...globalConfig,
    officialRepos
  }
  await saveConfigToFile(newGlobalConfig)
  console.log(chalk.green`[el-cli] update global config success`)

  return officialRepos
}

export default async function syncAction(tempName?: string) {
  const list = await syncAll()
}
