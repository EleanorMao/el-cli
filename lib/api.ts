import axios from 'axios'
import {globalConfig} from './config/globalConfig'
import {IGitTag, IRepoConfig} from './types/interface'
import {oraWrap} from './utils/common';

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response.data;
}, function (error: any) {
  // Do something with response error
  return Promise.reject(error);
});


async function getTagsFromGit(projectName: string): Promise<IGitTag[]> {
  const encodeProjectName = encodeURIComponent(projectName)

  function getTagsByPage(page = 1) {
    return axios({
      method: 'get',
      url: `https://gitlab.com/api/v4/projects/${encodeProjectName}/repository/tags?per_page=100&page=${page}`,
      headers: {
        'Private-Token': globalConfig.gitlabToken,
      }
    }) as Promise<any>
  }

  let rlt: IGitTag[] = []
  let hasMore = true
  let page = 1
  while (hasMore) {
    const res = await getTagsByPage(page)
    rlt.push(...res)
    if (res.length < 100) {
      hasMore = false
    } else {
      page++
    }
  }

  return rlt.sort((a, b) => {
    const {authored_date: dateA} = a.commit
    const {authored_date: dateB} = b.commit
    return dateA < dateB ? 1 : -1
  })
}

export function getTagsByProjectName(projectName: string) {
  return oraWrap(
    getTagsFromGit(projectName),
    {
      loading: `get tags from ${projectName}...`,
      success: `get tags from ${projectName} success`,
      fail: 'get tags fail'
    }
  )
}

export async function fetchAllRepo(): Promise<IRepoConfig[]> {
  const resList: any = await axios({
    method: 'get',
    url: `https://gitlab.com/api/v4/groups/5176/projects`,
    headers: {
      'Private-Token': globalConfig.gitlabToken,
    }
  })
  return (resList as any[]).map<IRepoConfig>(item => {
    return {
      name: item.name,
      url: item.ssh_url_to_repo
    }
  })

}

export function getAllRepo(): Promise<IRepoConfig[]> {
  return oraWrap(
    fetchAllRepo(),
    {
      loading: `fetch all official templates from gitlab...`,
      success: `fetch templates success`,
      fail: 'fetch fail'
    }
  )
}
