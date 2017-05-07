import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import DeleteGraph from './delete.js'
import _ from 'lodash'

const createGraph = () => {
  const q = `
    CREATE (adam: GUser { name: 'Adam' }), (pernilla: GUser { name: 'Pernilla' }),
    (david: GUser { name: 'David' }),
    (adam)-[r1: FRIEND]->(pernilla)-[r2:FRIEND]->(david)
    RETURN adam, pernilla, david, r1, r2
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Q]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const adamsUniqueFriendsOfFriends = () => {
  const q = `
    MATCH (adamUser: GUser { name: 'Adam' })-[r1: FRIEND]->()-[r2: FRIEND]->(fof: GUser)
    RETURN fof
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const userName = row.fof.properties.name
      console.log(chalk.magenta('[FoF Name]'), chalk.bold(userName))
    })
    return Promise.resolve()
  })
}

const admasNonUniqueFriendsOfFriends = () => {
  const q = `
    MATCH (adamUser: GUser { name: 'Adam' })-[r1: FRIEND]-(friend: GUser)
    MATCH (friend)-[r2: FRIEND]-(fof: GUser)
    RETURN fof
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const fofName = row.fof.properties.name
      console.log(chalk.magenta('[FoF Name]'), chalk.bold(fofName))
    })
    return Promise.resolve()
  })
}

const fofQueryWithDifferentStatements = () => {
  const q = `
    MATCH (adamUser: GUser { name: 'Adam' })-[r1: FRIEND]-(friend: GUser),
    (friend)-[r2: FRIEND]-(fof: GUser)
    RETURN fof
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const fofName = row.fof.properties.name
      console.log(chalk.magenta('[FoF Name]'), chalk.bold(fofName))
    })
    return Promise.resolve()
  })
}

const main = () => {
  console.log(chalk.bold.cyan('[STARTING]'))
  return DeleteGraph.deleteAllFromGraph()
  .then(() => {
    return createGraph()
  })
  .then(() => {
    return adamsUniqueFriendsOfFriends()
  })
  .then(() => {
    return admasNonUniqueFriendsOfFriends()
  })
  .then(() => {
    return fofQueryWithDifferentStatements()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()
