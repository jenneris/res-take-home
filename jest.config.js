module.exports = {
    "testPathDirs": ["/client/src/services"]
  }


  const jestConfig = {
    verbose: true,
    'transform': {
      '^.+\\.jsx?$': 'babel-jest',
    },
    collectCoverageFrom: ['/tests/*.js'],
  }

  module.exports = jestConfig