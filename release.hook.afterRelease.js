const shell = require('shelljs')

const mergeToBranches = ["main"]
const workingBranch = process.argv[2]
const commitMessage = process.argv[3]

mergeToBranches.forEach(branch => {
  // return to original branch
  shell.exec(`git checkout dev`, { silent: true })
})
