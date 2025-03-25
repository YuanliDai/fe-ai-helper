const { program } = require('commander')
const { analyzeDeps } = require('./ast-analyzer')

program
.command('analyze-deps')
.description('Analyze unused project dependencies')
.action(async() => {
    console.log('Staring dependency analysis...')
    const result = await analyzeDeps(process.cwd())
    console.table(result.unusedDeps)
})

program.parse()
