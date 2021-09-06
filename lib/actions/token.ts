import chalk from "chalk";
import {saveConfigToFile, globalConfig} from '../config/globalConfig'

export async function setToken(gitlabToken: string) {
  await saveConfigToFile(JSON.stringify({
    ...globalConfig,
    gitlabToken,
  }, null, 2))

  console.log(chalk.green(`[el-cli] add gitlab token ${chalk.cyan(gitlabToken)} success`))
}

export async function getToken() {
  if (!globalConfig.gitlabToken) {
    console.log(chalk.yellow(`[el-cli] no gitlab token found`))
  } else {
    console.log(`[el-cli] ${chalk.cyan(globalConfig.gitlabToken)}`)
  }
}
