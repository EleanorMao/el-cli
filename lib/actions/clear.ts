import inquirer from 'inquirer'
import {globalConfig} from '../config/globalConfig'
import {getGitNameFromPath, isFileExist} from '../utils/common'
import chalk from "chalk";
import path from "path";
import fs from 'fs';
import {templatePath} from '../config/common';

export default async function clearAction(repoName?: string, version?: string) {
  const repos = [
    ...globalConfig.officialRepos,
    ...globalConfig.customRepos
  ]
  let repoUrl
  if (!repoName) {
    const {url} = await inquirer.prompt([
      {
        type: 'list',
        name: 'url',
        message: 'please select a template',
        choices: repos.map(repo => ({
          name: `${repo.name} <${repo.url}>`,
          value: repo.url
        })),
        validate: (value = '') => value !== '' || 'please select a template'
      }
    ])

    repoUrl = url
  } else {
    const targetRepo = repos.find(it => it.name === repoName)
    if (targetRepo) {
      repoUrl = targetRepo.url
    } else {
      console.log(chalk.yellow`[el-cli] cannot find target repo`)
      return
    }
  }

  const {gitName: tempRepoName} = getGitNameFromPath(repoUrl)
  const localPath = path.join(templatePath, tempRepoName, version || '')
  const isExist = await isFileExist(localPath)
  if (isExist) {
    fs.rmdirSync(localPath, {recursive: true})
  }

  console.log(chalk.green('[el-cli] clear success'))
}
