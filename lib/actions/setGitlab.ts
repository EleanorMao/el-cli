/*
 * @Author       : Eleanor Mao
 * @Date         : 2021-12-21 18:29:03
 * @LastEditTime : 2021-12-21 18:29:03
 *
 * Copyright © RingCentral. All rights reserved.
 */
import {globalConfig, saveConfigToFile} from '../config/globalConfig'
import inquirer from "inquirer";
import chalk from "chalk";

export async function setGitlab() {
  const data = await inquirer.prompt([{
    type: 'input',
    name: 'url',
    default: globalConfig.baseConfig.url || '',
    message: 'please input your gitlab domain'
  }, {
    type: 'input',
    name: 'templatesGroupId',
    default: globalConfig.baseConfig.templatesGroupId || '',
    message: 'please input your official templates group id'
  }, {
    type: 'input',
    name: 'token',
    default: globalConfig.baseConfig.token || '',
    message: 'please input your personal token'
  }])

  await saveConfigToFile({
    ...globalConfig,
    baseConfig: {
      ...globalConfig.baseConfig,
      ...data,
    }
  })

  await getGitlabConfig()
}

export async function getGitlabConfig() {
  const list = [
    chalk.blue`* ${chalk.bold`url:`} ${chalk.green(globalConfig.baseConfig.url)}`,
    chalk.blue`* ${chalk.bold`templates group ID:`} ${chalk.green(globalConfig.baseConfig.templatesGroupId)}`,
    chalk.blue`* ${chalk.bold`token:`} ${chalk.green(globalConfig.baseConfig.token)}`,
  ]
  console.log(list.join('\n'))
}
