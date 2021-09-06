export interface IAnswerObj {
  [key: string]: string
}

export interface IRepoConfig {
  name: string
  url: string
}

export interface IGitlabGlobalConfig {
  url: string
  token: string
  templatesGroupId: string
}

export interface IGlobalConfig {
  officialRepos: IRepoConfig[]
  customRepos: IRepoConfig[]
  baseConfig: IGitlabGlobalConfig
}

export interface IGitTag {
  name: string
  commit: {
    authored_date: string
  }
}
