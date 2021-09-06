import fs from 'fs'
import ora from 'ora'
import {promisify} from 'util'

export const fsAccess = promisify(fs.access)
export const fsMkdir = promisify(fs.mkdir)
export const fsReadFile = promisify(fs.readFile)

export function isFileExist(path: string) {
  return fsAccess(path, fs.constants.F_OK).then(() => true).catch(() => false)
}

export function checkPath(path: string) {
  return isFileExist(path)
    .then((res) => {
      return res ? Promise.resolve() : fsMkdir(path, {recursive: true}) as Promise<any>
    })
}

interface IOraText {
  loading?: string
  success?: string
  fail?: string
}

export function oraWrap(pms: Promise<any>, textOps: IOraText) {
  const spinner = ora(textOps.loading || 'loading').start()
  return pms
    .then(res => {
      spinner.succeed(textOps.success || 'succeed')
      return res
    })
    .catch(error => {
      spinner.fail(textOps.fail || 'fail')
      return Promise.reject(error)
    })
}

export function getGitNameFromPath(gitPath: string) {
  const regexp = gitPath.startsWith('http') ? /http\:\/\/[^\/]+\/([^#]+)#?(.+)?/ : /^[^:]+:(.+)\.git#?(.+)?/
  const matches = gitPath.match(regexp)
  if (!matches) {
    throw new Error('invalid gitlab path')
  } else {
    const [, gitName, version = 'default'] = matches;
    return {
      gitName,
      version
    }
  }
}
