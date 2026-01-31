const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Caminho para a raiz do projeto Next.js (onde estão o package.json e tsconfig.json)
    dir: './',
})

// Configurações personalizadas do Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jest-environment-jsdom',
}

// Exporta a configuração
module.exports = createJestConfig(customJestConfig)