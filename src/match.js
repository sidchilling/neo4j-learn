import chalk from 'chalk'
import GraphUtils from '../GraphUtils.js'
import GraphDAO from '../GraphDAO.js'
import DeleteGraph from './delete.js'
import _ from 'lodash'

const createGraph = () => {
  const q = `
    CREATE (oliver: Person { name: 'Oliver Stone' }),
           (michael: Person { name: 'Michael Douglas' }),
           (charlie: Person { name: 'Charlie Sheen' }),
           (martin: Person { name: 'Martin Sheen' }),
           (rob: Person { name: 'Rob Reiner' }),

           (wallstreet: Movie { name: 'Wallstreet' }),
           (president: Movie { name: 'The American President' }),

           (oliver)-[:DIRECTED]->(wallstreet),
           (michael)-[:ACTED_IN { role: 'Gordon Gekko' }]->(wallstreet),
           (charlie)-[:ACTED_IN { role: 'Bud Fox' }]->(wallstreet),
           (michael)-[:ACTED_IN { role: 'President Andrew Shepherd' }]->(president),
           (martin)-[:ACTED_IN { role: 'Carl Fox' }]->(wallstreet),
           (martin)-[:ACTED_IN { role: 'A.J.MacInerney' }]->(president),
           (rob)-[:DIRECTED]->(president)
    RETURN oliver
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const allNodes = () => {
  const q = `
    MATCH (n)
    RETURN n
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    return Promise.resolve()
  })
}

const multipleRelationshipTypes = () => {
  const q = `
    MATCH (wallstreet: Movie { name: 'Wallstreet' })<-[r:ACTED_IN|DIRECTED]-(p: Person)
    RETURN p AS person, r AS relationship
  `
  console.log(chalk.dim.magenta('[Q]'), chalk.dim(q))
  return GraphUtils.runQueryAndFetchResult(q)
  .then(result => {
    console.log(chalk.dim.magenta('[Result]'), chalk.dim(JSON.stringify(result)))
    _.forEach(result, row => {
      const personName = row.person.properties.name
      const relationship = row.relationship.type
      console.log(chalk.magenta('[Person]'), chalk.bold(personName),
          chalk.magenta('[Relationship]'), chalk.bold(relationship))
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
    return allNodes()
  })
  .then(() => {
    return multipleRelationshipTypes()
  })
  .then(() => {
    console.log(chalk.bold.cyan('[ENDING]'))
    GraphDAO.shutdown()
  })
}

main()