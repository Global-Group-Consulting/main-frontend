const showdown = require('showdown')
const fs = require("fs")

const converter = new showdown.Converter()
const text = fs.readFileSync("CHANGELOG.md", "utf8")
const html = converter.makeHtml(text);

fs.writeFileSync("static/changelog.js", `module.exports = \`${html}\``)
