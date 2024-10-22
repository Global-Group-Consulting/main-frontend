const shell = require('shelljs')

// check if the user is on main branch.
const branch = shell.exec('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout

// if not, then we throw an error
if (branch.trim() !== 'master') {
  throw new Error('You are not on the main branch. You\'re on ' + branch)
}

// bump version patch
shell.exec('npm version patch')

// get new version
const version = require('./package.json').version

// push all to origin
shell.exec(`git push origin main`, { silent: true })
