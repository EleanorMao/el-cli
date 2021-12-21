import fs from 'fs'
import {promisify} from 'util'
import {basePath, globalConfigPath} from './common'
import {checkPath} from '../utils/common'
import {IGlobalConfig} from '../types/interface'

const fsWriteFile = promisify(fs.writeFile)

let globalConfig: IGlobalConfig = {
  customRepos: [],
  officialRepos: [],
  baseConfig: {
    url: '',
    token: '',
    templatesGroupId: ''
  },
}

try {
  globalConfig = require(globalConfigPath)
} catch (error) {
}

export async function saveConfigToFile(config: IGlobalConfig): Promise<void> {
  return checkPath(basePath).then(() => {
    return fsWriteFile(globalConfigPath, JSON.stringify(config, null, 2))
  })
}

export {
  globalConfig,
}
