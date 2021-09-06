export interface IAnswerObj {
  [key: string]: string
}

export interface IRepoConfig {
  name: string
  url: string
}

export interface IGlobalConfig {
  officialRepos: IRepoConfig[]
  customRepos: IRepoConfig[]
  gitlabToken: string
}

export interface IGitTag {
  name: string
  commit: {
    authored_date: string
  }
}
