const glob = require('fast-glob');

async function findJsFiles(projectPath) {
    return glob(['**/*.{js,jsx,ts,tsx}', '!node_modules/**'], {
        cwd: projectPath,
        absolute: true
    })
}

module.exports = { findJsFiles }