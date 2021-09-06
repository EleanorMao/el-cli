import fs from 'fs'
import {promisify} from 'util'
import {basePath, globalConfigPath} from './common'
import {checkPath} from '../utils/common'
import {IGlobalConfig} from '../types/interface'

const fsWriteFile = promisify(fs.writeFile)

let globalConfig: IGlobalConfig = {
  customRepos: [],
  officialRepos: [],
  gitlabToken: '',
}

try {
  globalConfig = require(globalConfigPath)
} catch (error) {
}

async function saveConfigToFile(config: any): Promise<void> {
  return checkPath(basePath).then(() => {
    return fsWriteFile(globalConfigPath, config)
  })
}

export {
  globalConfig,
  saveConfigToFile
}
