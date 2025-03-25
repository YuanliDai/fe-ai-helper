const fs = require('fs')
const path = require('path')
const { parse } = require('@babel/parser')
const traverse = require('@babel/traverse').default
const { findJsFiles } = require('./utils')

async function analyzeDeps(projectPath) {
    // 1. Get all dependencies
    const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json')));
    const allDeps = Object.keys(pkg.dependencies || {});

    // 2. Find unused dependencies
    const usedDeps = new Set()
    const files = await findJsFiles(projectPath)

    for(const file of files.slice(0,10)){ //Limit files for debugging
        const code = fs.readFileSync(file, 'utf-8');
        const ast = parse(code, { sourceType: 'module' });

        traverse(ast, {
            ImportDeclaration(path) {
                const source = path.node.source.value;
                if(!source.startsWith('.')) {
                    usedDeps.add(source.split('/')[0]);
                }
            }
        })
    }

    // 3. Return results
    return {
        unusedDeps: allDeps.filter(dep => !usedDeps.has(dep))
    }
}

module.exports = { analyzeDeps }