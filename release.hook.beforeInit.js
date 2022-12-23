const shell = require('shelljs')

shell.exec(`git checkout main`, { silent: true })
shell.exec(`git merge dev`, { silent: false })
shell.exec(`git push origin main`, { silent: true })
