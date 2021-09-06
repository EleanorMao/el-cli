import os from 'os'
import path from 'path'

export const basePath = path.join(os.homedir(), '.el-cli')
export const templatePath = path.join(basePath, 'templates')
export const globalConfigPath = path.join(basePath, 'global-config.json')
export const configFileName = 'el-cli.json'
