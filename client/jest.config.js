module.exports = {
    "testPathDirs": ["/client/src/services"]
  }


  const jestConfig = {
    verbose: true,
    collectCoverageFrom: ['/tests/*.js'],
    transform:{
      '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    }

  }

  module.exports = jestConfig