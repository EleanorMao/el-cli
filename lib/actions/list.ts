import chalk from "chalk";
import {globalConfig} from "../config/globalConfig";

export default function list() {
  const templateList = [
    ...globalConfig.officialRepos,
    ...globalConfig.customRepos
  ]
    .map(repo => (chalk.blue`* ${chalk.bold(repo.name)} ${chalk.grey`(${repo.url})`}`))
  console.log(templateList.join('\n'))
}
