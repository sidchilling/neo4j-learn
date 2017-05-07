import GraphDAO from './GraphDAO.js'
import chalk from 'chalk'
import GraphUtils from './GraphUtils.js'

const runQuery = () => {
  const q = `
    MATCH (n) RETURN n
  `;
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q));
  return GraphDAO.cypher(q)
  .then(data => {
    const results = GraphUtils.convertCypherResultToObject(data);
    console.log(chalk.magenta('[Results]'), chalk.dim(JSON.stringify(results)));
    return Promise.resolve()
  })
}

const runFunction = () => {
  return runQuery()
  .then(() => {
    console.log(chalk.bold.cyan('[FINISHED]'));
  })
}

runFunction()
.then(() => {
  GraphDAO.shutdown();
})