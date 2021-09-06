import Generator, {GeneratorOptions} from 'yeoman-generator'
import Environment from "yeoman-environment";
import {IAnswerObj} from '../types/interface'
import chalk from "chalk";

interface IOptions {
  args: any
  generatorPath: string
  destPath: string
}

export default class BasicGenerator extends Generator {
  projectName: string
  templateName: string
  answer?: IAnswerObj

  constructor(options: IOptions) {
    const {destPath, generatorPath, args} = options
    const opts: GeneratorOptions = {
      env: Environment.createEnv([], {cwd: destPath}),
      destinationRoot: destPath,
      resolved: require.resolve(generatorPath),
    }


    super([], opts)
    this.sourceRoot(args.tempPath)

    this.projectName = args.projectName
    this.templateName = args.gitName
  }

  get renderState() {
    return {
      projectName: this.projectName,
      ...this.answer || {}
    }
  }

  writeFiles(files: string[]) {
    files.map(filePath => {
      this.fs.copyTpl(
        this.templatePath(filePath),
        this.destinationPath(filePath),
        this.renderState
      )
    });
  }

  filterFile(file: string) {
    return file !== '.prompt.config.js'
  }

  end() {
    console.log(chalk.green`[el-cli] ✨ generate success`)
  }
}
