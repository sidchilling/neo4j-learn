import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'

const sampleVariableQuery = () => {
  const q = `
    MATCH (n)-->(b)
    RETURN b
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const main = () => {
  return sampleVariableQuery()
  .then(() => {
    GraphDAO.shutdown()
  })
}

main()
