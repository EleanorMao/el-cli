import glob from 'glob'
import path from 'path'
import {isFileExist} from '../utils/common'
import BasicGenerator from './BaseGenerator'

interface IProps {
  args: any
  destPath: string
}

export default class RepoGenerator extends BasicGenerator {
  version: string
  repoUrl: string

  constructor(options: IProps) {
    const {version = 'default', repoUrl = ''} = options.args || {}
    super({
      generatorPath: path.join(__dirname, 'RepoGenerator.js'),
      ...options
    })
    this.version = version
    this.repoUrl = repoUrl
  }

  async prompting() {
    const promptConfigPath = this.templatePath('.prompt.config.js')
    const promptExit = await isFileExist(promptConfigPath)
    if (promptExit) {
      const rawPrompts = require(promptConfigPath)
      let prompts
      if (Array.isArray(rawPrompts)) {
        prompts = rawPrompts
      } else if (typeof rawPrompts === 'function') {
        prompts = rawPrompts({
          projectName: this.projectName,
        })
      }
      if (prompts) {
        this.answer = await this.prompt(prompts)
      }
    }
  }

  writing() {
    const files = glob.sync('**/*', {
      cwd: this.templatePath(),
      dot: true,
      nodir: true
    })

    this.writeFiles(files.filter(this.filterFile))
  }

  async install() {
    const installer = this.answer?.installer
    if (installer) {
      this.env.options.nodePackageManager = installer
    }
  }

  end() {
    super.end();
  }
}

