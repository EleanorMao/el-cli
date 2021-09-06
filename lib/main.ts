import {program} from 'commander';
import createAction from './actions/create';
import clearAction from './actions/clear';
import removeAction from './actions/remove';
import syncAction from './actions/sync';
import addAction from './actions/add';
import listAction from './actions/list';
import {setToken, getToken} from './actions/token'

program.version(require('../package').version)

program
  .command('create <projectName>')
  .description('create a project')
  .action(projectName => {
    createAction(projectName).then(() => process.exit(0))
  });

program.command('list')
  .description('list current templates')
  .action(listAction)

program
  .command('add [gitUrl]')
  .description('add a custom git repo template')
  .action(addAction as any)

program
  .command('clear [repoName] [version]')
  .description('clear stored git repo templates')
  .action(clearAction)

program
  .command('remove [repoName]')
  .description('remove a custom git repo template')
  .action(removeAction)

program.parse(process.argv);
