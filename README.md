# ELI-Cli

Development Tool that Provides Scaffold Templates

# Usage

```shell
el create <projectName>         # create a project
el list                         # list current templates
el add [gitUrl]                 # add a custom git repo template
el clear [repoName] [version]   # clear stored git repo templates
el remove [repoName]            # remove a custom git repo template
el config                        # set your gitlab information
el config <name> <value>         # set your gitlab information
el config <name>                 # get your gitlab information by name
el config list                   # get your gitlab information
el help [command]               # display help for command
el -h                           # display help for command
el --help                       # display help for command
el -V                           # output the version number
el --version                    # output the version number
```

# Get Started

## Install

```shell
yarn global add el-cli
```

Then you can run command `el` globally

## Set Up

Set your gitlab information.

The configuration will save into your local `~/.el-cli/global-config.json`.

```shell
el config
```

## Create Project

To create a new project, run:

```shell
el create el-app
```

You will be prompted to choose a template. It will list all templates maintain at your templates repo and all your custom templates.
And you can choose to add a new custom template.

```bash
? which repo do you want to create? (Use arrow keys)
❯ el-base-template
  your-custom-template
  add a new git repo    # choose this to add a new custom template

```

After choose a template, you will be prompted to choose a version if any.

```shell
? please choose a version of the template el-base-template? (Use arrow keys)
❯ 1.0.0
  2.0.0
```

Then el-cli will prompt the template customized questions before generate your project.

The downloaded templates will save into `~/.el-cli/templates`.

## Enjoy

# Writing a Custom Template

## write template file

All files in template will be rendered using `ejs` with the prompt results as the data
(if you don't have customized prompts, you will have a `{ projectName: <projectName> }` as default data).
You can use `ejs` grammar to write your template.

* Control flow with `<% %>`
* Escaped output with `<%= %>` (escape function configurable)
* Unescaped raw output with `<%- %>`
* Newline-trim mode ('newline slurping') with `-%>` ending tag
* Whitespace-trim mode (slurp all whitespace) for control flow with `<%_ _%>`

More information: [https://github.com/mde/ejs](https://github.com/mde/ejs)

## prompt

A template may have a `.prompt.config.js` in root directory used to collect user options data.

The `.prompt.config.js` should `module.export` an inquirer questions list, or a function which return an inquirer questions list

Question Object: [https://www.npmjs.com/package/inquirer#question](https://www.npmjs.com/package/inquirer#question)

As function, it will receive `{ projectName: <projectName> }` as input.

### package manager

The `installer` answer will be used to install dependencies.

If don't have, it will follow:
* Inside a Yarn workspace, Yarn is preferred.
* Inside a pnpm workspace, pnpm is preferred.
* If a `package-lock.json` is present, npm is preferred.
* If a `yarn.lock` is present, Yarn is preferred.
* If a `pnpm-lock.yaml` is present, pnpm is preferred.
* If a `node_modules` is present, tries to detect which package manager installed it.

### Examples

#### export a list

```javascript
module.export = [{
  type: 'list',
  name: 'installer',
  default: 'yarn',
  message: 'please select preferred package manager',
  choices: [{
    name: 'yarn',
    value: 'yarn'
  }, {
    name: 'npm',
    value: 'npm'
  }]
}]
```

#### export a function

```javascript
/** receive { projectName } as input **/
module.export = function ({projectName}) {
  return [{
    type: 'input',
    name: 'appName',
    default: projectName,
    message: 'please input your appName',
    validate: v => !!v
  }, {
    type: 'list',
    name: 'installer',
    default: 'yarn',
    message: 'please select preferred package manager',
    choices: [{
      name: 'yarn',
      value: 'yarn'
    }, {
      name: 'npm',
      value: 'npm'
    }]
  }]
}
```
