declare module 'download-git-repo' {
  export default function (repoPath: string, dest: string, option: any, cb: (error: any, rlt: any) => void): void
}

declare module 'node-diff3' {
  type fileContent = string | string[]

  export function merge(fileA: fileContent, fileB: fileContent, fileC: fileContent): {
    result: string[],
    conflict: boolean
  }
}
