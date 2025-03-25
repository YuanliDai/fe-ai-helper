const { analyzeDeps } = require('../src/ast-analyzer');
const fs = require('fs')
const path = require('path')

// Create temporary test project
const createTestProject = (files) => {
    const projectPath = path.join(__dirname, 'test-project');
    fs.mkdirSync(projectPath, { recursive: true });

    // Create package.json
    fs.writeFileSync(
        path.join(projectPath, 'package.json'),
        JSON.stringify({
            dependencies: { lodash: '^4.17.0', react: '^18.0.0'}
        })
    );

    // Create test files
    files.forEach(([filename,content])=> {
        fs.writeFileSync(path.join(projectPath,filename), content)
    })
    return projectPath;
}

describe('Dependency Analysis', () => {
    let projectPath;

    afterEach(() => {
        // Clean up test project
        fs.rmSync(projectPath, { recursive: true });
    })

    test('Should detect unused loadsh based on import', async() => {
        projectPath = createTestProject([
            ['index.js', 'import React from "react";\nconsole.log("Hello");']
        ])


    const result = await analyzeDeps(projectPath)
    expect(result.unusedDeps).toContain('lodash');
    expect(result.unusedDeps).not.toContain('react');
    });

    test('Should detect unused loadsh based on require', async() => {
        projectPath = createTestProject([
            ['index.js', 'const React = require("react");\nconsole.log("Hello");']
        ])

    const result = await analyzeDeps(projectPath)
    expect(result.unusedDeps).toContain('lodash');
    expect(result.unusedDeps).not.toContain('react');
    });
})