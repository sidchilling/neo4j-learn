import GraphDAO from '../GraphDAO.js'
import GraphUtils from '../GraphUtils.js'
import chalk from 'chalk'

const deleteAllFromGraph = () => {
  const q = `
    MATCH (n)
    DETACH DELETE n
  `;
  return GraphDAO.cypher(q)
  .then(data => {
    const results = GraphUtils.convertCypherResultToObject(data);
    console.log(chalk.dim.magenta('[Results]'), chalk.dim(JSON.stringify(results)));
    return Promise.resolve();
  })
}

const main = () => {
  console.log(chalk.bold.cyan('[STARTING]'))
  return deleteAllFromGraph()
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

// main()

exports.deleteAllFromGraph = deleteAllFromGraph