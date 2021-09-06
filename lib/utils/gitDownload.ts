import downloadGitRepo from 'download-git-repo'
import {promisify} from 'util'
import {globalConfig} from '../config/globalConfig'
import {oraWrap, checkPath, getGitNameFromPath} from './common'

async function gitDownload(gitPath: string, localPath: string): Promise<string> {
  const {gitName, version} = getGitNameFromPath(gitPath)
  return oraWrap(
    checkPath(localPath)
      .then(() => {
        return promisify(downloadGitRepo)(`direct:${globalConfig.baseConfig.url}/${gitName}/-/archive/${version === 'default' ? 'master' : version}/temp.zip`, localPath, {
          clone: false, headers: {
            'Private-Token': globalConfig.baseConfig.token,
          }
        })
      })
      .then(() => {
        return localPath
      }),
    {
      loading: `download ${gitName}(version: ${version})...`,
      success: `download ${gitName}(version: ${version}) success`,
      fail: 'download fail'
    }
  );
}

export default gitDownload
