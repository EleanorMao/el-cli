import inquirer from 'inquirer'
import {saveConfigToFile, globalConfig} from '../config/globalConfig'
import {IRepoConfig} from "../types/interface";
import chalk from "chalk";
import clearAction from "./clear";

export default async function removeAction(repoName?: string) {
  if (!globalConfig.customRepos.length) {
    console.log(chalk.green('[el-cli] no custom repo can be remove'))
    return
  }
  if (!repoName) {
    const {name} = await inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: 'please select the repo to be removed',
        choices: globalConfig.customRepos.map(repo => ({
          name: `${repo.name} <${repo.url}>`,
          value: repo.name
        })),
        validate: (value = '') => value !== '' || 'please select a repo'
      }
    ])

    repoName = name
  }

  const customRepos = globalConfig.customRepos.reduce<IRepoConfig[]>((result, item) => {
    if (item.name !== repoName) {
      result.push(item)
    }
    return result
  }, [])

  const newGlobalConfig = {
    ...globalConfig,
    customRepos
  }

  await saveConfigToFile(newGlobalConfig)

  console.log(chalk.green('[el-cli] remove success'))

  clearAction(repoName)
}
