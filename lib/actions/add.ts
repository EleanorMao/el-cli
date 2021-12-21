import inquirer from 'inquirer'
import {saveConfigToFile, globalConfig} from '../config/globalConfig'
import {getGitNameFromPath} from '../utils/common'
import chalk from "chalk";

export default async function addAction(gitUrl?: string) {
  if (!gitUrl) {
    const {repoUrl} = await inquirer.prompt([
      {
        type: 'input',
        name: 'repoUrl',
        message: 'please input a git repo url',
        validate: (value = '') => value !== '' || 'please input a git url'
      }
    ])

    gitUrl = repoUrl
  }

  if (!globalConfig.customRepos.some(repo => repo.url === gitUrl)) {
    const {gitName} = getGitNameFromPath(gitUrl)

    const customRepos = [
      ...globalConfig.customRepos,
      {
        name: gitName,
        url: gitUrl
      }
    ]

    const newGlobalConfig = {
      ...globalConfig,
      customRepos
    }

    await saveConfigToFile(newGlobalConfig)
    console.log(chalk.green`[el-cli] success`)
  }

  return {repoUrl: gitUrl}
}
