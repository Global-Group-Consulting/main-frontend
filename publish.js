const shell = require('shelljs')

// check if the user is on main branch.
const branch = shell.exec('git rev-parse --abbrev-ref HEAD', { silent: true }).stdout

// if not, then we throw an error
if (branch !== 'main') {
  throw new Error('You are not on the main branch')
}

//  build the changelog
require('./changelog')

// bump version patch
shell.exec('npm version patch')

// get new version
const version = require('../package.json').version

// create tag for new version
shell.exec(`git tag v${version}`)

// push all to origin
shell.exec(`git push origin main`, { silent: true })
