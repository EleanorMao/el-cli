import chalk from 'chalk'
import inqurier from 'inquirer'
import addAction from './add'
import RepoGenerator from '../generators/RepoGenerator'
import {isFileExist, getGitNameFromPath} from '../utils/common'
import gitDownload from '../utils/gitDownload'
import {templatePath} from '../config/common'
import {globalConfig} from '../config/globalConfig'
import {IGitTag} from '../types/interface'
import {getTagsByProjectName} from '../api'
import path from "path";
import {syncAll} from "./sync";

export default async function createAction(projectName: string) {
  const destPath = path.join(process.cwd(), projectName)
  const isInCurrentDir = !path.relative(destPath, process.cwd())
  if (!isInCurrentDir && await isFileExist(destPath)) {
    return console.log(chalk.yellow(`[el-cli] project ${projectName} is already exist.`))
  }

  const officialRepos = globalConfig.officialRepos.length ? globalConfig.officialRepos : await syncAll()
  const allRepos = [...officialRepos, ...globalConfig.customRepos]
  const {repoUrl} = await inqurier.prompt([
    {
      type: 'list',
      name: 'repoUrl',
      message: 'which repo do you want to create?',
      choices: [
        ...allRepos.map(repo => ({
          name: repo.name,
          value: repo.url
        })),
        {
          name: 'add a new git repo',
          value: 'new-repo'
        }
      ]
    }
  ]).then(res => {
    return res.repoUrl === 'new-repo' ? addAction() : Promise.resolve(res)
  })

  const {gitName} = getGitNameFromPath(repoUrl)

  let version = 'default'
  const tagsList = await getTagsByProjectName(gitName)
  if (tagsList.length) {
    const answer = await inqurier.prompt([
      {
        type: 'list',
        name: 'version',
        message: `please choose a version of the template ${gitName}`,
        choices: tagsList.map((tagInfo: IGitTag) => {
          return {value: tagInfo.name}
        })
      }
    ])

    version = answer.version
  }

  const localPath = path.join(templatePath, gitName, version)
  const isExist = await isFileExist(localPath)
  const tempPath: string = await (isExist
    ? Promise.resolve(localPath)
    : gitDownload(
      version !== 'default'
        ? `${repoUrl}#${version}` // 通过#分隔仓库和版本
        : repoUrl,
      localPath
    ))

  const args = {
    gitName,
    projectName: isInCurrentDir ? 'new-project' : projectName,
    tempPath,
    version,
    repoUrl,
  }

  const generator = new RepoGenerator({
    args,
    destPath
  })

  const rlt = await generator.run()
}
